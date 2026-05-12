-- 공유 횟수 컬럼
alter table public.posts
  add column if not exists share_count int not null default 0;

-- 공유 카운터 증가 RPC (누구나 호출 가능)
create or replace function public.increment_share_count(post uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.posts set share_count = share_count + 1 where id = post;
$$;

grant execute on function public.increment_share_count(uuid) to anon, authenticated;
