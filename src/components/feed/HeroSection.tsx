import Image from 'next/image'

const HERO_IMAGE = '/hero.jpg'

export function HeroSection() {
  return (
    <section className="relative h-[72vh] flex items-center justify-center overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: 'center 50%' }}
      />

      {/* 딤 */}
      <div className="absolute inset-0 bg-black/10" />

      {/* 하단 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />

      {/* 타이포그래피 */}
      <div className="relative z-10 text-center select-none">
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
          Allceramic
        </h1>
        <p className="mt-5 text-white/70 tracking-[0.25em] text-xs uppercase font-sans">
          A curated space for ceramic arts
        </p>
      </div>
    </section>
  )
}
