-- PayFlex BNPL — Evaluations Table
-- Run this in the Supabase SQL Editor (supabase.com → project → SQL Editor)

-- 1. Create the evaluations table
create table if not exists public.evaluations (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  input       jsonb not null,
  result      jsonb not null,
  created_at  timestamptz default now() not null
);

-- 2. Create index for fast user queries
create index if not exists idx_evaluations_user 
  on public.evaluations(user_id, created_at desc);

-- 3. Enable Row Level Security
alter table public.evaluations enable row level security;

-- 4. RLS Policies — users can only access their own data
create policy "Users can read own evaluations"
  on public.evaluations for select
  using (auth.uid() = user_id);

create policy "Users can insert own evaluations"
  on public.evaluations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own evaluations"
  on public.evaluations for delete
  using (auth.uid() = user_id);
