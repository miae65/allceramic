-- 정보공유 게시판
create table if not exists public.info_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  content     text not null,
  view_count  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists info_posts_created_idx on public.info_posts (created_at desc);
create index if not exists info_posts_user_idx on public.info_posts (user_id, created_at desc);

alter table public.info_posts enable row level security;
drop policy if exists "info_posts read" on public.info_posts;
drop policy if exists "info_posts insert" on public.info_posts;
drop policy if exists "info_posts update own" on public.info_posts;
drop policy if exists "info_posts delete own or admin" on public.info_posts;
create policy "info_posts read" on public.info_posts for select using (true);
create policy "info_posts insert" on public.info_posts for insert with check (auth.uid() = user_id);
create policy "info_posts update own" on public.info_posts for update using (auth.uid() = user_id);
create policy "info_posts delete own or admin"
  on public.info_posts for delete using (auth.uid() = user_id or public.is_admin());

-- 정보공유 댓글
create table if not exists public.info_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.info_posts(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists info_comments_post_idx on public.info_comments (post_id, created_at);

alter table public.info_comments enable row level security;
drop policy if exists "info_comments read" on public.info_comments;
drop policy if exists "info_comments insert" on public.info_comments;
drop policy if exists "info_comments delete own or admin" on public.info_comments;
create policy "info_comments read" on public.info_comments for select using (true);
create policy "info_comments insert" on public.info_comments for insert with check (auth.uid() = user_id);
create policy "info_comments delete own or admin"
  on public.info_comments for delete using (auth.uid() = user_id or public.is_admin());

-- 조회수 증가 RPC
create or replace function public.increment_info_view(post uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.info_posts set view_count = view_count + 1 where id = post;
$$;

grant execute on function public.increment_info_view(uuid) to anon, authenticated;
