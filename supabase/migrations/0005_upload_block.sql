-- 회원별 업로드 차단 플래그
alter table public.profiles
  add column if not exists upload_blocked boolean not null default false;

-- 비관리자가 upload_blocked 컬럼 변경 차단 (트리거)
create or replace function public.protect_upload_blocked()
returns trigger
language plpgsql
security invoker
as $$
begin
  if (old.upload_blocked is distinct from new.upload_blocked) and not public.is_admin() then
    raise exception 'permission denied: only admins can change upload_blocked';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_upload_blocked on public.profiles;
create trigger profiles_protect_upload_blocked
  before update on public.profiles
  for each row execute function public.protect_upload_blocked();

-- 관리자는 다른 회원의 profile을 수정할 수 있도록 정책 추가
drop policy if exists "admin update profiles" on public.profiles;
create policy "admin update profiles"
  on public.profiles for update using (public.is_admin());

-- 게시물 INSERT 정책: 차단된 회원 거부 (defense in depth)
drop policy if exists "authenticated users can insert posts" on public.posts;
create policy "authenticated users can insert posts"
  on public.posts for insert
  with check (
    auth.uid() = user_id
    and not coalesce(
      (select upload_blocked from public.profiles where id = auth.uid()),
      false
    )
  );
