-- supabase/migrations/002_tribu_radio.sql
-- Schema per il servizio Tribù Radio
-- Eseguire su Supabase Dashboard > SQL Editor

create table if not exists public.tribu_radio_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text,
  channel text not null default 'gym-energy',
  bpm integer,
  energy integer check (energy between 1 and 10),
  duration_sec integer,
  file_url text not null,
  prompt_used text,
  is_published boolean not null default false,
  quality_score numeric(3,1) check (quality_score between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tribu_radio_tracks_channel on public.tribu_radio_tracks(channel);
create index if not exists idx_tribu_radio_tracks_published on public.tribu_radio_tracks(is_published);

drop trigger if exists trg_tribu_radio_tracks_updated_at on public.tribu_radio_tracks;
create trigger trg_tribu_radio_tracks_updated_at
before update on public.tribu_radio_tracks
for each row execute function public.set_updated_at();

-- Tabella subscribers per gestire gli abbonamenti radio
create table if not exists public.tribu_radio_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  business_name text,
  plan text not null default 'starter' check (plan in ('starter', 'business')),
  is_active boolean not null default true,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tribu_radio_subscribers_updated_at on public.tribu_radio_subscribers;
create trigger trg_tribu_radio_subscribers_updated_at
before update on public.tribu_radio_subscribers
for each row execute function public.set_updated_at();
