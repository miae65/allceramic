'use client'

import { useRef, useState } from 'react'
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

function parsePosition(s: string): { x: number; y: number } {
  const m = s.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
  if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) }
  return { x: 50, y: 50 }
}

export function AdminSettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [siteName, setSiteName] = useState(initial.site_name)
  const [contactEmail, setContactEmail] = useState(initial.contact_email ?? '')
  const [snsLinks, setSnsLinks] = useState<Record<string, string>>(initial.sns_links ?? {})
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(initial.hero_image_url ?? null)
  const [heroTitle, setHeroTitle] = useState(initial.hero_title)
  const [heroSubtitle, setHeroSubtitle] = useState(initial.hero_subtitle)
  const initialPos = parsePosition(initial.hero_object_position)
  const [posX, setPosX] = useState(initialPos.x)
  const [posY, setPosY] = useState(initialPos.y)
  const [scale, setScale] = useState(Number(initial.hero_scale) || 1)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const previewImage = heroImageUrl || DEFAULT_IMAGE
  const positionStr = `${posX}% ${posY}%`

  const resetTransform = () => {
    setPosX(50)
    setPosY(50)
    setScale(1)
  }

  const onUploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('이미지 파일만 업로드할 수 있어요'); return }
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `hero/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('site-assets')
        .upload(path, file, { contentType: file.type, upsert: false })
      if (upErr) throw new Error(upErr.message)
      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(path)
      setHeroImageUrl(publicUrl)
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
          hero_image_url: heroImageUrl,
          hero_title: heroTitle.trim() || 'Allceramic',
          hero_subtitle: heroSubtitle.trim() || 'A curated space for ceramic arts',
          hero_object_position: positionStr,
          hero_scale: scale,
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

  return (
    <>
      <section className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
        <div className="flex items-end justify-between">
          <p className="text-xs text-stone-400 tracking-wider uppercase">메인 배너</p>
          <p className="text-xs text-stone-300">실제 노출 영역과 동일한 비율로 미리보기</p>
        </div>

        {/* 데스크탑 미리보기 — 좌측 세로 위치 + 하단 가로 위치 슬라이더 */}
        <div>
          <p className="text-xs text-stone-400 mb-2">데스크탑 (가로 화면)</p>
          <div className="grid grid-cols-[40px_1fr] gap-2">
            {/* 좌측 세로 슬라이더 */}
            <div className="flex flex-col items-center justify-between py-1">
              <span className="text-[10px] text-stone-400 tabular-nums">{posY.toFixed(0)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={posY}
                onChange={e => setPosY(Number(e.target.value))}
                aria-label="세로 위치"
                aria-orientation="vertical"
                className="accent-stone-900 flex-1 my-1"
                style={{
                  writingMode: 'vertical-lr',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  WebkitAppearance: 'slider-vertical' as any,
                  width: 24,
                } as React.CSSProperties}
              />
              <span className="text-[10px] text-stone-500">세로</span>
            </div>
            {/* 우측: 이미지 + 하단 가로 슬라이더 */}
            <div className="space-y-2">
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform"
                  style={{
                    objectPosition: positionStr,
                    transform: `scale(${scale})`,
                    transformOrigin: positionStr,
                  }}
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                  <p
                    className="font-serif text-white tracking-[0.18em] leading-none"
                    style={{
                      fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                      textShadow: '0 0 24px rgba(255,253,230,0.5), 0 0 60px rgba(255,253,230,0.3)',
                    }}
                  >
                    {heroTitle || 'Allceramic'}
                  </p>
                  <p className="mt-3 text-white/70 tracking-[0.25em] text-[10px] uppercase">
                    {heroSubtitle || 'A curated space for ceramic arts'}
                  </p>
                </div>
              </div>
              {/* 하단 가로 슬라이더 */}
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] text-stone-500 w-8">가로</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={posX}
                  onChange={e => setPosX(Number(e.target.value))}
                  aria-label="가로 위치"
                  className="flex-1 accent-stone-900"
                />
                <span className="text-[10px] text-stone-400 tabular-nums w-10 text-right">{posX.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일 미리보기 */}
        <div>
          <p className="text-xs text-stone-400 mb-2">모바일 (세로 화면)</p>
          <div className="relative w-40 aspect-[9/16] rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform"
              style={{
                objectPosition: positionStr,
                transform: `scale(${scale})`,
                transformOrigin: positionStr,
              }}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-2 pointer-events-none">
              <p className="font-serif text-white tracking-[0.18em] text-sm leading-none" style={{ textShadow: '0 0 12px rgba(255,253,230,0.5)' }}>
                {heroTitle || 'Allceramic'}
              </p>
              <p className="mt-2 text-white/70 tracking-[0.2em] text-[7px] uppercase">
                {heroSubtitle || ''}
              </p>
            </div>
          </div>
        </div>

        {/* 컨트롤 */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label className="text-xs text-stone-500">확대</label>
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs tracking-wider text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full px-4 py-1.5 transition-colors disabled:opacity-50"
            >
              {uploading ? '업로드중' : heroImageUrl ? '이미지 변경' : '이미지 업로드'}
            </button>
            {heroImageUrl && (
              <button
                onClick={() => { setHeroImageUrl(null); resetTransform() }}
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
          <label className="text-xs text-stone-400">제목</label>
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
          <label className="text-xs text-stone-400">서브타이틀</label>
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
