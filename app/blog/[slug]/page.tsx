// app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/blog/supabaseClient';
import type { BlogPost } from '@/lib/blog/types';
import React from 'react';

export const revalidate = 60;

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
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

  return data as BlogPost;
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
            <div className="relative w-full max-h-[420px] h-[260px] md:h-[360px]">
              <Image
                src={post.image_url}
                alt={post.image_alt || post.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        )}

        <div className="prose prose-neutral max-w-none">
          {renderMarkdown(post.content_markdown)}
        </div>
      </article>
    </main>
  );
}
