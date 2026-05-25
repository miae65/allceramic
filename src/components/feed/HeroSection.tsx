import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_IMAGE = '/hero.jpg'
const DEFAULT_TITLE = 'Allceramic'
const DEFAULT_SUBTITLE = 'A curated space for ceramic arts'
const DEFAULT_POSITION = '50% 50%'

async function fetchHero() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('site_settings')
    .select('hero_image_url, hero_title, hero_subtitle, hero_object_position, hero_scale, hero_mobile_image_url, hero_mobile_object_position, hero_mobile_scale')
    .eq('id', 1)
    .single()

  const desktopImage = (data?.hero_image_url as string | null) || DEFAULT_IMAGE
  const mobileImage = (data?.hero_mobile_image_url as string | null) || desktopImage

  return {
    title: (data?.hero_title as string | null) || DEFAULT_TITLE,
    subtitle: (data?.hero_subtitle as string | null) || DEFAULT_SUBTITLE,
    desktop: {
      image: desktopImage,
      position: (data?.hero_object_position as string | null) || DEFAULT_POSITION,
      scale: Number(data?.hero_scale ?? 1) || 1,
    },
    mobile: {
      image: mobileImage,
      position: (data?.hero_mobile_object_position as string | null) || DEFAULT_POSITION,
      scale: Number(data?.hero_mobile_scale ?? 1) || 1,
    },
  }
}

export async function HeroSection() {
  const { title, subtitle, desktop, mobile } = await fetchHero()

  return (
    <section className="relative h-[72vh] flex items-center justify-center overflow-hidden">
      {/* 데스크탑 이미지 (md 이상) */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <Image
          src={desktop.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: desktop.position,
            transform: `scale(${desktop.scale})`,
            transformOrigin: desktop.position,
          }}
        />
      </div>

      {/* 모바일 이미지 (md 미만) */}
      <div className="md:hidden absolute inset-0 overflow-hidden">
        <Image
          src={mobile.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: mobile.position,
            transform: `scale(${mobile.scale})`,
            transformOrigin: mobile.position,
          }}
        />
      </div>

      {/* 딤 */}
      <div className="absolute inset-0 bg-black/10" />

      {/* 하단 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />

      {/* 타이포그래피 */}
      <div className="relative z-10 text-center select-none px-6">
        <h1
          className="font-serif text-[clamp(3.5rem,10vw,7rem)] tracking-[0.18em] text-white leading-none"
          style={{
            textShadow: [
              '0 0 24px rgba(255,253,230,0.5)',
              '0 0 60px rgba(255,253,230,0.3)',
              '0 0 120px rgba(255,253,230,0.15)',
            ].join(', '),
          }}
        >
          {title}
        </h1>
        <p className="mt-5 text-white/70 tracking-[0.25em] text-xs uppercase font-sans">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
