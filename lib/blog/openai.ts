/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  BlogCategory,
  BlogTopic,
  GeneratedBlogPostPayload,
} from './types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY non configurata.');
}

const MODEL = process.env.BLOG_MODEL_NAME || 'gpt-4.1-mini';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Genera l'articolo testuale a partire da un topic del blog.
 */
export async function generateBlogPostFromTopic(
  topic: BlogTopic
): Promise<GeneratedBlogPostPayload> {
  const systemPrompt = `
Sei un copywriter esperto di fitness, alimentazione e motivazione che scrive per uno studio di personal training a Verona chiamato "Tribù Studio".

Regole:
- Scrivi in ITALIANO naturale, chiaro, zero linguaggio medico iper-tecnico.
- Tono: diretto, pratico, motivante ma realistico.
- Target: adulti 30-55 anni, poco tempo, lavoro sedentario, voglia di rimettersi in forma.
- Non fare diagnosi mediche.
- Non nominare "AI" o "ChatGPT".
- Struttura: 1200-1800 parole, con H2/H3, esempi, errori comuni e consigli applicabili.
- Chiudi con: "Da dove iniziare davvero".
- Aggiungi una CTA soft su Tribù Studio.

Immagine:
- Copertina 16:9 realistica.
- Niente testo nell'immagine.
- Stile pulito, moderno, umano.

Output SOLO JSON valido con questa struttura:

{
  "title": "",
  "slug": "",
  "excerpt": "",
  "content_markdown": "",
  "seo_title": "",
  "seo_description": "",
  "category": "",
  "image_prompt": "",
  "image_alt": "",
  "image_style": "photo" | "illustration"
}
`;

  const userPrompt = `
Topic richiesto: ${topic.topic}
Categoria: ${topic.category}
Persona target: ${topic.target_persona || 'adulto 30-55 anni'}

Rispondi SOLO con JSON valido.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Errore OpenAI (testo):', text);
    throw new Error(`Errore OpenAI chat completions: ${text}`);
  }

  const json = await response.json();

  const raw = json.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error('Risposta OpenAI senza contenuto.');
  }

  // Rimuove eventuali ```json … ```
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, '');
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();
  }

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.error('Errore parsing JSON articolo:', cleaned, error);
    throw new Error('OpenAI ha generato JSON non valido.');
  }

  const title = parsed.title || topic.topic;
  const slug = parsed.slug || slugify(title);

  const payload: GeneratedBlogPostPayload = {
    title,
    slug,
    excerpt: parsed.excerpt || '',
    content_markdown: parsed.content_markdown || '',
    seo_title: parsed.seo_title || title,
    seo_description:
      parsed.seo_description ||
      (parsed.excerpt ? parsed.excerpt.slice(0, 150) : title),
    category: (parsed.category as BlogCategory) || topic.category || 'altro',
    image_prompt:
      parsed.image_prompt ||
      `Foto realistica 16:9 di una persona che si allena in uno studio moderno, atmosfera positiva, pulita.`,
    image_alt:
      parsed.image_alt ||
      `Persona che si allena in uno studio di personal training moderno`,
    image_style: parsed.image_style === 'illustration' ? 'illustration' : 'photo',
  };

  return payload;
}

/**
 * Genera immagine con OpenAI Images.
 * Ritorna: URL dell'immagine o null se fallisce.
 */
export async function generateImageForPost(
  prompt: string,
  style: 'photo' | 'illustration' = 'photo'
): Promise<string | null> {
  try {
    const response = await fetch(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: `${prompt}. Stile: ${
            style === 'photo'
              ? 'fotografia realistica, illuminazione naturale, senza testo'
              : 'illustrazione moderna, pulita, senza testo'
          }. Rapporto 16:9.`,
          size: '1024x576',
          n: 1,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Errore OpenAI (immagine):', text);
      return null;
    }

    const json = await response.json();
    const url: string | undefined = json.data?.[0]?.url;

    if (!url) {
      console.error('OpenAI image: URL mancante');
      return null;
    }

    return url;
  } catch (error: unknown) {
    console.error('Errore generazione immagine:', error);
    return null;
  }
}
