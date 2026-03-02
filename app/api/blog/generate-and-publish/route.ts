import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  generateBlogPostFromTopic,
  generateImageForPost,
} from "@/lib/blog/openai";

// NB: niente throw a livello di modulo
const cronSecret = process.env.CRON_SECRET || "";

export const runtime = "nodejs";

interface GeneratedPost {
  title: string;
  content_markdown: string;
  excerpt?: string;
  category?: string;
  slug?: string;
  seo_title?: string;
  seo_description?: string;
  image_alt?: string;
  image_url?: string | null;
}

// Slug sempre univoco: base + suffisso random
function makeUniqueSlug(baseInput: string): string {
  const base = (baseInput || "articolo")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const random = Math.random().toString(36).substring(2, 7);
  return `${base}-${random}`;
}

export async function GET(request: Request) {
  try {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error:
            "ENV mancanti: serve SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // ✅ Soluzione 2:
    // - Vercel Cron aggiunge header x-vercel-cron (di solito "1")
    // - Manuale: puoi chiamare con ?secret=CRON_SECRET
    const cronHeader = request.headers.get("x-vercel-cron");
    const isCron = cronHeader === "1" || cronHeader !== null;

    if (!isCron) {
      if (!cronSecret || secret !== cronSecret) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    // 1) Prendi il prossimo topic pending
    const { data: topics, error: topicError } = await supabaseAdmin
      .from("ts_blog_topics")
      .select("*")
      .eq("status", "pending")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1);

    if (topicError) {
      console.error("Errore lettura ts_blog_topics:", topicError);
      return NextResponse.json(
        { error: "Errore nel recupero dei topic." },
        { status: 500 }
      );
    }

    const topic = topics?.[0];
    if (!topic) {
      return NextResponse.json(
        { message: "Nessun topic pending disponibile per la generazione." },
        { status: 200 }
      );
    }

    // 2) Genera contenuto articolo con OpenAI
    const generated = (await generateBlogPostFromTopic(topic)) as GeneratedPost;

    if (!generated?.title || !generated?.content_markdown) {
      throw new Error("Risultato generazione articolo non valido.");
    }

    // 3) Slug univoco
    const baseForSlug = generated.slug || generated.title || topic.topic;
    const slug = makeUniqueSlug(String(baseForSlug));

    // 4) Immagine
    let imageUrl: string | null = null;
    try {
      const imagePrompt = generated.title || String(baseForSlug);
      const maybeImage = await generateImageForPost(imagePrompt);
      imageUrl = maybeImage ?? null;
    } catch (imgErr) {
      console.error("Errore selezione immagine, fallback:", imgErr);
      imageUrl = null;
    }

    const publishedAt = new Date().toISOString();

    const seoTitle = generated.seo_title || generated.title;
    const seoDescription =
      generated.seo_description ||
      generated.excerpt ||
      "Articolo del blog Tribù Studio su allenamento, alimentazione e motivazione.";

    // 5) Inserisci articolo in ts_blog_posts
    const { data: insertedPost, error: insertError } = await supabaseAdmin
      .from("ts_blog_posts")
      .insert({
        slug,
        title: generated.title,
        excerpt: generated.excerpt,
        content_markdown: generated.content_markdown,
        category: generated.category || topic.category,
        status: "published",
        published_at: publishedAt,
        created_by: "ai",
        image_url: imageUrl,
        image_alt: generated.image_alt || generated.title,
        seo_title: seoTitle,
        seo_description: seoDescription,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Errore inserimento ts_blog_posts:", insertError);
      throw new Error(
        `Errore inserimento articolo: ${insertError.message || String(insertError)}`
      );
    }

    const postId = insertedPost?.id;

    // 6) Marca topic come usato
    const { error: updateTopicError } = await supabaseAdmin
      .from("ts_blog_topics")
      .update({
        status: "used",
        used_post_id: postId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", topic.id);

    if (updateTopicError) {
      console.error("Errore update ts_blog_topics:", updateTopicError);
      // non blocco: articolo creato comunque
    }

    return NextResponse.json({
      message: imageUrl
        ? "Articolo generato e pubblicato con immagine."
        : "Articolo generato e pubblicato (senza immagine, fallback).",
      topic_id: topic.id,
      post_id: postId,
      slug,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Errore in generate-and-publish:", error);
    const message =
      error instanceof Error ? error.message : "Errore interno generazione blog.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}