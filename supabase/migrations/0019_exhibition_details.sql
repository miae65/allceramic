-- 전시정보 상세 컬럼 추가
alter table public.exhibition_posts
  add column if not exists start_date date,
  add column if not exists end_date   date,
  add column if not exists location   text,
  add column if not exists organizer  text;

-- 기간 정렬용 인덱스
create index if not exists exhibition_posts_start_idx on public.exhibition_posts (start_date);
