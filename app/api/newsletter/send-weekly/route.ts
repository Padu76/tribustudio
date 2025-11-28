import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const cronSecret = process.env.CRON_SECRET || '';

const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID_WEEKLY;
const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
const emailJsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

const siteUrl = process.env.SITE_URL || 'https://www.tribustudio.it';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti per send-weekly.'
  );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('secret');
  const isCron = request.headers.get('x-vercel-cron') !== null;

  // Protezione: solo cron Vercel o chiamata con ?secret=
  if (!isCron) {
    if (!cronSecret || token !== cronSecret) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  if (
    !emailJsServiceId ||
    !emailJsTemplateId ||
    !emailJsPublicKey ||
    !emailJsPrivateKey
  ) {
    return NextResponse.json(
      {
        error:
          'Config EmailJS mancante: controlla EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_WEEKLY, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY.',
      },
      { status: 500 }
    );
  }

  // 1) Trova l’ultimo articolo pubblicato NON ancora usato per newsletter
  const { data: posts, error: postsError } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .is('newsletter_sent_at', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(1);

  if (postsError) {
    console.error('Errore lettura blog_posts:', postsError);
    return NextResponse.json(
      { error: 'Errore nel recupero degli articoli.' },
      { status: 500 }
    );
  }

  const post = posts?.[0];

  if (!post) {
    return NextResponse.json({
      message:
        'Nessun nuovo articolo da inviare in newsletter (tutti già usati).',
    });
  }

  // 2) Leggi iscritti attivi
  const { data: subscribers, error: subsError } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('id, email, name, unsubscribe_token, status')
    .eq('status', 'active');

  if (subsError) {
    console.error('Errore lettura subscribers:', subsError);
    return NextResponse.json(
      { error: 'Errore nel recupero degli iscritti.' },
      { status: 500 }
    );
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({
      message: 'Nessun iscritto attivo alla newsletter.',
    });
  }

  const sentTo: string[] = [];
  const failedTo: string[] = [];

  // 3) Invio email con EmailJS per ogni iscritto
  for (const sub of subscribers) {
    const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(
      sub.email
    )}&token=${sub.unsubscribe_token}`;

    const postUrl = `${siteUrl}/blog/${post.slug}`;

    const templateParams = {
      to_email: sub.email,
      to_name: sub.name || '',
      post_title: post.title,
      post_excerpt: post.excerpt || '',
      post_url: postUrl,
      unsubscribe_url: unsubscribeUrl,
      preview_text: `Nuovo articolo dal blog Tribù Studio: ${post.title}`,
    };

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          accessToken: emailJsPrivateKey,
          template_params: templateParams,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Errore invio EmailJS a', sub.email, txt);
        failedTo.push(sub.email);
      } else {
        sentTo.push(sub.email);
      }
    } catch (err) {
      console.error('Errore fetch EmailJS per', sub.email, err);
      failedTo.push(sub.email);
    }
  }

  // 4) Segna l’articolo come "newsletter inviata"
  const { error: updatePostError } = await supabaseAdmin
    .from('blog_posts')
    .update({
      newsletter_sent_at: new Date().toISOString(),
    })
    .eq('id', post.id);

  if (updatePostError) {
    console.error('Errore aggiornamento newsletter_sent_at:', updatePostError);
  }

  return NextResponse.json({
    message: 'Newsletter settimanale inviata (o tentata) con EmailJS.',
    post_id: post.id,
    sent_to: sentTo,
    failed_to: failedTo,
  });
}
