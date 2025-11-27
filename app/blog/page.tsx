/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

// Usiamo lo stesso Supabase "admin" usato nella route API
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY non configurati per la pagina /blog.'
  );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function getPublishedPosts(): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Errore nel caricamento dei post del blog:', error);
    return [];
  }

  return data || [];
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen px-4 py-12 md:px-8 lg:px-16">
      <section className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Blog Tribù Studio
          </h1>
          <p className="text-gray-600">
            Allenamento, alimentazione e motivazione spiegati in modo semplice
            e applicabile alla vita reale. Niente fuffa, solo consigli che puoi
            usare da subito.
          </p>
        </header>

        {posts.length === 0 ? (
          <p>Nessun articolo pubblicato al momento. Torna a trovarci presto 🚀</p>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => (
              <li
                key={post.id}
                className="border-b border-gray-200 pb-6 flex flex-col md:flex-row gap-4"
              >
                {post.image_url && (
                  <div className="md:w-1/3 w-full">
                    <Link href={`/blog/${post.slug}`}>
                      <img
                        src={post.image_url}
                        alt={post.image_alt || post.title}
                        className="w-full h-40 object-cover rounded-md"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                )}

                <div className={post.image_url ? 'md:w-2/3 w-full' : 'w-full'}>
                  <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    {post.category}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-2xl font-semibold hover:underline"
                  >
                    {post.title}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString(
                          'it-IT',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )
                      : null}
                  </div>
                  {post.excerpt && (
                    <p className="mt-3 text-gray-700">{post.excerpt}</p>
                  )}
                  <div className="mt-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Leggi l&apos;articolo →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
