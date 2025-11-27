// lib/blog/openai.ts

import type { BlogCategory, BlogTopic, GeneratedBlogPostPayload } from './types';

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
 * Genera contenuto testuale + descrizione immagine per un topic.
 */
export async function generateBlogPostFromTopic(
  topic: BlogTopic
): Promise<GeneratedBlogPostPayload> {
  const systemPrompt = `
Sei un copywriter esperto di fitness, alimentazione e motivazione che scrive per uno studio di personal training a Verona chiamato "Tribù Studio".

Regole:
- Scrivi in ITALIANO naturale, chiaro, zero linguaggio medico tecnico pesante.
- Tono: diretto, concreto, motivante ma realistico (niente promesse assurde).
- Target: persone tra 30 e 55 anni, lavoro sedentario, poco tempo, vogliono tornare in forma senza impazzire.
- Il brand offre: personal training, miniclass, percorsi su misura, approccio umano e personalizzato.
- Non dare diagnosi mediche, consiglia sempre di confrontarsi con medico o specialista in caso di patologie.
- Non nominare "ChatGPT" o "intelligenza artificiale" nel testo.

Struttura articolo:
- Lunghezza: ~1200-1800 parole.
- Usa H2 e H3 per organizzare il contenuto.
- Includi esempi concreti, errori comuni e consigli pratici.
- Chiudi sempre con una sezione tipo "Da dove iniziare davvero" con consigli azionabili.
- Alla fine metti una call to action soft per chiedere aiuto a un personal trainer come Tribù Studio.

Immagine:
- Pensa a un'immagine orizzontale (stile 16:9) adatta come copertina per un articolo blog.
- Niente testo nell'immagine.
- Stile: realistico, pulito, moderno, colori equilibrati.
- Il soggetto deve essere coerente con il topic (es. persona che si allena, scena di vita reale, ecc.).
- Non usare loghi di Tribù Studio, niente brand.

Output SOLO in JSON valido, con questo schema:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content_markdown": "...",
  "seo_title": "...",
  "seo_description": "...",
  "category": "allenamento" | "alimentazione" | "motivazione" | "altro",
  "image_prompt": "...",
  "image_alt": "...",
  "image_style": "photo" | "illustration"
}
`;

  const userPrompt = `
Topic richiesto: ${topic.topic}
Categoria preferita: ${topic.category}
Persona target: ${topic.target_persona || 'adulto/a 30-55 anni, lavoro sedentario, vive a Verona o dintorni'}

Ricorda: output SOLO JSON valido, senza testo aggiuntivo.
Se non sei sicuro della categoria, usa "${topic.category}".
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
    throw new Error('Errore nella chiamata OpenAI per generare l\'articolo.');
  }

  const json = await response.json();

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Risposta OpenAI senza contenuto.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error('JSON non valido da OpenAI:', content);
    throw new Error('OpenAI ha restituito un JSON non valido.');
  }

  const title: string = parsed.title || topic.topic;
  const slug: string = parsed.slug || slugify(title);

  const payload: GeneratedBlogPostPayload = {
    title,
    slug,
    excerpt: parsed.excerpt || '',
    content_markdown: parsed.content_markdown || '',
    seo_title: parsed.seo_title || title,
    seo_description:
      parsed.seo_description ||
      (parsed.excerpt && parsed.excerpt.slice(0, 155)) ||
      title,
    category: (parsed.category as BlogCategory) || topic.category || 'altro',
    image_prompt:
      parsed.image_prompt ||
      `Foto realistica orizzontale di una persona che si allena in modo funzionale in uno studio moderno, atmosfera positiva, stile pulito.`,
    image_alt:
      parsed.image_alt ||
      `Persona che si allena in modo funzionale in uno studio di personal training`,
    image_style: parsed.image_style === 'illustration' ? 'illustration' : 'photo',
  };

  return payload;
}

/**
 * Genera immagine a partire da un prompt usando OpenAI Images API.
 * Ritorna l'URL dell'immagine o null se qualcosa va storto.
 */
export async function generateImageForPost(
  prompt: string,
  style: 'photo' | 'illustration' = 'photo'
): Promise<string | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/images', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `${prompt}. Stile: ${
          style === 'photo'
            ? 'fotografia realistica, pulita, luminosa, senza testo'
            : 'illustrazione moderna, pulita, luminosa, senza testo'
        }. Rapporto 16:9.`,
        size: '1024x576',
        n: 1,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Errore OpenAI (immagine):', text);
      return null;
    }

    const json = await response.json();
    const url: string | undefined = json.data?.[0]?.url;

    if (!url) {
      console.error('Risposta images senza URL:', json);
      return null;
    }

    return url;
  } catch (err) {
    console.error('Eccezione durante generazione immagine:', err);
    return null;
  }
}
