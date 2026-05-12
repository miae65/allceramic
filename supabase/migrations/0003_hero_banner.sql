-- site_settings에 배너 컬럼 추가
alter table public.site_settings
  add column if not exists hero_image_url text,
  add column if not exists hero_title     text not null default 'Allceramic',
  add column if not exists hero_subtitle  text not null default 'A curated space for ceramic arts';

-- 배너 이미지 저장용 버킷
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- 버킷 정책: 누구나 읽기, 관리자만 쓰기/수정/삭제
drop policy if exists "site-assets read" on storage.objects;
drop policy if exists "site-assets admin insert" on storage.objects;
drop policy if exists "site-assets admin update" on storage.objects;
drop policy if exists "site-assets admin delete" on storage.objects;

create policy "site-assets read" on storage.objects
  for select using (bucket_id = 'site-assets');
create policy "site-assets admin insert" on storage.objects
  for insert with check (bucket_id = 'site-assets' and public.is_admin());
create policy "site-assets admin update" on storage.objects
  for update using (bucket_id = 'site-assets' and public.is_admin());
create policy "site-assets admin delete" on storage.objects
  for delete using (bucket_id = 'site-assets' and public.is_admin());
