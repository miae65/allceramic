-- 일자별 방문(페이지뷰) 누적 카운터
create table if not exists public.daily_visits (
  visit_date date primary key default current_date,
  count int not null default 0
);

alter table public.daily_visits enable row level security;

drop policy if exists "daily_visits_read" on public.daily_visits;
create policy "daily_visits_read"
  on public.daily_visits for select using (true);

-- 누구나 호출 가능한 카운터 증가 RPC
create or replace function public.record_visit()
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.daily_visits (visit_date, count)
  values (current_date, 1)
  on conflict (visit_date)
  do update set count = public.daily_visits.count + 1;
$$;

grant execute on function public.record_visit() to anon, authenticated;
