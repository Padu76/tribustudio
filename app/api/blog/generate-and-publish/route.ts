// app/api/blog/generate-and-publish/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateBlogPostFromTopic, generateImageForPost } from '@/lib/blog/openai';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const cronSecret = process.env.CRON_SECRET || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY non configurati per la route blog/generate-and-publish.'
  );
}

// Client admin (service role), niente generics per evitare casino con i tipi
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('secret');

  if (!cronSecret || token !== cronSecret) {
    return new NextResponse('Unauthorized', { status: 401 });
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
      return NextResponse.json(
        { error: 'Errore nel recupero topic' },
        { status: 500 }
      );
    }

    const topic = topics?.[0];

    if (!topic) {
      return NextResponse.json({
        message: 'Nessun topic pending. Nulla da generare.',
      });
    }

    // 2. Genera articolo (testo + meta immagine)
    const generated = await generateBlogPostFromTopic(topic);

    if (!generated.content_markdown || generated.content_markdown.length < 500) {
      console.error('Articolo generato troppo corto o vuoto:', generated);
      return NextResponse.json(
        { error: 'Articolo generato non valido.' },
        { status: 500 }
      );
    }

    // 3. Genera immagine di copertina (se possibile)
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
      })
      .select('*')
      .limit(1);

    if (insertError) {
      console.error('Errore inserimento blog_post:', insertError);
      return NextResponse.json(
        { error: 'Errore inserimento articolo' },
        { status: 500 }
      );
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
      // non blocco la pubblicazione se va storto questo
    }

    return NextResponse.json({
      message: 'Articolo generato e pubblicato con immagine.',
      topic_id: topic.id,
      post_id: newPost?.id,
      slug: newPost?.slug,
      image_url: newPost?.image_url,
    });
  } catch (err: unknown) {
    console.error('Errore in generate-and-publish:', err);
    return NextResponse.json(
      { error: 'Errore interno nella generazione del blog.' },
      { status: 500 }
    );
  }
}
