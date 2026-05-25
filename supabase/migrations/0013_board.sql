-- 자유게시판 게시글
create table if not exists public.board_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  content     text not null,
  view_count  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists board_posts_created_idx on public.board_posts (created_at desc);
create index if not exists board_posts_user_idx on public.board_posts (user_id, created_at desc);

alter table public.board_posts enable row level security;
drop policy if exists "board_posts read" on public.board_posts;
drop policy if exists "board_posts insert" on public.board_posts;
drop policy if exists "board_posts update own" on public.board_posts;
drop policy if exists "board_posts delete own or admin" on public.board_posts;
create policy "board_posts read" on public.board_posts for select using (true);
create policy "board_posts insert" on public.board_posts for insert with check (auth.uid() = user_id);
create policy "board_posts update own" on public.board_posts for update using (auth.uid() = user_id);
create policy "board_posts delete own or admin"
  on public.board_posts for delete using (auth.uid() = user_id or public.is_admin());

-- 자유게시판 댓글
create table if not exists public.board_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.board_posts(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists board_comments_post_idx on public.board_comments (post_id, created_at);

alter table public.board_comments enable row level security;
drop policy if exists "board_comments read" on public.board_comments;
drop policy if exists "board_comments insert" on public.board_comments;
drop policy if exists "board_comments delete own or admin" on public.board_comments;
create policy "board_comments read" on public.board_comments for select using (true);
create policy "board_comments insert" on public.board_comments for insert with check (auth.uid() = user_id);
create policy "board_comments delete own or admin"
  on public.board_comments for delete using (auth.uid() = user_id or public.is_admin());

-- 조회수 증가 RPC
create or replace function public.increment_board_view(post uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.board_posts set view_count = view_count + 1 where id = post;
$$;

grant execute on function public.increment_board_view(uuid) to anon, authenticated;
