-- 문의 답변 알림용 컬럼
alter table public.inquiries
  add column if not exists replied_at timestamptz,
  add column if not exists reply_seen_at timestamptz;

-- 답변이 새로 달리거나 변경되면 replied_at 갱신 + reply_seen_at 초기화
create or replace function public.set_inquiry_replied_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  if new.admin_reply is not null
     and (old.admin_reply is null or new.admin_reply is distinct from old.admin_reply) then
    new.replied_at = now();
    new.reply_seen_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists inquiries_set_replied_at on public.inquiries;
create trigger inquiries_set_replied_at
  before update on public.inquiries
  for each row execute function public.set_inquiry_replied_at();

-- 내 미확인 답변 카운트
create or replace function public.count_my_unread_replies()
returns int
language sql
security definer
set search_path = ''
as $$
  select coalesce(count(*), 0)::int from public.inquiries
  where user_id = auth.uid()
    and admin_reply is not null
    and (reply_seen_at is null or reply_seen_at < replied_at);
$$;

grant execute on function public.count_my_unread_replies() to authenticated;

-- 내 문의의 답변을 본 것으로 표시
create or replace function public.mark_my_inquiries_seen()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.inquiries
  set reply_seen_at = now()
  where user_id = auth.uid()
    and admin_reply is not null
    and (reply_seen_at is null or reply_seen_at < replied_at);
$$;

grant execute on function public.mark_my_inquiries_seen() to authenticated;
