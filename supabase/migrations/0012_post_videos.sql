-- 게시물에 영상 URL 컬럼 추가 (있으면 영상 게시물)
alter table public.posts
  add column if not exists video_url text;

-- 영상 파일용 버킷 (100MB 제한)
insert into storage.buckets (id, name, public, file_size_limit)
values ('post-videos', 'post-videos', true, 104857600)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

drop policy if exists "post-videos read" on storage.objects;
drop policy if exists "post-videos own insert" on storage.objects;
drop policy if exists "post-videos own update" on storage.objects;
drop policy if exists "post-videos own delete" on storage.objects;

create policy "post-videos read"
  on storage.objects for select using (bucket_id = 'post-videos');

create policy "post-videos own insert"
  on storage.objects for insert with check (
    bucket_id = 'post-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "post-videos own update"
  on storage.objects for update using (
    bucket_id = 'post-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "post-videos own delete"
  on storage.objects for delete using (
    bucket_id = 'post-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
