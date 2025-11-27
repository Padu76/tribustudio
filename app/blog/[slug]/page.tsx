/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from 'next/navigation';
import { supabase } from '@/lib/blog/supabaseClient';
import React from 'react';

export const revalidate = 60;

async function getPostBySlug(slug: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single();

  if (error) {
    console.error('Errore nel caricamento del post del blog:', error);
    return null;
  }

  return data;
}

// Renderer markdown ultra minimale (titoli + paragrafi)
function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split('\n');

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={index} className="text-xl font-semibold mt-6 mb-2">
          {trimmed.replace(/^###\s+/, '')}
        </h3>
      );
    }

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={index} className="text-2xl font-bold mt-8 mb-3">
          {trimmed.replace(/^##\s+/, '')}
        </h2>
      );
    }

    if (trimmed.startsWith('# ')) {
      // H1 lo ignoriamo perché usiamo il titolo del post
      return null;
    }

    if (trimmed === '') {
      return <br key={index} />;
    }

    return (
      <p key={index} className="mb-3 leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

// props:any + eslint disabilitato = niente casini con PageProps custom del progetto
export default async function BlogPostPage(props: any) {
  const { params } = props;
  const slug = params?.slug as string;

  if (!slug) {
    notFound();
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-12 md:px-8 lg:px-16">
      <article className="max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          {post.category}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : null}
        </div>

        {post.image_url && (
          <div className="mb-8">
            <img
              src={post.image_url}
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
