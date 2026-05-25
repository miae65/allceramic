-- 배너 이미지 포커스 위치(object-position)와 확대 배율(transform: scale)
alter table public.site_settings
  add column if not exists hero_object_position text not null default '50% 50%',
  add column if not exists hero_scale numeric(3,2) not null default 1.0 check (hero_scale >= 1.0 and hero_scale <= 3.0);
