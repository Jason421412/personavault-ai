-- PersonaVault AI schema through Phase 4
-- Run this file in the Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  headline text,
  university text,
  major text,
  location text,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  bio text,
  is_email_verified boolean not null default false,
  is_github_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_user_id_unique unique (user_id),
  constraint profiles_display_name_length check (char_length(display_name) between 2 and 120),
  constraint profiles_headline_length check (headline is null or char_length(headline) <= 160),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 1200)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size bigint not null,
  storage_path text not null,
  sha256_hash text not null,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  constraint documents_storage_path_unique unique (storage_path),
  constraint documents_file_size_positive check (file_size > 0),
  constraint documents_sha256_hash_format check (sha256_hash ~ '^[a-f0-9]{64}$'),
  constraint documents_visibility_check check (visibility in ('private')),
  constraint documents_file_type_check check (
    file_type in ('application/pdf', 'image/png', 'image/jpeg')
  )
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists audit_logs_user_id_created_at_idx
  on public.audit_logs(user_id, created_at desc);
create index if not exists documents_user_id_created_at_idx
  on public.documents(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.audit_logs enable row level security;
alter table public.documents enable row level security;

drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "audit_logs_insert_own" on public.audit_logs;
create policy "audit_logs_insert_own"
on public.audit_logs
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "audit_logs_select_own" on public.audit_logs;
create policy "audit_logs_select_own"
on public.audit_logs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own"
on public.documents
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own"
on public.documents
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "documents_delete_own" on public.documents;
create policy "documents_delete_own"
on public.documents
for delete
to authenticated
using (auth.uid() = user_id);

-- Private Supabase Storage bucket used by the vault.
-- The bucket is not public; the app does not create public URLs by default.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760,
  array['application/pdf', 'image/png', 'image/jpeg']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table storage.objects enable row level security;

drop policy if exists "documents_storage_select_own" on storage.objects;
create policy "documents_storage_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "documents_storage_insert_own" on storage.objects;
create policy "documents_storage_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "documents_storage_delete_own" on storage.objects;
create policy "documents_storage_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);
