// E:\tribustudio\app\api\newsletter\send-weekly\route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as Brevo from '@getbrevo/brevo';

const siteUrl = process.env.SITE_URL || 'https://www.tribustudio.it';

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti');
  return createClient(url, key);
}

function getBrevoApi() {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) throw new Error('BREVO_API_KEY mancante');
  const api = new Brevo.TransactionalEmailsApi();
  api.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, brevoApiKey);
  return api;
}

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const brevoApi = getBrevoApi();
    const cronSecret = process.env.CRON_SECRET || '';
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('secret');
    const isCron = request.headers.get('x-vercel-cron') !== null;

    // Protezione endpoint
    if (!isCron && (!cronSecret || token !== cronSecret)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 1) Trova ultimo articolo non ancora inviato
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('ts_blog_posts')
      .select('*')
      .eq('status', 'published')
      .is('newsletter_sent_at', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(1);

    if (postsError) {
      console.error('Errore lettura blog_posts:', postsError);
      return NextResponse.json(
        { error: 'Errore recupero articoli', details: postsError.message },
        { status: 500 }
      );
    }

    const post = posts?.[0];

    if (!post) {
      return NextResponse.json({
        message: 'Nessun nuovo articolo da inviare.',
        status: 'no_content'
      });
    }

    // 2) Leggi iscritti attivi
    const { data: subscribers, error: subsError } = await supabaseAdmin
      .from('ts_newsletter_subscribers')
      .select('id, email, name')
      .eq('is_active', true)
      .is('unsubscribed_at', null);

    if (subsError) {
      console.error('Errore lettura subscribers:', subsError);
      return NextResponse.json(
        { error: 'Errore recupero iscritti', details: subsError.message },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        message: 'Nessun iscritto attivo.',
        status: 'no_subscribers'
      });
    }

    const sentTo: string[] = [];
    const failedTo: { email: string; error: string }[] = [];
    const postUrl = `${siteUrl}/blog/${post.slug}`;

    // 3) Invio email con Brevo
    for (const sub of subscribers) {
      try {
        const unsubscribeToken = Buffer.from(sub.email).toString('base64');
        const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(
          sub.email
        )}&token=${unsubscribeToken}`;

        // Template HTML email
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="it">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                  line-height: 1.6; 
                  color: #333; 
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background: white;
                }
                .header { 
                  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); 
                  color: white; 
                  padding: 40px 20px; 
                  text-align: center; 
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: bold;
                }
                .content { 
                  padding: 40px 30px;
                  background: white;
                }
                .content h2 {
                  color: #ff6b35;
                  font-size: 24px;
                  margin: 20px 0 15px 0;
                  line-height: 1.3;
                }
                .content p {
                  margin: 15px 0;
                  color: #555;
                }
                .button-container {
                  text-align: center;
                  margin: 30px 0;
                }
                .button { 
                  display: inline-block; 
                  background: #ff6b35; 
                  color: white !important; 
                  padding: 16px 40px; 
                  text-decoration: none; 
                  border-radius: 8px; 
                  font-weight: bold;
                  font-size: 16px;
                  transition: background 0.3s;
                }
                .button:hover {
                  background: #ff8c42;
                }
                .footer { 
                  text-align: center; 
                  padding: 30px 20px; 
                  font-size: 13px; 
                  color: #999;
                  background: #f9f9f9;
                  border-top: 1px solid #eee;
                }
                .footer a {
                  color: #ff6b35;
                  text-decoration: none;
                }
                .footer a:hover {
                  text-decoration: underline;
                }
                @media only screen and (max-width: 600px) {
                  .content { padding: 30px 20px; }
                  .header h1 { font-size: 24px; }
                  .content h2 { font-size: 20px; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🏋️ Tribù Studio</h1>
                  <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">La tua palestra a Verona</p>
                </div>
                
                <div class="content">
                  <p style="font-size: 16px;">Ciao <strong>${sub.name || ''}</strong>,</p>
                  
                  <p>abbiamo appena pubblicato un nuovo articolo sul blog di Tribù Studio:</p>
                  
                  <h2>${post.title}</h2>
                  
                  <p style="font-size: 15px; color: #666; line-height: 1.7;">
                    ${post.excerpt || ''}
                  </p>
                  
                  <div class="button-container">
                    <a href="${postUrl}" class="button">📖 Leggi l'articolo completo</a>
                  </div>
                  
                  <p style="margin-top: 30px; font-size: 15px;">
                    Nel post trovi <strong>consigli pratici</strong> su allenamento, alimentazione e motivazione, 
                    pensati per chi ha poco tempo ma vuole <strong>risultati reali</strong>.
                  </p>
                  
                  <p style="margin-top: 25px;">
                    A presto,<br>
                    <strong>Il team Tribù Studio</strong>
                  </p>
                </div>
                
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">
                    📍 Tribù Studio - Verona, Italia
                  </p>
                  <p style="margin: 10px 0;">
                    Non vuoi più ricevere queste email?<br>
                    <a href="${unsubscribeUrl}">Cancellati qui</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;

        // Configurazione email Brevo
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        
        sendSmtpEmail.subject = `Nuovo articolo: ${post.title}`;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = { 
          name: "Tribù Studio", 
          email: "info@tribustudio.it"
        };
        sendSmtpEmail.to = [{ 
          email: sub.email, 
          name: sub.name || '' 
        }];
        sendSmtpEmail.replyTo = {
          email: "info@tribustudio.it",
          name: "Tribù Studio"
        };

        // Invio
        await brevoApi.sendTransacEmail(sendSmtpEmail);
        sentTo.push(sub.email);

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('Errore invio Brevo per', sub.email, errorMsg);
        failedTo.push({ 
          email: sub.email, 
          error: errorMsg 
        });
      }
    }

    // 4) Segna articolo come inviato
    const { error: updatePostError } = await supabaseAdmin
      .from('ts_blog_posts')
      .update({
        newsletter_sent_at: new Date().toISOString(),
      })
      .eq('id', post.id);

    if (updatePostError) {
      console.error('Errore aggiornamento newsletter_sent_at:', updatePostError);
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter inviata con successo',
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
      },
      stats: {
        total_subscribers: subscribers.length,
        sent: sentTo.length,
        failed: failedTo.length,
      },
      sent_to: sentTo,
      failed_to: failedTo,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Errore generale newsletter:', error);
    return NextResponse.json(
      { 
        error: 'Errore durante invio newsletter',
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}