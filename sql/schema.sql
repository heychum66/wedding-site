-- Evan & Remy wedding site schema (Supabase / any Postgres 13+).
-- Safe to run more than once: `npm run migrate`.

create table if not exists rsvps (
  id             uuid primary key default gen_random_uuid(),
  edit_token     text unique not null,
  name           text not null,
  attending      boolean not null,
  party_size     int not null default 1 check (party_size between 1 and 5),
  meal           text,
  song           text,
  note           text,
  phone          text,
  address_street text,
  address_city   text,
  address_state  text,
  address_zip    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Added after the first version of the table; keeps older databases in step.
alter table rsvps add column if not exists phone text;
alter table rsvps add column if not exists address_street text;
alter table rsvps add column if not exists address_city text;
alter table rsvps add column if not exists address_state text;
alter table rsvps add column if not exists address_zip text;

create index if not exists rsvps_updated_at_idx on rsvps (updated_at desc);

-- One row per RSVP submission attempt, for the per-IP rate limit (5 per 10 minutes).
create table if not exists rsvp_attempts (
  id         bigserial primary key,
  ip         text not null,
  created_at timestamptz not null default now()
);

create index if not exists rsvp_attempts_ip_idx on rsvp_attempts (ip, created_at desc);

-- Supabase exposes the public schema through its REST API using the anon key.
-- Turning on row level security with no policies means that API can read nothing here.
-- The site itself connects as the database owner over DATABASE_URL, which bypasses RLS.
alter table rsvps enable row level security;
alter table rsvp_attempts enable row level security;
