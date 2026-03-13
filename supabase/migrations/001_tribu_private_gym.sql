-- supabase/migrations/001_tribu_private_gym.sql
-- Schema per il servizio Tribù Private Gym
-- Eseguire su Supabase Dashboard > SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.tribu_private_gym_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'available' check (status in ('available', 'booked', 'blocked')),
  price_eur numeric(10,2) not null default 25,
  capacity integer not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tribu_private_gym_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.tribu_private_gym_slots(id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text not null,
  notes text,
  accepted_rules_at timestamptz,
  booking_status text not null default 'pending_payment' check (booking_status in ('pending_payment', 'confirmed', 'cancelled', 'expired')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  price_eur numeric(10,2) not null default 25,
  paypal_order_id text,
  paypal_capture_id text,
  paypal_payload jsonb,
  nuki_access_external_id text,
  google_calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tribu_private_gym_accesses (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.tribu_private_gym_bookings(id) on delete cascade,
  provider text not null,
  external_id text,
  valid_from timestamptz not null,
  valid_until timestamptz not null,
  access_payload jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_tribu_private_gym_slots_updated_at on public.tribu_private_gym_slots;
create trigger trg_tribu_private_gym_slots_updated_at
before update on public.tribu_private_gym_slots
for each row execute function public.set_updated_at();

drop trigger if exists trg_tribu_private_gym_bookings_updated_at on public.tribu_private_gym_bookings;
create trigger trg_tribu_private_gym_bookings_updated_at
before update on public.tribu_private_gym_bookings
for each row execute function public.set_updated_at();

-- Slot di test (opzionale, rimuovere in produzione)
insert into public.tribu_private_gym_slots (starts_at, ends_at, status, price_eur, capacity, notes)
values
  ((date_trunc('day', now()) + interval '1 day' + interval '13 hour'), (date_trunc('day', now()) + interval '1 day' + interval '14 hour'), 'available', 25, 1, 'Seed slot test 1'),
  ((date_trunc('day', now()) + interval '1 day' + interval '18 hour'), (date_trunc('day', now()) + interval '1 day' + interval '19 hour'), 'available', 25, 1, 'Seed slot test 2')
on conflict do nothing;
