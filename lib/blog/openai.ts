// lib/blog/openai.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  BlogCategory,
  BlogTopic,
  GeneratedBlogPostPayload,
} from './types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY non configurata.');
}

const MODEL = process.env.BLOG_MODEL_NAME || 'gpt-4o-mini';

// Immagini di fallback per categoria (usate solo se Unsplash fallisce)
const FALLBACK_IMAGES: Record<string, string> = {
  allenamento: '/images/blog/allenamento.jpg',
  alimentazione: '/images/blog/alimentazione.jpg',
  motivazione: '/images/blog/motivazione.jpeg',
  default: '/images/blog/generico.jpg',
};

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
 * Cerca un'immagine su Unsplash basandosi sul titolo e categoria dell'articolo.
 * Restituisce l'URL dell'immagine o null se fallisce.
 */
async function fetchUnsplashImage(
  title: string,
  category: string
): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('UNSPLASH_ACCESS_KEY non configurata, uso immagine di fallback.');
    return null;
  }

  // Query combinata: titolo + categoria fitness per risultati più pertinenti
  const categoryMap: Record<string, string> = {
    allenamento: 'workout fitness gym',
    alimentazione: 'healthy food nutrition',
    motivazione: 'motivation success mindset',
  };

  const categoryKeywords = categoryMap[category] || 'fitness wellness';
  
  // Usa le prime parole chiave del titolo + categoria
  const titleKeywords = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .split(' ')
    .filter(w => w.length > 3)
    .slice(0, 3)
    .join(' ');

  const query = `${titleKeywords} ${categoryKeywords}`.trim();

  try {
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    // Usa la versione "regular" (1080px) di Unsplash
    const imageUrl = data?.urls?.regular || data?.urls?.full || null;
    
    if (imageUrl) {
      console.log(`Immagine Unsplash trovata per: "${query}" → ${imageUrl}`);
    }

    return imageUrl;
  } catch (err) {
    console.error('Errore fetch Unsplash:', err);
    return null;
  }
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

Output SOLO JSON valido con questa struttura:

{
  "title": "",
  "slug": "",
  "excerpt": "",
  "content_markdown": "",
  "seo_title": "",
  "seo_description": "",
  "category": ""
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
    image_prompt: '',
    image_alt: `Immagine per articolo: ${title}`,
    image_style: 'photo',
  };

  return payload;
}

/**
 * Cerca immagine pertinente su Unsplash basandosi sul titolo dell'articolo.
 * Fallback su immagini statiche per categoria se Unsplash non risponde.
 */
export async function generateImageForPost(
  titleOrPrompt: string,
  category?: string,
  style: 'photo' | 'illustration' = 'photo'
): Promise<string | null> {
  // Determina categoria dal testo se non passata esplicitamente
  const detectedCategory = category || detectCategory(titleOrPrompt);

  // Tenta Unsplash con titolo + categoria
  const unsplashUrl = await fetchUnsplashImage(titleOrPrompt, detectedCategory);
  
  if (unsplashUrl) {
    return unsplashUrl;
  }

  // Fallback: immagine statica per categoria
  console.warn(`Unsplash fallito, uso immagine statica per categoria: ${detectedCategory}`);
  return FALLBACK_IMAGES[detectedCategory] || FALLBACK_IMAGES.default;
}

/**
 * Rileva la categoria dal testo del titolo/prompt
 */
function detectCategory(text: string): string {
  const lower = text.toLowerCase();

  if (
    lower.includes('allena') ||
    lower.includes('workout') ||
    lower.includes('fitness') ||
    lower.includes('palestra') ||
    lower.includes('eserciz') ||
    lower.includes('muscol') ||
    lower.includes('cardio')
  ) {
    return 'allenamento';
  }

  if (
    lower.includes('alimenta') ||
    lower.includes('nutri') ||
    lower.includes('cibo') ||
    lower.includes('dieta') ||
    lower.includes('mang') ||
    lower.includes('protein') ||
    lower.includes('carboidrat')
  ) {
    return 'alimentazione';
  }

  if (
    lower.includes('motiva') ||
    lower.includes('mental') ||
    lower.includes('obiettiv') ||
    lower.includes('mindset') ||
    lower.includes('abitudin') ||
    lower.includes('stress')
  ) {
    return 'motivazione';
  }

  return 'default';
}

/**
 * AUTO-RIPOPOLAZIONE TOPIC
 * Genera un batch di nuovi topic da inserire in blog_topics.
 */
export interface GeneratedTopicSeed {
  topic: string;
  category: BlogCategory;
  target_persona: string;
}

export async function generateBlogTopicsBatch(
  desiredCount: number
): Promise<GeneratedTopicSeed[]> {
  const systemPrompt = `
Sei un content strategist per un personal training studio a Verona (Tribù Studio).
Devi proporre argomenti per il blog su:
- allenamento
- alimentazione
- motivazione

Regole:
- Scrivi in ITALIANO.
- Ogni topic deve essere molto concreto e specifico (no "come allenarsi" generico).
- Target: adulti 30-55 anni con poco tempo e lavoro sedentario.
- Mix equilibrato tra le categorie.
- Nessuna promessa miracolosa, niente clickbait estremo.
- Non nominare Tribù Studio nel titolo, è un argomento, non un post già scritto.

Output SOLO JSON valido, formato:

[
  {
    "topic": "Titolo/argomento chiaro e specifico",
    "category": "allenamento" | "alimentazione" | "motivazione",
    "target_persona": "breve descrizione della persona ideale"
  },
  ...
]
`;

  const userPrompt = `
Genera ${desiredCount} nuovi topic per il blog, bilanciati tra allenamento, alimentazione e motivazione.
Rispondi SOLO con l'array JSON.
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
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Errore OpenAI (topic):', text);
    throw new Error(`Errore OpenAI nella generazione topic: ${text}`);
  }

  const json = await response.json();
  const raw = json.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error('Risposta OpenAI topic vuota.');
  }

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
    console.error('Errore parsing JSON topic:', cleaned, error);
    throw new Error('OpenAI ha generato JSON topic non valido.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('OpenAI topic: output non è un array.');
  }

  const seeds: GeneratedTopicSeed[] = parsed
    .map((item: any) => ({
      topic: String(item.topic || '').trim(),
      category: (item.category as BlogCategory) || 'allenamento',
      target_persona: String(
        item.target_persona || 'adulto 30-55 anni, lavoro sedentario, poco tempo'
      ).trim(),
    }))
    .filter((t) => t.topic.length > 10);

  return seeds;
}