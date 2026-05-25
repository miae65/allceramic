-- 모바일 배너 전용 설정
alter table public.site_settings
  add column if not exists hero_mobile_image_url text,
  add column if not exists hero_mobile_object_position text not null default '50% 50%',
  add column if not exists hero_mobile_scale numeric(3,2) not null default 1.0
    check (hero_mobile_scale >= 1.0 and hero_mobile_scale <= 3.0);
