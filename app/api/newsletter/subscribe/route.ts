// E:\\tribustudio\\app\\api\\newsletter\\subscribe\\route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email richiesta' },
        { status: 400 }
      );
    }

    // Controlla se l'email esiste già
    const { data: existing } = await supabase
      .from('ts_newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existing) {
      // Se esiste ma è inattivo, riattivalo
      if (!existing.is_active) {
        const { error } = await supabase
          .from('ts_newsletter_subscribers')
          .update({ 
            is_active: true,
            name: name || null,
            unsubscribed_at: null
          })
          .eq('id', existing.id);

        if (error) throw error;

        return NextResponse.json({ 
          message: 'Iscrizione riattivata con successo!' 
        });
      }
      
      // Se già attivo
      return NextResponse.json({ 
        message: 'Email già iscritta alla newsletter' 
      });
    }

    // Nuova iscrizione
    const { error } = await supabase
      .from('ts_newsletter_subscribers')
      .insert({
        email,
        name: name || null,
        is_active: true,
        source: 'website',
        subscribed_at: new Date().toISOString()
      });

    if (error) {
      console.error('Errore inserimento:', error);
      throw error;
    }

    return NextResponse.json({ 
      message: 'Iscrizione completata con successo!' 
    });

  } catch (error) {
    console.error('Errore subscribe:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore. Riprova tra qualche minuto.' },
      { status: 500 }
    );
  }
}