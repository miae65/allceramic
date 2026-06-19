-- 중고거래·전시정보 게시글에 이미지 URL 배열 추가
alter table public.info_posts
  add column if not exists image_urls text[] not null default '{}';

alter table public.exhibition_posts
  add column if not exists image_urls text[] not null default '{}';
