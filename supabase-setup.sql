-- Run this once in Supabase SQL Editor.
-- This adds a real photo table and a Storage bucket for authenticated users.

create table if not exists public.bike_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_path text not null,
  public_url text not null,
  original_name text,
  created_at timestamptz not null default now()
);

alter table public.bike_photos enable row level security;

drop policy if exists "Users can view their own bike photos" on public.bike_photos;
create policy "Users can view their own bike photos"
on public.bike_photos for select
using (auth.uid() = user_id);

drop policy if exists "Users can add their own bike photos" on public.bike_photos;
create policy "Users can add their own bike photos"
on public.bike_photos for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own bike photos" on public.bike_photos;
create policy "Users can delete their own bike photos"
on public.bike_photos for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('bike-images', 'bike-images', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload bike images" on storage.objects;
create policy "Authenticated users can upload bike images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'bike-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete their bike images" on storage.objects;
create policy "Users can delete their bike images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'bike-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- The bucket is public so the app can display the saved image URL.
-- Uploads are still restricted to authenticated users by the policy above.
