-- supabase/migrations/004_radio_announcements.sql
-- Tabella per gli annunci vocali del DJ virtuale
-- Eseguire su Supabase Dashboard > SQL Editor

create table if not exists public.tribu_radio_announcements (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  text text not null,
  voice_id text not null,
  file_url text not null,
  duration_sec integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tribu_radio_announcements_channel
  on public.tribu_radio_announcements(channel);

create index if not exists idx_tribu_radio_announcements_active
  on public.tribu_radio_announcements(is_active);

drop trigger if exists trg_tribu_radio_announcements_updated_at on public.tribu_radio_announcements;
create trigger trg_tribu_radio_announcements_updated_at
before update on public.tribu_radio_announcements
for each row execute function public.set_updated_at();

-- RLS: lettura pubblica per gli annunci attivi
alter table public.tribu_radio_announcements enable row level security;

create policy "Annunci attivi leggibili da tutti"
  on public.tribu_radio_announcements
  for select
  using (is_active = true);
