-- ============================================================
-- Admin + Moderator Module Migration (Backward Compatible)
-- ============================================================

-- 1) Profiles table for role-aware auth (optional source of truth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'client',
  disabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Keep updated_at fresh
create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Baseline profile rows from users table
insert into public.profiles (id, email, full_name, role, disabled, created_at)
select u.id, u.email, u.full_name, u.role::text, (u.deleted_at is not null), u.created_at
from public.users u
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  disabled = excluded.disabled;

-- Required policy from request (admins can read all profiles)
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
using (
  coalesce(auth.jwt() ->> 'role', public.get_user_role()) in ('admin', 'super_admin')
);

-- Self-service profile access
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Admins can update all profiles"
on public.profiles
for update
using (coalesce(auth.jwt() ->> 'role', public.get_user_role()) in ('admin', 'super_admin'))
with check (coalesce(auth.jwt() ->> 'role', public.get_user_role()) in ('admin', 'super_admin'));

-- 2) Add moderation review fields to ads table
alter table public.ads
  add column if not exists reviewed_by uuid references public.users(id),
  add column if not exists reviewed_at timestamptz,
  add column if not exists review_note text;

-- 3) RLS policy for moderators/admins to review ads
-- Requested intent: only moderator/admin can update review data
-- In this schema, role comes from users table and can also come from JWT metadata.
drop policy if exists "Moderators can review ads" on public.ads;
create policy "Moderators can review ads"
on public.ads
for update
using (
  coalesce(auth.jwt() ->> 'role', public.get_user_role()) in ('moderator', 'admin', 'super_admin')
)
with check (
  coalesce(auth.jwt() ->> 'role', public.get_user_role()) in ('moderator', 'admin', 'super_admin')
);

-- 4) Optional sync helper for new auth users -> profiles
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_profile();
