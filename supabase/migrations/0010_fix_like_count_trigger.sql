-- update_like_count를 security definer로 변경
-- (다른 유저 게시물에 좋아요 시, posts UPDATE RLS에 막히는 문제 해결)
create or replace function public.update_like_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.posts set like_count = like_count - 1 where id = OLD.post_id;
  end if;
  return null;
end;
$$;

-- 누락된 카운트 복구: 현재 likes를 기준으로 posts.like_count 재계산
update public.posts p
set like_count = coalesce(sub.cnt, 0)
from (
  select post_id, count(*)::int as cnt
  from public.likes
  group by post_id
) sub
where sub.post_id = p.id;

update public.posts
set like_count = 0
where id not in (select post_id from public.likes);
