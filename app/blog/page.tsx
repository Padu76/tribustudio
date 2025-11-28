/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import NewsletterSignup from "@/components/NewsletterSignup";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog Tribù Studio – Allenamento, Alimentazione, Motivazione",
  description:
    "Articoli pratici su allenamento, alimentazione e motivazione, pensati per chi ha poco tempo ma vuole risultati reali. Nessuna fuffa, solo consigli applicabili.",
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase config missing for blog index.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

type BlogCategoryFilter =
  | "tutte"
  | "allenamento"
  | "alimentazione"
  | "motivazione";

async function getPublishedPosts(
  category: BlogCategoryFilter
): Promise<any[]> {
  let query = supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category !== "tutte") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Errore caricamento posts:", error);
    return [];
  }

  return data || [];
}

function getPostImageUrl(post: any): string {
  if (post.image_url) return post.image_url;

  switch (post.category) {
    case "allenamento":
      return "/images/blog/allenamento.jpg";
    case "alimentazione":
      return "/images/blog/alimentazione.jpg";
    case "motivazione":
      return "/images/blog/motivazione.jpg";
    default:
      return "/images/blog/generico.jpg";
  }
}

function normalizeCategory(input?: string): BlogCategoryFilter {
  if (!input) return "tutte";
  if (
    input === "allenamento" ||
    input === "alimentazione" ||
    input === "motivazione"
  ) {
    return input;
  }
  return "tutte";
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
    { label: "Tutti gli articoli", value: "tutte" },
    { label: "Allenamento", value: "allenamento" },
    { label: "Alimentazione", value: "alimentazione" },
    { label: "Motivazione", value: "motivazione" },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-light-gray)]">
      <section className="section-padding">
        <div className="container-custom">
          {/* 🔙 Link per tornare in homepage */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-primary hover:text-primary-dark hover:underline"
            >
              <span className="mr-1">←</span>
              Torna alla home
            </Link>
          </div>

          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
              Contenuti Tribù Studio
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 gradient-text">
              Blog Tribù Studio
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Allenamento, alimentazione e motivazione spiegati in modo semplice
              e applicabile alla vita reale. Niente fuffa, solo consigli che puoi
              usare da subito, anche se hai poco tempo.
            </p>
          </header>

          {/* Filtri categoria */}
          <div className="mb-8 flex flex-wrap gap-2">
            {filterButtons.map((btn) => {
              const isActive = currentCategory === btn.value;
              const href =
                btn.value === "tutte"
                  ? "/blog"
                  : `/blog?category=${encodeURIComponent(btn.value)}`;

              return (
                <Link
                  key={btn.value}
                  href={href}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all hover-lift ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary"
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
            <ul className="space-y-6">
              {posts.map((post) => {
                const imageUrl = getPostImageUrl(post);

                return (
                  <li
                    key={post.id}
                    className="hover-lift bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row"
                  >
                    <div className="md:w-1/3 w-full">
                      <Link href={`/blog/${post.slug}`}>
                        <img
                          src={imageUrl}
                          alt={post.image_alt || post.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </Link>
                    </div>

                    <div className="md:w-2/3 w-full p-5 md:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-xs font-semibold text-primary uppercase tracking-wide">
                            {post.category}
                          </span>
                          {post.published_at && (
                            <span className="text-xs text-gray-500">
                              {new Date(
                                post.published_at
                              ).toLocaleDateString("it-IT", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xl md:text-2xl font-semibold hover:underline"
                        >
                          {post.title}
                        </Link>

                        {post.excerpt && (
                          <p className="mt-3 text-gray-700 text-sm md:text-base">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="mt-4">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm font-semibold text-primary hover:text-primary-dark"
                        >
                          Leggi l&apos;articolo →
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* 🔔 Box iscrizione newsletter */}
          <div className="mt-10">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  );
}
