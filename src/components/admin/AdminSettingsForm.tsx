'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { SiteSettings } from '@/types'

const SNS_KEYS = ['instagram', 'twitter', 'youtube', 'website'] as const
type SnsKey = (typeof SNS_KEYS)[number]
const SNS_LABEL: Record<SnsKey, string> = {
  instagram: 'Instagram',
  twitter: 'Twitter / X',
  youtube: 'YouTube',
  website: 'Website',
}

const DEFAULT_IMAGE = '/hero.jpg'

type Variant = 'desktop' | 'mobile'

function parsePosition(s: string): { x: number; y: number } {
  const m = s.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
  if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) }
  return { x: 50, y: 50 }
}

export function AdminSettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null)

  const [siteName, setSiteName] = useState(initial.site_name)
  const [contactEmail, setContactEmail] = useState(initial.contact_email ?? '')
  const [snsLinks, setSnsLinks] = useState<Record<string, string>>(initial.sns_links ?? {})
  const [heroTitle, setHeroTitle] = useState(initial.hero_title)
  const [heroSubtitle, setHeroSubtitle] = useState(initial.hero_subtitle)

  // 데스크탑 배너
  const dPos = parsePosition(initial.hero_object_position)
  const [dImageUrl, setDImageUrl] = useState<string | null>(initial.hero_image_url ?? null)
  const [dPosX, setDPosX] = useState(dPos.x)
  const [dPosY, setDPosY] = useState(dPos.y)
  const [dScale, setDScale] = useState(Number(initial.hero_scale) || 1)

  // 모바일 배너
  const mPos = parsePosition(initial.hero_mobile_object_position)
  const [mImageUrl, setMImageUrl] = useState<string | null>(initial.hero_mobile_image_url ?? null)
  const [mPosX, setMPosX] = useState(mPos.x)
  const [mPosY, setMPosY] = useState(mPos.y)
  const [mScale, setMScale] = useState(Number(initial.hero_mobile_scale) || 1)

  const [activeTab, setActiveTab] = useState<Variant>('desktop')
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // 현재 활성 변형의 값/세터 (자동으로 desktop/mobile 변수에 매핑)
  const isDesktop = activeTab === 'desktop'
  const imageUrl = isDesktop ? dImageUrl : mImageUrl
  const setImageUrl = isDesktop ? setDImageUrl : setMImageUrl
  const posX = isDesktop ? dPosX : mPosX
  const setPosX = isDesktop ? setDPosX : setMPosX
  const posY = isDesktop ? dPosY : mPosY
  const setPosY = isDesktop ? setDPosY : setMPosY
  const scale = isDesktop ? dScale : mScale
  const setScale = isDesktop ? setDScale : setMScale

  const previewImage = imageUrl || (isDesktop ? DEFAULT_IMAGE : (dImageUrl || DEFAULT_IMAGE))
  const positionStr = `${posX}% ${posY}%`

  const resetTransform = () => {
    setPosX(50)
    setPosY(50)
    setScale(1)
  }

  // 이미지 또는 탭이 바뀌면 natural 측정 리셋
  useEffect(() => {
    setImgNatural(null)
  }, [previewImage, activeTab])

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight })
  }

  const startDrag = (clientX: number, clientY: number) => {
    dragRef.current = { startX: clientX, startY: clientY, posX, posY }
    setDragging(true)
  }

  useEffect(() => {
    if (!dragging) return

    const updateFromDelta = (clientX: number, clientY: number) => {
      const ref = dragRef.current
      const container = previewRef.current
      if (!ref || !container || !imgNatural) return
      const rect = container.getBoundingClientRect()
      const cw = rect.width
      const ch = rect.height
      const fitScale = Math.max(cw / imgNatural.w, ch / imgNatural.h)
      const coveredW = imgNatural.w * fitScale * scale
      const coveredH = imgNatural.h * fitScale * scale
      const overflowX = Math.max(0, coveredW - cw)
      const overflowY = Math.max(0, coveredH - ch)
      const dx = clientX - ref.startX
      const dy = clientY - ref.startY
      let nextX = ref.posX
      let nextY = ref.posY
      if (overflowX > 0) nextX = Math.min(100, Math.max(0, ref.posX - (dx / overflowX) * 100))
      if (overflowY > 0) nextY = Math.min(100, Math.max(0, ref.posY - (dy / overflowY) * 100))
      setPosX(nextX)
      setPosY(nextY)
    }

    const onMouseMove = (e: MouseEvent) => updateFromDelta(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateFromDelta(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onEnd = () => { dragRef.current = null; setDragging(false) }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [dragging, scale, imgNatural, setPosX, setPosY])

  const onUploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('이미지 파일만 업로드할 수 있어요'); return }
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `hero/${activeTab}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('site-assets')
        .upload(path, file, { contentType: file.type, upsert: false })
      if (upErr) throw new Error(upErr.message)
      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(path)
      setImageUrl(publicUrl)
      resetTransform()
      setSaved(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드 실패')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const sns = Object.fromEntries(
        Object.entries(snsLinks).filter(([, v]) => v.trim().length > 0).map(([k, v]) => [k, v.trim()])
      )
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: e } = await (supabase as any)
        .from('site_settings')
        .update({
          site_name: siteName.trim() || 'Allceramic',
          contact_email: contactEmail.trim() || null,
          sns_links: sns,
          hero_image_url: dImageUrl,
          hero_object_position: `${dPosX}% ${dPosY}%`,
          hero_scale: dScale,
          hero_mobile_image_url: mImageUrl,
          hero_mobile_object_position: `${mPosX}% ${mPosY}%`,
          hero_mobile_scale: mScale,
          hero_title: heroTitle.trim() || 'Allceramic',
          hero_subtitle: heroSubtitle.trim() || 'A curated space for ceramic arts',
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1)
      if (e) throw new Error(e.message)
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  // 활성 탭의 미리보기 비율
  const aspectClass = isDesktop ? 'aspect-[21/9]' : 'aspect-[9/16]'
  const previewWidthClass = isDesktop ? 'w-full' : 'w-48 mx-auto'

  return (
    <>
      <section className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
        <div className="flex items-end justify-between">
          <p className="text-xs text-stone-400 tracking-wider uppercase">메인 배너</p>
          <p className="text-xs text-stone-300">이미지를 드래그해 위치 조정 · 데스크탑/모바일 따로 설정</p>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 bg-stone-100 rounded-full p-1 w-fit">
          {(['desktop', 'mobile'] as Variant[]).map(v => (
            <button
              key={v}
              onClick={() => setActiveTab(v)}
              className={`text-xs tracking-wider px-4 py-1.5 rounded-full transition-colors ${
                activeTab === v ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {v === 'desktop' ? '데스크탑' : '모바일'}
            </button>
          ))}
        </div>

        {/* 활성 변형 미리보기 (드래그 가능) */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs text-stone-400">
              {isDesktop ? '데스크탑 (가로 화면)' : '모바일 (세로 화면)'}
            </p>
            <p className="text-[11px] text-stone-400">
              X {posX.toFixed(0)}% · Y {posY.toFixed(0)}% · {scale.toFixed(2)}×
            </p>
          </div>
          <div
            ref={previewRef}
            onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY) }}
            onTouchStart={e => { const t = e.touches[0]; if (t) startDrag(t.clientX, t.clientY) }}
            className={`relative ${previewWidthClass} ${aspectClass} rounded-xl overflow-hidden bg-stone-900 border border-stone-200 select-none touch-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt=""
              draggable={false}
              onLoad={onImageLoad}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: positionStr,
                transform: `scale(${scale})`,
                transformOrigin: positionStr,
              }}
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25 pointer-events-none" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
              <p
                className="font-serif text-white tracking-[0.18em] leading-none"
                style={{
                  fontSize: isDesktop ? 'clamp(1.5rem, 5vw, 3rem)' : '1.25rem',
                  textShadow: '0 0 24px rgba(255,253,230,0.5), 0 0 60px rgba(255,253,230,0.3)',
                }}
              >
                {heroTitle || 'Allceramic'}
              </p>
              <p className={`mt-2 text-white/70 tracking-[0.25em] uppercase ${isDesktop ? 'text-[10px]' : 'text-[8px]'}`}>
                {heroSubtitle || 'A curated space for ceramic arts'}
              </p>
            </div>
          </div>
        </div>

        {/* 컨트롤 */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label className="text-xs text-stone-500">확대 ({isDesktop ? '데스크탑' : '모바일'})</label>
              <span className="text-xs text-stone-400 tabular-nums">{scale.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={scale}
              onChange={e => setScale(Number(e.target.value))}
              className="w-full accent-stone-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs tracking-wider text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full px-4 py-1.5 transition-colors disabled:opacity-50"
            >
              {uploading
                ? '업로드중'
                : imageUrl
                  ? `${isDesktop ? '데스크탑' : '모바일'} 이미지 변경`
                  : `${isDesktop ? '데스크탑' : '모바일'} 이미지 업로드`}
            </button>
            {imageUrl && (
              <button
                onClick={() => { setImageUrl(null); resetTransform() }}
                disabled={uploading}
                className="text-xs tracking-wider text-stone-500 hover:text-rose-500 rounded-full px-4 py-1.5 transition-colors disabled:opacity-50"
              >
                기본값으로
              </button>
            )}
            <button
              onClick={resetTransform}
              className="text-xs tracking-wider text-stone-500 hover:text-stone-900 rounded-full px-4 py-1.5 transition-colors"
            >
              위치·확대 초기화
            </button>
            {!isDesktop && !mImageUrl && (
              <span className="text-[11px] text-stone-400">데스크탑 이미지를 fallback으로 사용 중</span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && onUploadImage(e.target.files[0])}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-stone-400">제목 (공통)</label>
          <input
            type="text"
            value={heroTitle}
            onChange={e => setHeroTitle(e.target.value)}
            maxLength={60}
            placeholder="Allceramic"
            className="mt-1 w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400"
          />
        </div>

        <div>
          <label className="text-xs text-stone-400">서브타이틀 (공통)</label>
          <input
            type="text"
            value={heroSubtitle}
            onChange={e => setHeroSubtitle(e.target.value)}
            maxLength={120}
            placeholder="A curated space for ceramic arts"
            className="mt-1 w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400"
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
        <p className="text-xs text-stone-400 tracking-wider uppercase">사이트 정보</p>

        <div>
          <label className="text-xs text-stone-400">사이트 이름</label>
          <input
            type="text"
            value={siteName}
            onChange={e => setSiteName(e.target.value)}
            maxLength={60}
            className="mt-1 w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300"
          />
        </div>

        <div>
          <label className="text-xs text-stone-400">대표 이메일</label>
          <input
            type="email"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
            maxLength={120}
            placeholder="contact@example.com"
            className="mt-1 w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400"
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs text-stone-400">SNS 링크</p>
          {SNS_KEYS.map(k => (
            <div key={k} className="flex items-center gap-3">
              <span className="w-24 text-xs text-stone-500">{SNS_LABEL[k]}</span>
              <input
                type="url"
                value={snsLinks[k] ?? ''}
                onChange={e => setSnsLinks(prev => ({ ...prev, [k]: e.target.value }))}
                placeholder={`https://...`}
                className="flex-1 text-sm bg-stone-50 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {error && <p className="text-xs text-rose-500">{error}</p>}
        {saved && <p className="text-xs text-emerald-600">저장되었습니다</p>}
        <button
          onClick={save}
          disabled={saving || uploading}
          className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? '저장중' : '전체 저장'}
        </button>
      </div>
    </>
  )
}
