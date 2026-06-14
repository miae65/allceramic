-- 구인·구직 게시판
create table if not exists public.job_posts (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  kind                text not null check (kind in ('hiring','seeking')),
  title               text not null,
  position            text not null,
  region              text not null,
  work_type           text not null,
  contact             text not null,
  content             text not null,
  -- 구인 전용
  company_name        text,
  salary              text,
  experience_required text,
  deadline            date,
  -- 구직 전용
  experience          text,
  portfolio_url       text,
  available_from      date,
  view_count          int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists job_posts_kind_created_idx on public.job_posts (kind, created_at desc);
create index if not exists job_posts_user_idx on public.job_posts (user_id, created_at desc);

alter table public.job_posts enable row level security;
drop policy if exists "job_posts read" on public.job_posts;
drop policy if exists "job_posts insert" on public.job_posts;
drop policy if exists "job_posts update own" on public.job_posts;
drop policy if exists "job_posts delete own or admin" on public.job_posts;
create policy "job_posts read" on public.job_posts for select using (true);
create policy "job_posts insert" on public.job_posts for insert with check (auth.uid() = user_id);
create policy "job_posts update own" on public.job_posts for update using (auth.uid() = user_id);
create policy "job_posts delete own or admin"
  on public.job_posts for delete using (auth.uid() = user_id or public.is_admin());

-- 구인·구직 댓글
create table if not exists public.job_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.job_posts(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists job_comments_post_idx on public.job_comments (post_id, created_at);

alter table public.job_comments enable row level security;
drop policy if exists "job_comments read" on public.job_comments;
drop policy if exists "job_comments insert" on public.job_comments;
drop policy if exists "job_comments delete own or admin" on public.job_comments;
create policy "job_comments read" on public.job_comments for select using (true);
create policy "job_comments insert" on public.job_comments for insert with check (auth.uid() = user_id);
create policy "job_comments delete own or admin"
  on public.job_comments for delete using (auth.uid() = user_id or public.is_admin());

-- 조회수 증가 RPC
create or replace function public.increment_job_view(post uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.job_posts set view_count = view_count + 1 where id = post;
$$;

grant execute on function public.increment_job_view(uuid) to anon, authenticated;
