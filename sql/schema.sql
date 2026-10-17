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

-- The invite list, imported from a CSV at /admin. Each row is one invitation
-- (a person or a household) with its own private link: /?i=<invite_token>.
create table if not exists guests (
  id           uuid primary key default gen_random_uuid(),
  invite_token text unique not null,
  name         text not null,
  party_size   int not null default 1 check (party_size between 1 and 5),
  phone        text,
  email        text,
  texted_at    timestamptz,
  emailed_at   timestamptz,
  created_at   timestamptz not null default now()
);

create unique index if not exists guests_name_key on guests (lower(name));

-- Per-person details, added after the first version of the table.
alter table guests add column if not exists first_name text;
alter table guests add column if not exists last_name text;
alter table guests add column if not exists plus_one_allowed boolean not null default false;
-- Bringing a plus-one: set by the import, then by the guest's own reply. null = not known yet.
alter table guests add column if not exists plus_one boolean;
-- Whose side: "Evan", "Remy", "Both", or whatever the spreadsheet said.
alter table guests add column if not exists side text;

-- A reply sent from an invite link belongs to that guest. Walk-up replies from the plain site have none.
alter table rsvps add column if not exists guest_id uuid references guests (id) on delete set null;
create unique index if not exists rsvps_guest_id_key on rsvps (guest_id);
alter table rsvps add column if not exists plus_one_name text;

-- Supabase exposes the public schema through its REST API using the anon key.
-- Turning on row level security with no policies means that API can read nothing here.
-- The site itself connects as the database owner over DATABASE_URL, which bypasses RLS.
alter table rsvps enable row level security;
alter table rsvp_attempts enable row level security;
alter table guests enable row level security;
