'use client'

import { useState } from 'react'
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
  const [siteName, setSiteName] = useState(initial.site_name)
  const [contactEmail, setContactEmail] = useState(initial.contact_email ?? '')
  const [snsLinks, setSnsLinks] = useState<Record<string, string>>(initial.sns_links ?? {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

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

      {error && <p className="text-xs text-rose-500">{error}</p>}
      {saved && <p className="text-xs text-emerald-600">저장되었습니다</p>}

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? '저장중' : '저장'}
        </button>
      </div>
    </section>
  )
}
