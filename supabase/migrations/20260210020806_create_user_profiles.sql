
-- Create user_profiles table
create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  age integer not null check (age > 0),
  weight numeric not null check (weight > 0),
  weight_unit text not null check (weight_unit in ('lbs', 'kg')),
  fitness_level integer not null check (fitness_level >= 1 and fitness_level <= 5),
  physical_limitations text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_profiles_user_id_unique unique (user_id)
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- RLS policies: users can only access their own profile
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own profile"
  on public.user_profiles for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at on row change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = '';

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.handle_updated_at();
