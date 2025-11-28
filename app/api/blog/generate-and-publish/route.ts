import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  generateBlogPostFromTopic,
  generateImageForPost,
  generateBlogTopicsBatch,
} from '@/lib/blog/openai';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const cronSecret = process.env.CRON_SECRET || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY non configurati per la route blog/generate-and-publish.'
  );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const runtime = 'nodejs';

// Soglia minima di topic pending
const MIN_PENDING_TOPICS = 5;
// Quanti topic generare quando siamo sotto soglia
const TOPICS_BATCH_SIZE = 12;

async function ensureTopicBuffer() {
  const { count, error } = await supabaseAdmin
    .from('blog_topics')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (error) {
    console.error('Errore conteggio topic pending:', error);
    return;
  }

  const pending = count ?? 0;

  if (pending >= MIN_PENDING_TOPICS) {
    return;
  }

  try {
    const seeds = await generateBlogTopicsBatch(TOPICS_BATCH_SIZE);

    if (!seeds.length) return;

    const toInsert = seeds.map((s) => ({
      topic: s.topic,
      category: s.category,
      target_persona: s.target_persona,
      status: 'pending',
    }));

    const { error: insertError } = await supabaseAdmin
      .from('blog_topics')
      .insert(toInsert);

    if (insertError) {
      console.error('Errore inserimento nuovi topic:', insertError);
    } else {
      console.log(
        `Auto-ripopolazione topic: inseriti ${toInsert.length} nuovi topic.`
      );
    }
  } catch (err) {
    console.error('Errore generazione automatica topic:', err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('secret');
  const isCron = request.headers.get('x-vercel-cron') !== null;

  if (!isCron) {
    if (!cronSecret || token !== cronSecret) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  try {
    // 1. Prossimo topic pending
    const { data: topics, error: topicError } = await supabaseAdmin
      .from('blog_topics')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1);

    if (topicError) {
      console.error('Errore nel recupero topic:', topicError);
      throw new Error(`Errore nel recupero topic: ${topicError.message}`);
    }

    const topic = topics?.[0];

    if (!topic) {
      // Nessun topic → prova comunque ad auto-ripopolare
      await ensureTopicBuffer();
      return NextResponse.json({
        message: 'Nessun topic pending. Ho provato a generarne di nuovi.',
      });
    }

    // 2. Genera articolo (testo + meta immagine)
    const generated = await generateBlogPostFromTopic(topic);

    if (!generated.content_markdown || generated.content_markdown.length < 500) {
      console.error('Articolo generato troppo corto o vuoto:', generated);
      throw new Error('Articolo generato non valido (troppo corto o vuoto).');
    }

    // 3. Genera immagine di copertina (non blocking)
    const imageUrl = await generateImageForPost(
      generated.image_prompt,
      generated.image_style
    );

    // 4. Inserisce articolo nel DB come published
    const publishedAt = new Date().toISOString();

    const { data: insertedPosts, error: insertError } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        slug: generated.slug,
        title: generated.title,
        excerpt: generated.excerpt,
        content_markdown: generated.content_markdown,
        category: generated.category,
        status: 'published',
        published_at: publishedAt,
        created_by: 'ai',
        image_url: imageUrl ?? null,
        image_alt: generated.image_alt || null,
        seo_title: generated.seo_title,
        seo_description: generated.seo_description,
      })
      .select('*')
      .limit(1);

    if (insertError) {
      console.error('Errore inserimento blog_post:', insertError);
      throw new Error(`Errore inserimento articolo: ${insertError.message}`);
    }

    const newPost = insertedPosts?.[0];

    // 5. Marca il topic come used
    const { error: updateTopicError } = await supabaseAdmin
      .from('blog_topics')
      .update({
        status: 'used',
        used_post_id: newPost?.id ?? null,
      })
      .eq('id', topic.id);

    if (updateTopicError) {
      console.error('Errore aggiornamento topic:', updateTopicError);
    }

    // 6. Auto-ripopolazione se scendiamo sotto soglia
    await ensureTopicBuffer();

    return NextResponse.json({
      message: 'Articolo generato e pubblicato con immagine.',
      topic_id: topic.id,
      post_id: newPost?.id,
      slug: newPost?.slug,
      image_url: newPost?.image_url,
    });
  } catch (error: unknown) {
    console.error('Errore in generate-and-publish:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Errore interno nella generazione del blog.';
    return NextResponse.json(
      {
        error: message,
        details: String(error),
      },
      { status: 500 }
    );
  }
}
