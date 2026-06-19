-- 전시정보 게시판
create table if not exists public.exhibition_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  content     text not null,
  view_count  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists exhibition_posts_created_idx on public.exhibition_posts (created_at desc);
create index if not exists exhibition_posts_user_idx on public.exhibition_posts (user_id, created_at desc);

alter table public.exhibition_posts enable row level security;
drop policy if exists "exhibition_posts read" on public.exhibition_posts;
drop policy if exists "exhibition_posts insert" on public.exhibition_posts;
drop policy if exists "exhibition_posts update own" on public.exhibition_posts;
drop policy if exists "exhibition_posts delete own or admin" on public.exhibition_posts;
create policy "exhibition_posts read" on public.exhibition_posts for select using (true);
create policy "exhibition_posts insert" on public.exhibition_posts for insert with check (auth.uid() = user_id);
create policy "exhibition_posts update own" on public.exhibition_posts for update using (auth.uid() = user_id);
create policy "exhibition_posts delete own or admin"
  on public.exhibition_posts for delete using (auth.uid() = user_id or public.is_admin());

-- 전시정보 댓글
create table if not exists public.exhibition_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.exhibition_posts(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists exhibition_comments_post_idx on public.exhibition_comments (post_id, created_at);

alter table public.exhibition_comments enable row level security;
drop policy if exists "exhibition_comments read" on public.exhibition_comments;
drop policy if exists "exhibition_comments insert" on public.exhibition_comments;
drop policy if exists "exhibition_comments delete own or admin" on public.exhibition_comments;
create policy "exhibition_comments read" on public.exhibition_comments for select using (true);
create policy "exhibition_comments insert" on public.exhibition_comments for insert with check (auth.uid() = user_id);
create policy "exhibition_comments delete own or admin"
  on public.exhibition_comments for delete using (auth.uid() = user_id or public.is_admin());

-- 조회수 증가 RPC
create or replace function public.increment_exhibition_view(post uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.exhibition_posts set view_count = view_count + 1 where id = post;
$$;

grant execute on function public.increment_exhibition_view(uuid) to anon, authenticated;
