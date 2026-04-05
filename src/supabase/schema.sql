-- ============================================================
-- Freaky Friday Hub — Supabase schema
-- Run this in your Supabase project → SQL Editor → New Query
-- ============================================================
 
-- Enable Row Level Security helpers
create extension if not exists "uuid-ossp";
 
-- ── Members ─────────────────────────────────────────────────
create table if not exists members (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  initials    text not null,
  role        text not null default 'Member',    -- Admin | Host | Member | Lead | New
  note        text,
  avatar_key  text not null default 'a1',        -- a1 | a2 | a3 | a4
  tag         text,
  created_at  timestamptz default now()
);
 
-- ── Sessions ─────────────────────────────────────────────────
create table if not exists sessions (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null default 'Friday Session',
  date        date not null default current_date,
  active      boolean default true,
  created_at  timestamptz default now()
);
 
-- ── Teams ────────────────────────────────────────────────────
create table if not exists teams (
  id          uuid primary key default uuid_generate_v4(),
  session_id  uuid references sessions(id) on delete cascade,
  name        text not null,
  color       text not null default 'teal',      -- teal | gold
  created_at  timestamptz default now()
);
 
-- ── Scores ───────────────────────────────────────────────────
create table if not exists scores (
  id          uuid primary key default uuid_generate_v4(),
  session_id  uuid references sessions(id) on delete cascade,
  team_id     uuid references teams(id) on delete cascade,
  points      integer not null default 0,
  cheers      integer not null default 0,
  stars       integer not null default 0,
  updated_at  timestamptz default now()
);
 
-- ── Games ────────────────────────────────────────────────────
create table if not exists games (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  duration    integer not null,   -- minutes
  description text,
  flavor      text default 'blue',  -- blue | gold | rose | teal
  labels      text[] default '{}',
  active      boolean default true
);
 
-- ── Seed: default games ──────────────────────────────────────
insert into games (title, duration, description, flavor, labels) values
  ('Rapid-Fire Trivia',        15, 'Fast questions, team points, and instant live-score excitement.',       'blue',  array['Live score','Hybrid','Zero prep']),
  ('Desk Scavenger Hunt',      20, 'People race to find funny items, complete clues, and win stars.',       'gold',  array['Cheer-heavy','Office','Team play']),
  ('Charades Clash',           25, 'Big laughs, quick rounds, and easy scoring for hosts.',                 'rose',  array['Simple','Any team','High fun']),
  ('Mystery Pitch Battle',     30, 'Create wild product ideas and let the crowd award cheers and stars.',   'teal',  array['Creative','Stars','Presentation']),
  ('Emoji Story Jam',          30, 'Teams build hilarious stories from random emoji prompts.',              'blue',  array['Remote-friendly','Cheer mode','Light']),
  ('Minute-to-Win Challenges', 35, 'Tiny silly challenges with fast points and crowd reactions.',           'gold',  array['Stars','High energy','Best live']);
 
-- ── Row Level Security (public read, service-role write) ─────
alter table members  enable row level security;
alter table sessions enable row level security;
alter table teams    enable row level security;
alter table scores   enable row level security;
alter table games    enable row level security;
 
drop policy if exists "public read members"  on members;
drop policy if exists "public read sessions" on sessions;
drop policy if exists "public read teams"    on teams;
drop policy if exists "public read scores"   on scores;
drop policy if exists "public read games"    on games;
drop policy if exists "anon write members"   on members;
drop policy if exists "anon write sessions"  on sessions;
drop policy if exists "anon write teams"     on teams;
drop policy if exists "anon write scores"    on scores;
 
create policy "public read members"  on members  for select using (true);
create policy "public read sessions" on sessions for select using (true);
create policy "public read teams"    on teams    for select using (true);
create policy "public read scores"   on scores   for select using (true);
create policy "public read games"    on games    for select using (true);
 
create policy "anon write members"   on members  for all using (true) with check (true);
create policy "anon write sessions"  on sessions for all using (true) with check (true);
create policy "anon write teams"     on teams    for all using (true) with check (true);
create policy "anon write scores"    on scores   for all using (true) with check (true);