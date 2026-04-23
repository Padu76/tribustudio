-- Migration: add tribu_slot_requests table for WhatsApp-pre-authorization flow
-- Run this once on the Supabase SQL editor.

create table if not exists tribu_slot_requests (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  slot_start_time time not null,
  slot_end_time time not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  status text not null default 'pending' check (status in ('pending', 'authorized', 'rejected', 'expired')),
  booking_slot_id uuid references tribu_private_gym_slots(id) on delete set null,
  created_at timestamptz not null default now(),
  authorized_at timestamptz,
  notes text
);

create index if not exists idx_tribu_slot_requests_status on tribu_slot_requests(status);
create index if not exists idx_tribu_slot_requests_created_at on tribu_slot_requests(created_at desc);
