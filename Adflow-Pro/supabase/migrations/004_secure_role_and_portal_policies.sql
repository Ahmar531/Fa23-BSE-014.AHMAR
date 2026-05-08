-- ============================================================
-- Secure role assignment + portal policy hardening
-- ============================================================

-- 1) Profiles remain the server-side role source of truth for dashboard access.
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

alter table public.ads
  add column if not exists reviewed_by uuid references public.users(id),
  add column if not exists reviewed_at timestamptz,
  add column if not exists review_note text;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

insert into public.profiles (id, email, full_name, role, disabled, created_at)
select
  u.id,
  u.email,
  u.full_name,
  coalesce(u.role::text, 'client'),
  (u.deleted_at is not null),
  u.created_at
from public.users u
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  disabled = excluded.disabled,
  updated_at = now();

-- 2) Never trust public signup metadata for privileged roles.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'client',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    'client'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

create or replace function public.sync_profile_from_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, disabled, created_at, updated_at)
  values (
    new.id,
    new.email,
    new.full_name,
    coalesce(new.role::text, 'client'),
    (new.deleted_at is not null),
    coalesce(new.created_at, now()),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    disabled = excluded.disabled,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_public_user_synced_to_profile on public.users;
create trigger on_public_user_synced_to_profile
after insert or update on public.users
for each row execute function public.sync_profile_from_user();

-- 3) Remove self-service role mutation paths.
drop policy if exists "users_update_own" on public.users;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "users_update_admin" on public.users;
create policy "users_update_admin" on public.users
for update
using (
  public.get_user_role() = 'super_admin'
  or (
    public.get_user_role() = 'admin'
    and role in ('client', 'moderator')
  )
)
with check (
  public.get_user_role() = 'super_admin'
  or (
    public.get_user_role() = 'admin'
    and role in ('client', 'moderator')
  )
);

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
using (
  coalesce(auth.jwt() ->> 'role', public.get_user_role()) in ('admin', 'super_admin')
);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Admins can update all profiles"
on public.profiles
for update
using (
  coalesce(auth.jwt() ->> 'role', public.get_user_role()) = 'super_admin'
  or (
    coalesce(auth.jwt() ->> 'role', public.get_user_role()) = 'admin'
    and role in ('client', 'moderator')
  )
)
with check (
  coalesce(auth.jwt() ->> 'role', public.get_user_role()) = 'super_admin'
  or (
    coalesce(auth.jwt() ->> 'role', public.get_user_role()) = 'admin'
    and role in ('client', 'moderator')
  )
);

drop policy if exists "Admins can insert profiles" on public.profiles;
create policy "Admins can insert profiles"
on public.profiles
for insert
with check (
  coalesce(auth.jwt() ->> 'role', public.get_user_role()) = 'super_admin'
  or (
    coalesce(auth.jwt() ->> 'role', public.get_user_role()) = 'admin'
    and role in ('client', 'moderator')
  )
);

-- 4) Keep moderation updates explicitly limited to staff users.
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
