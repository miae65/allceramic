-- ============================================================
-- Allceramic Initial Schema
-- ============================================================

-- profiles: auth.users와 1:1 연결
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  bio         text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- posts
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  caption     text,
  like_count  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- post_images: 게시물당 여러 이미지 (모두 3:4 비율)
create table public.post_images (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  url        text not null,
  position   int not null default 0, -- 이미지 순서
  created_at timestamptz not null default now()
);

-- comments: 계층형 (parent_id로 대댓글 구현)
create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  parent_id  uuid references public.comments(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- likes
create table public.likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- bookmarks (즐겨찾기)
create table public.bookmarks (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- ============================================================
-- 인덱스
-- ============================================================
create index on public.posts (user_id, created_at desc);
create index on public.posts (like_count desc);
create index on public.post_images (post_id, position);
create index on public.comments (post_id, parent_id, created_at);
create index on public.likes (post_id);
create index on public.bookmarks (user_id, created_at desc);

-- ============================================================
-- like_count 자동 업데이트 트리거
-- ============================================================
create or replace function update_like_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.posts set like_count = like_count - 1 where id = OLD.post_id;
  end if;
  return null;
end;
$$;

create trigger on_like_change
  after insert or delete on public.likes
  for each row execute function update_like_count();

-- ============================================================
-- 신규 유저 가입 시 profiles 자동 생성
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  return NEW;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.profiles  enable row level security;
alter table public.posts     enable row level security;
alter table public.post_images enable row level security;
alter table public.comments  enable row level security;
alter table public.likes     enable row level security;
alter table public.bookmarks enable row level security;

-- profiles
create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- posts
create policy "posts are viewable by everyone"
  on public.posts for select using (true);
create policy "authenticated users can insert posts"
  on public.posts for insert with check (auth.uid() = user_id);
create policy "users can update own posts"
  on public.posts for update using (auth.uid() = user_id);
create policy "users can delete own posts"
  on public.posts for delete using (auth.uid() = user_id);

-- post_images
create policy "post images are viewable by everyone"
  on public.post_images for select using (true);
create policy "post owner can manage images"
  on public.post_images for all using (
    exists (select 1 from public.posts where id = post_id and user_id = auth.uid())
  );

-- comments
create policy "comments are viewable by everyone"
  on public.comments for select using (true);
create policy "authenticated users can insert comments"
  on public.comments for insert with check (auth.uid() = user_id);
create policy "users can update own comments"
  on public.comments for update using (auth.uid() = user_id);
create policy "users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- likes
create policy "likes are viewable by everyone"
  on public.likes for select using (true);
create policy "authenticated users can like"
  on public.likes for insert with check (auth.uid() = user_id);
create policy "users can remove own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- bookmarks
create policy "users can view own bookmarks"
  on public.bookmarks for select using (auth.uid() = user_id);
create policy "authenticated users can bookmark"
  on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "users can remove own bookmarks"
  on public.bookmarks for delete using (auth.uid() = user_id);
