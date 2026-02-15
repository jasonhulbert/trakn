
-- Fix mutable search_path security warning on handle_updated_at
alter function public.handle_updated_at() set search_path = '';
