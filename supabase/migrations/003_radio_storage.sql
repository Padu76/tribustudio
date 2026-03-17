-- supabase/migrations/003_radio_storage.sql
-- Crea il bucket Storage per le tracce audio di Tribù Radio
-- Eseguire su Supabase Dashboard > SQL Editor

-- Crea bucket pubblico per le tracce radio
insert into storage.buckets (id, name, public)
values ('radio-tracks', 'radio-tracks', true)
on conflict (id) do nothing;

-- Policy: chiunque può leggere (le tracce sono pubbliche per lo streaming)
create policy "Radio tracks are publicly accessible"
on storage.objects for select
using (bucket_id = 'radio-tracks');

-- Policy: solo service role può inserire/aggiornare/cancellare
create policy "Only admins can upload radio tracks"
on storage.objects for insert
with check (bucket_id = 'radio-tracks');

create policy "Only admins can update radio tracks"
on storage.objects for update
using (bucket_id = 'radio-tracks');

create policy "Only admins can delete radio tracks"
on storage.objects for delete
using (bucket_id = 'radio-tracks');
