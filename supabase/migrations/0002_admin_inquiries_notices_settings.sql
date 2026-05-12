-- 관리자 판별 함수 (이메일 기반)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select email = 'dlaldo0605@gmail.com' from auth.users where id = auth.uid()),
    false
  )
$$;

-- 문의
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  subject     text not null,
  content     text not null,
  status      text not null default 'pending' check (status in ('pending', 'in_progress', 'resolved')),
  admin_reply text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists inquiries_user_id_idx on public.inquiries (user_id);
create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);

alter table public.inquiries enable row level security;
drop policy if exists "inquiries_select" on public.inquiries;
drop policy if exists "inquiries_insert" on public.inquiries;
drop policy if exists "inquiries_update" on public.inquiries;
drop policy if exists "inquiries_delete" on public.inquiries;
create policy "inquiries_select" on public.inquiries for select using (auth.uid() = user_id or public.is_admin());
create policy "inquiries_insert" on public.inquiries for insert with check (auth.uid() = user_id);
create policy "inquiries_update" on public.inquiries for update using (public.is_admin());
create policy "inquiries_delete" on public.inquiries for delete using (public.is_admin());

-- 공지
create table if not exists public.notices (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  content      text not null,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists notices_published_idx on public.notices (is_published, created_at desc);

alter table public.notices enable row level security;
drop policy if exists "notices_select" on public.notices;
drop policy if exists "notices_insert" on public.notices;
drop policy if exists "notices_update" on public.notices;
drop policy if exists "notices_delete" on public.notices;
create policy "notices_select" on public.notices for select using (is_published = true or public.is_admin());
create policy "notices_insert" on public.notices for insert with check (public.is_admin());
create policy "notices_update" on public.notices for update using (public.is_admin());
create policy "notices_delete" on public.notices for delete using (public.is_admin());

-- 사이트 설정 (단일 row)
create table if not exists public.site_settings (
  id            int primary key default 1 check (id = 1),
  site_name     text not null default 'Allceramic',
  contact_email text,
  sns_links     jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;
drop policy if exists "site_settings_select" on public.site_settings;
drop policy if exists "site_settings_update" on public.site_settings;
create policy "site_settings_select" on public.site_settings for select using (true);
create policy "site_settings_update" on public.site_settings for update using (public.is_admin());
