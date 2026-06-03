alter table public.questions
add column if not exists bot_answer text,
add column if not exists answer_source text not null default 'pending',
add column if not exists reviewed boolean not null default false;

create table if not exists public.vivian_style_examples (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  source text,
  source_date timestamptz,
  title text,
  content text not null,
  tags text[] default '{}',
  approved boolean not null default false,
  private boolean not null default true
);

create table if not exists public.vivian_knowledge (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  topic text,
  content text not null,
  tags text[] default '{}',
  approved boolean not null default false,
  private boolean not null default true
);

alter table public.vivian_style_examples enable row level security;
alter table public.vivian_knowledge enable row level security;

-- No public select/insert/update/delete policies yet.
-- These tables are for server-side retrieval/admin tooling only.
