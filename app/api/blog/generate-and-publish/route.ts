import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  generateBlogPostFromTopic,
  generateImageForPost,
  // generateBlogTopicsBatch, // se in futuro vuoi usare auto-ripopolazione
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

// Slug sempre univoco: base dallo slug/titolo e suffisso random
function makeUniqueSlug(baseInput: string): string {
  const base = baseInput
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const random = Math.random().toString(36).substring(2, 7);

  return `${base}-${random}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const isCron = request.headers.get('x-vercel-cron') !== null;

    // Protezione: o arriva dal cron di Vercel o da chiamata manuale con ?secret=
    if (!isCron) {
      if (!cronSecret || secret !== cronSecret) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    // 1) Prendi il prossimo topic pending
    const { data: topics, error: topicError } = await supabaseAdmin
      .from('blog_topics')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1);

    if (topicError) {
      console.error('Errore lettura blog_topics:', topicError);
      return NextResponse.json(
        { error: 'Errore nel recupero dei topic.' },
        { status: 500 }
      );
    }

    const topic = topics?.[0];

    if (!topic) {
      return NextResponse.json(
        { message: 'Nessun topic pending disponibile per la generazione.' },
        { status: 200 }
      );
    }

    // 2) Genera contenuto articolo con OpenAI
    const generated: any = await generateBlogPostFromTopic(topic);

    if (!generated || !generated.title || !generated.content_markdown) {
      throw new Error('Risultato generazione articolo non valido.');
    }

    // 3) Slug univoco
    const baseForSlug =
      (generated.slug as string | undefined) ||
      (generated.title as string) ||
      (topic.topic as string);
    const slug = makeUniqueSlug(baseForSlug);

    // 4) Immagine: prova a generarne una, altrimenti fallback front-end
    let imageUrl: string | null = null;
    try {
      // la firma di generateImageForPost è libera, gener è any → nessun problema
      imageUrl = (await generateImageForPost(generated)) ?? null;
    } catch (imgErr) {
      console.error('Errore generazione immagine, uso fallback:', imgErr);
      imageUrl = null;
    }

    const publishedAt = new Date().toISOString();

    const seoTitle: string =
      (generated.seo_title as string | undefined) || generated.title;
    const seoDescription: string =
      (generated.seo_description as string | undefined) ||
      (generated.excerpt as string | undefined) ||
      'Articolo del blog Tribù Studio su allenamento, alimentazione e motivazione.';

    // 5) Inserisci articolo in blog_posts
    const { data: insertedPosts, error: insertError } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        slug,
        title: generated.title,
        excerpt: generated.excerpt,
        content_markdown: generated.content_markdown,
        category: generated.category || topic.category,
        status: 'published',
        published_at: publishedAt,
        created_by: 'ai',
        image_url: imageUrl,
        image_alt: generated.image_alt || generated.title,
        seo_title: seoTitle,
        seo_description: seoDescription,
        // newsletter_sent_at rimane null finché la weekly non lo usa
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Errore inserimento blog_posts:', insertError);
      throw new Error(
        `Errore inserimento articolo: ${insertError.message || String(insertError)}`
      );
    }

    const postId = insertedPosts?.id;

    // 6) Marca il topic come usato
    const { error: updateTopicError } = await supabaseAdmin
      .from('blog_topics')
      .update({
        status: 'used',
        used_post_id: postId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', topic.id);

    if (updateTopicError) {
      console.error('Errore aggiornamento blog_topics:', updateTopicError);
      // Non blocco la risposta: l’articolo è comunque stato creato
    }

    return NextResponse.json({
      message: imageUrl
        ? 'Articolo generato e pubblicato con immagine.'
        : 'Articolo generato e pubblicato (senza immagine, uso fallback).',
      topic_id: topic.id,
      post_id: postId,
      slug,
      image_url: imageUrl,
    });
  } catch (error) {
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
