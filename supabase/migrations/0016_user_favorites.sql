-- 사용자 즐겨찾기 (사용자가 다른 사용자를 즐겨찾기)
create table if not exists public.user_favorites (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  favorite_id  uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (user_id, favorite_id),
  check (user_id <> favorite_id)
);
create index if not exists user_favorites_user_idx on public.user_favorites (user_id, created_at desc);

alter table public.user_favorites enable row level security;
drop policy if exists "user_favorites read own" on public.user_favorites;
drop policy if exists "user_favorites insert own" on public.user_favorites;
drop policy if exists "user_favorites delete own" on public.user_favorites;
create policy "user_favorites read own" on public.user_favorites for select using (auth.uid() = user_id);
create policy "user_favorites insert own" on public.user_favorites for insert with check (auth.uid() = user_id);
create policy "user_favorites delete own" on public.user_favorites for delete using (auth.uid() = user_id);
