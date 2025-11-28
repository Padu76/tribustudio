/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from "next/navigation";
import { supabase } from "@/lib/blog/supabaseClient";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

export const revalidate = 60;

async function getPostBySlug(slug: string): Promise<any | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Errore caricamento singolo post:", error);
    return null;
  }

  return data;
}

function getFallbackImage(category: string | null | undefined): string {
  switch (category) {
    case "allenamento":
      return "/images/blog/allenamento.jpg";
    case "alimentazione":
      return "/images/blog/alimentazione.jpg";
    case "motivazione":
      // 👉 anche qui usiamo .jpeg
      return "/images/blog/motivazione.jpeg";
    case "generico":
      return "/images/blog/generico.jpg";
    default:
      return "/images/blog/generico.jpg";
  }
}

// SEO dinamica compatibile col tuo PageProps (params come Promise)
export async function generateMetadata(
  props: { params: Promise<any> }
): Promise<Metadata> {
  const resolved = await props.params;
  const slug: string | undefined = resolved?.slug;

  if (!slug) {
    return {
      title: "Articolo non trovato | Tribù Studio",
      description:
        "L’articolo che stai cercando non è disponibile. Scopri gli altri contenuti del blog Tribù Studio.",
    };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Articolo non trovato | Tribù Studio",
      description:
        "L’articolo che stai cercando non è disponibile. Scopri gli altri contenuti del blog Tribù Studio.",
    };
  }

  const title: string = post.seo_title || post.title;
  const description: string =
    post.seo_description ||
    post.excerpt ||
    "Allenamento, alimentazione e motivazione per chi ha poco tempo ma vuole risultati reali.";

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
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

// Renderer markdown ultra minimale (titoli + paragrafi)
function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split("\n");

  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="text-xl font-semibold mt-6 mb-2">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-bold mt-8 mb-3">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) return null;
    if (trimmed === "") return <br key={i} />;

    return (
      <p key={i} className="mb-3 leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

// Page component
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
    <main className="min-h-screen bg-[var(--color-light-gray)]">
      <section className="section-padding">
        <div className="container-custom">
          {/* Link back */}
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-primary hover:text-primary-dark hover:underline"
            >
              <span className="mr-1">←</span>
              Torna al blog
            </Link>

            <Link
              href="/"
              className="hidden md:inline-flex items-center text-xs text-gray-500 hover:text-primary hover:underline"
            >
              Torna alla home
            </Link>
          </div>

          {/* Articolo */}
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {imageUrl && (
              <div className="mb-0">
                <img
                  src={imageUrl}
                  alt={post.image_alt || post.title}
                  className="w-full max-h-[420px] object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-xs font-semibold text-primary uppercase tracking-wide">
                  {post.category}
                </span>
                {post.published_at && (
                  <span className="text-xs text-gray-500">
                    {new Date(post.published_at).toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 gradient-text">
                {post.title}
              </h1>

              <div className="prose prose-neutral max-w-none">
                {renderMarkdown(post.content_markdown)}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-sm text-primary hover:text-primary-dark hover:underline"
                >
                  <span className="mr-1">←</span>
                  Torna alla lista articoli
                </Link>

                <Link
                  href="/#contatti"
                  className="btn-primary text-sm md:text-base"
                >
                  Parla con un trainer Tribù
                </Link>
              </div>
            </div>
          </article>

          {/* Box newsletter sotto l'articolo */}
          <div className="mt-10">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  );
}
