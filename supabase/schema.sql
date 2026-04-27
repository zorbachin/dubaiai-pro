-- AI Audit Engine — Supabase schema
-- Run in the Supabase SQL editor (Project → SQL → "New query").
-- Idempotent: safe to re-run.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------
create table if not exists public.companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  website_url   text not null,
  industry      text,
  founders      text[],
  created_at    timestamptz not null default now(),
  unique (website_url)
);

-- ---------------------------------------------------------------
-- audits
-- ---------------------------------------------------------------
create type audit_status as enum (
  'queued', 'crawling', 'researching', 'generating', 'complete', 'failed'
);

create table if not exists public.audits (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid references public.companies(id) on delete set null,
  business_name   text not null,
  website_url     text not null,
  founders        text[],
  industry        text,
  contact_email   text not null,
  main_goal       text not null,
  status          audit_status not null default 'queued',
  status_message  text,
  report          jsonb,                       -- the structured audit JSON
  ai_readiness_score int,
  error           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists audits_status_idx     on public.audits(status);
create index if not exists audits_created_at_idx on public.audits(created_at desc);
create index if not exists audits_email_idx      on public.audits(contact_email);

-- ---------------------------------------------------------------
-- sources (citations gathered during research)
-- ---------------------------------------------------------------
create table if not exists public.sources (
  id          uuid primary key default gen_random_uuid(),
  audit_id    uuid not null references public.audits(id) on delete cascade,
  kind        text not null,         -- crawl | search | press | social | review | other
  title       text,
  url         text not null,
  snippet     text,
  fetched_at  timestamptz not null default now()
);

create index if not exists sources_audit_idx on public.sources(audit_id);

-- ---------------------------------------------------------------
-- report_sections (denormalised for quick rendering / search)
-- ---------------------------------------------------------------
create table if not exists public.report_sections (
  id          uuid primary key default gen_random_uuid(),
  audit_id    uuid not null references public.audits(id) on delete cascade,
  key         text not null,         -- executive_summary, quick_wins, etc.
  title       text not null,
  content     jsonb not null,
  order_idx   int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists report_sections_audit_idx on public.report_sections(audit_id);

-- ---------------------------------------------------------------
-- leads (CTA submissions: "Request Implementation Plan")
-- ---------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  audit_id    uuid references public.audits(id) on delete set null,
  email       text not null,
  name        text,
  phone       text,
  message     text,
  source      text default 'report-cta',
  created_at  timestamptz not null default now()
);

create index if not exists leads_audit_idx on public.leads(audit_id);

-- ---------------------------------------------------------------
-- admin_notes (private internal notes per audit)
-- ---------------------------------------------------------------
create table if not exists public.admin_notes (
  id         uuid primary key default gen_random_uuid(),
  audit_id   uuid not null references public.audits(id) on delete cascade,
  author     text,
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_notes_audit_idx on public.admin_notes(audit_id);

-- ---------------------------------------------------------------
-- updated_at trigger for audits
-- ---------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end $$ language plpgsql;

drop trigger if exists audits_set_updated_at on public.audits;
create trigger audits_set_updated_at
  before update on public.audits
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------
-- Row Level Security
--   The MVP uses the service-role key from the API routes for all writes,
--   so we keep RLS simple: deny by default, allow read of completed audits
--   to anonymous users via the `id` (the URL is the secret).
-- ---------------------------------------------------------------
alter table public.audits          enable row level security;
alter table public.companies       enable row level security;
alter table public.sources         enable row level security;
alter table public.report_sections enable row level security;
alter table public.leads           enable row level security;
alter table public.admin_notes     enable row level security;

-- Public can read a completed audit if they have its id (we look it up by id only).
drop policy if exists "audits read by id" on public.audits;
create policy "audits read by id" on public.audits
  for select using (status = 'complete');

drop policy if exists "sources read with audit" on public.sources;
create policy "sources read with audit" on public.sources
  for select using (
    exists (
      select 1 from public.audits a
      where a.id = sources.audit_id and a.status = 'complete'
    )
  );

drop policy if exists "report_sections read with audit" on public.report_sections;
create policy "report_sections read with audit" on public.report_sections
  for select using (
    exists (
      select 1 from public.audits a
      where a.id = report_sections.audit_id and a.status = 'complete'
    )
  );

-- Everything else is service-role-only (no policies = no anon access).
