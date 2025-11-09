-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- Table: tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- Policies
create policy "read own tasks"
on public.tasks for select
using (auth.uid() = user_id);

create policy "insert own tasks"
on public.tasks for insert
with check (auth.uid() = user_id);

create policy "update own tasks"
on public.tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "delete own tasks"
on public.tasks for delete
using (auth.uid() = user_id);

-- Function: set_task_owner
create or replace function public.set_task_owner()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

-- Trigger
drop trigger if exists trg_set_task_owner on public.tasks;
create trigger trg_set_task_owner
before insert on public.tasks
for each row
execute procedure public.set_task_owner();
