
-- Create workouts table
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_type text not null check (workout_type in ('hypertrophy', 'strength', 'conditioning')),
  data jsonb not null,
  input jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index on user_id for efficient lookups
create index workouts_user_id_idx on public.workouts(user_id);

-- Index on workout_type for filtering
create index workouts_workout_type_idx on public.workouts(workout_type);

-- Enable RLS
alter table public.workouts enable row level security;

-- RLS policies: users can only access their own workouts
create policy "Users can view their own workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workouts"
  on public.workouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own workouts"
  on public.workouts for delete
  using (auth.uid() = user_id);

-- Reuse the handle_updated_at trigger function from user_profiles migration
create trigger workouts_updated_at
  before update on public.workouts
  for each row
  execute function public.handle_updated_at();
