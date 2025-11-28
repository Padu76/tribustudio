/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog Tribù Studio – Allenamento, Alimentazione, Motivazione',
  description:
    'Articoli pratici su allenamento, alimentazione e motivazione, pensati per chi ha poco tempo ma vuole risultati reali. Nessuna fuffa, solo consigli applicabili.',
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase config missing for blog index.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

type BlogCategoryFilter =
  | 'tutte'
  | 'allenamento'
  | 'alimentazione'
  | 'motivazione';

async function getPublishedPosts(
  category: BlogCategoryFilter
): Promise<any[]> {
  let query = supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (category !== 'tutte') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

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

function normalizeCategory(input?: string): BlogCategoryFilter {
  if (!input) return 'tutte';
  if (
    input === 'allenamento' ||
    input === 'alimentazione' ||
    input === 'motivazione'
  ) {
    return input;
  }
  return 'tutte';
}

// props:any per non litigare con PageProps custom (searchParams come Promise)
export default async function BlogPage(props: any) {
  let rawParams: any = {};
  if (props && props.searchParams) {
    rawParams = await props.searchParams;
  }

  const currentCategory = normalizeCategory(
    (rawParams?.category as string | undefined) ?? undefined
  );

  const posts = await getPublishedPosts(currentCategory);

  const filterButtons: { label: string; value: BlogCategoryFilter }[] = [
    { label: 'Tutti gli articoli', value: 'tutte' },
    { label: 'Allenamento', value: 'allenamento' },
    { label: 'Alimentazione', value: 'alimentazione' },
    { label: 'Motivazione', value: 'motivazione' },
  ];

  return (
    <main className="min-h-screen px-4 py-12 md:px-8 lg:px-16">
      <section className="max-w-5xl mx-auto">
        {/* 🔙 Link per tornare in homepage */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span className="mr-1">←</span>
            Torna alla home
          </Link>
        </div>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Blog Tribù Studio
          </h1>
          <p className="text-gray-600">
            Allenamento, alimentazione e motivazione spiegati in modo semplice
            e applicabile alla vita reale. Niente fuffa, solo consigli che puoi
            usare da subito.
          </p>
        </header>

        {/* Filtri categoria */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filterButtons.map((btn) => {
            const isActive = currentCategory === btn.value;
            const href =
              btn.value === 'tutte'
                ? '/blog'
                : `/blog?category=${encodeURIComponent(btn.value)}`;

            return (
              <Link
                key={btn.value}
                href={href}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {btn.label}
              </Link>
            );
          })}
        </div>

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
                      <p className="mt-2 text-gray-700">{post.excerpt}</p>
                    )}
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
