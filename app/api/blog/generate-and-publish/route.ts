import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateBlogPost } from "@/lib/blog/openai";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const vercelCronHeader = request.headers.get("x-vercel-cron");
  const secretFromQuery = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  // ✅ Caso 1: chiamata da Vercel Cron
  if (vercelCronHeader === "1") {
    return true;
  }

  // ✅ Caso 2: chiamata manuale con secret corretto
  if (secretFromQuery && secretFromQuery === expectedSecret) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  try {
    // 🔒 Autorizzazione
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Supabase ENV mancanti" },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    // 1️⃣ Prende un topic pending
    const { data: topic, error: topicError } = await supabase
      .from("blog_topics")
      .select("*")
      .eq("status", "pending")
      .limit(1)
      .single();

    if (topicError || !topic) {
      return NextResponse.json(
        { message: "Nessun topic disponibile." },
        { status: 200 }
      );
    }

    // 2️⃣ Genera contenuto AI
    const generated = await generateBlogPost(topic);

    // 3️⃣ Inserisce post
    const { data: insertedPost, error: insertError } =
      await supabase
        .from("blog_posts")
        .insert({
          title: generated.title,
          slug: generated.slug,
          content: generated.content,
          excerpt: generated.excerpt,
          image_url: "/images/blog/generico.jpg",
          topic_id: topic.id,
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (insertError) {
      throw insertError;
    }

    // 4️⃣ Marca topic come used
    await supabase
      .from("blog_topics")
      .update({ status: "used" })
      .eq("id", topic.id);

    return NextResponse.json({
      message: "Articolo generato e pubblicato con immagine.",
      topic_id: topic.id,
      post_id: insertedPost.id,
      slug: insertedPost.slug,
      image_url: "/images/blog/generico.jpg",
    });
  } catch (error: any) {
    console.error("Errore generazione blog:", error);
    return NextResponse.json(
      { error: error.message || "Errore interno" },
      { status: 500 }
    );
  }
}