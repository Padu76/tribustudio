/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from 'next/navigation';
import { supabase } from '@/lib/blog/supabaseClient';
import React from 'react';
import type { Metadata } from 'next';

export const revalidate = 60;

async function getPostBySlug(slug: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Errore caricamento singolo post:', error);
    return null;
  }

  return data;
}

function getFallbackImage(category: string | null | undefined): string {
  switch (category) {
    case 'allenamento':
      return '/images/blog/allenamento.jpg';
    case 'alimentazione':
      return '/images/blog/alimentazione.jpg';
    case 'motivazione':
      return '/images/blog/motivazione.jpg';
    default:
      return '/images/blog/generico.jpg';
  }
}

// ✅ SEO dinamica compatibile con il tuo PageProps (params è un Promise<any>)
export async function generateMetadata(
  props: { params: Promise<any> }
): Promise<Metadata> {
  const resolved = await props.params;
  const slug: string | undefined = resolved?.slug;

  if (!slug) {
    return {
      title: 'Articolo non trovato | Tribù Studio',
      description:
        'L’articolo che stai cercando non è disponibile. Scopri gli altri contenuti del blog Tribù Studio.',
    };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Articolo non trovato | Tribù Studio',
      description:
        'L’articolo che stai cercando non è disponibile. Scopri gli altri contenuti del blog Tribù Studio.',
    };
  }

  const title: string = post.seo_title || post.title;
  const description: string =
    post.seo_description ||
    post.excerpt ||
    'Allenamento, alimentazione e motivazione per chi ha poco tempo ma vuole risultati reali.';

  const url = `https://www.tribustudio.it/blog/${post.slug}`;
  const image =
    (post.image_url as string | null) || getFallbackImage(post.category);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: image ? [{ url: image }] : undefined,
    },
  };
}

// Renderer markdown ultra minimale (titoli + paragrafi)
function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split('\n');

  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="text-xl font-semibold mt-6 mb-2">
          {trimmed.replace(/^###\s+/, '')}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="text-2xl font-bold mt-8 mb-3">
          {trimmed.replace(/^##\s+/, '')}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) return null;
    if (trimmed === '') return <br key={i} />;

    return (
      <p key={i} className="mb-3 leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

// ⚠️ Page component: props:any così non litiga con il PageProps custom del progetto
export default async function BlogPostPage(props: any) {
  const slug: string | undefined = props?.params?.slug;

  if (!slug) {
    notFound();
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const imageUrl: string =
    (post.image_url as string | null) || getFallbackImage(post.category);

  return (
    <main className="min-h-screen px-4 py-12 md:px-8 lg:px-16">
      <article className="max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          {post.category}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {post.title}
        </h1>

        <div className="text-sm text-gray-500 mb-6">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : null}
        </div>

        {imageUrl && (
          <div className="mb-8">
            <img
              src={imageUrl}
              alt={post.image_alt || post.title}
              className="w-full max-h-[420px] object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose prose-neutral max-w-none">
          {renderMarkdown(post.content_markdown)}
        </div>
      </article>
    </main>
  );
}
