/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase config missing for blog index.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function getPublishedPosts(): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Errore caricamento posts:', error);
    return [];
  }

  return data || [];
}

function getPostImageUrl(post: any): string {
  if (post.image_url) return post.image_url;

  switch (post.category) {
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
            Allenamento, alimentazione e motivazione senza fuffa.
          </p>
        </header>

        {posts.length === 0 ? (
          <p>Nessun articolo pubblicato al momento.</p>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => {
              const imageUrl = getPostImageUrl(post);

              return (
                <li
                  key={post.id}
                  className="border-b border-gray-200 pb-6 flex flex-col md:flex-row gap-4"
                >
                  <div className="md:w-1/3 w-full">
                    <Link href={`/blog/${post.slug}`}>
                      <img
                        src={imageUrl}
                        alt={post.image_alt || post.title}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </Link>
                  </div>

                  <div className="md:w-2/3 w-full">
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                      {post.category}
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-2xl font-semibold hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-2 text-gray-600">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      Leggi →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
