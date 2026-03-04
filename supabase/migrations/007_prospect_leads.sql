-- prospect_leads: outreach prospects imported from Google Maps / CSV scrapes
-- Separate from the `leads` table which tracks form submissions from the platform.

create table if not exists public.prospect_leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  source              text not null default 'google_maps',
  city                text,
  trade               text,
  company_name        text not null,
  phone               text,
  website             text,
  address             text,
  rating              numeric,
  reviews_count       int,
  google_profile_url  text,

  review_1            text,
  review_keyword      text,
  review_2            text,
  combined_review     text,

  communication_issue boolean not null default false,
  priority_score      int not null default 1,

  contacted           boolean not null default false,
  contacted_at        timestamptz,
  status              text not null default 'new',  -- new | contacted | replied | demo | won | lost
  notes               text,

  raw_row             jsonb,

  -- computed in app layer; used for deduplication on upsert
  dedupe_key          text unique not null
);

-- Indexes
create index if not exists prospect_leads_trade_idx         on public.prospect_leads(trade);
create index if not exists prospect_leads_priority_idx      on public.prospect_leads(priority_score desc);
create index if not exists prospect_leads_comm_issue_idx    on public.prospect_leads(communication_issue);
create index if not exists prospect_leads_status_idx        on public.prospect_leads(status);

-- RLS
alter table public.prospect_leads enable row level security;

create policy "admin select prospect_leads" on public.prospect_leads
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "admin insert prospect_leads" on public.prospect_leads
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "admin update prospect_leads" on public.prospect_leads
  for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin delete prospect_leads" on public.prospect_leads
  for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
