'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
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

export function AdminSettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [siteName, setSiteName] = useState(initial.site_name)
  const [contactEmail, setContactEmail] = useState(initial.contact_email ?? '')
  const [snsLinks, setSnsLinks] = useState<Record<string, string>>(initial.sns_links ?? {})
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(initial.hero_image_url ?? null)
  const [heroTitle, setHeroTitle] = useState(initial.hero_title)
  const [heroSubtitle, setHeroSubtitle] = useState(initial.hero_subtitle)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

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
        <p className="text-xs text-stone-400 tracking-wider uppercase">메인 배너</p>

        <div>
          <label className="text-xs text-stone-400">배경 이미지</label>
          <div className="mt-2 relative w-full aspect-[16/7] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
            {heroImageUrl ? (
              <Image src={heroImageUrl} alt="" fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-stone-400 tracking-widest uppercase">
                기본 이미지 사용중 (/hero.jpg)
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs tracking-wider text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full px-4 py-1.5 transition-colors disabled:opacity-50"
            >
              {uploading ? '업로드중' : heroImageUrl ? '이미지 변경' : '이미지 업로드'}
            </button>
            {heroImageUrl && (
              <button
                onClick={() => setHeroImageUrl(null)}
                disabled={uploading}
                className="text-xs tracking-wider text-stone-500 hover:text-rose-500 rounded-full px-4 py-1.5 transition-colors disabled:opacity-50"
              >
                기본값으로
              </button>
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
