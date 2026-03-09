-- Add height fields to user_profiles table
alter table public.user_profiles
  add column height numeric check (height > 0),
  add column height_unit text check (height_unit in ('in', 'cm'));
