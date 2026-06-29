'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function EditCaptionForm({ postId, initialCaption }: { postId: string; initialCaption: string | null }) {
  const router = useRouter()
  const [caption, setCaption] = useState(initialCaption ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from('posts')
        .update({ caption: caption.trim() || null, updated_at: new Date().toISOString() })
        .eq('id', postId)
      if (err) throw new Error(err.message)
      router.push(`/post/${postId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-xs tracking-wider text-stone-400 uppercase mb-2">캡션</label>
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          rows={6}
          placeholder="캡션을 입력하세요"
          className="w-full text-sm text-stone-800 placeholder-stone-300 border border-stone-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-stone-400 transition-colors"
        />
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="text-xs tracking-[0.15em] uppercase text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? '저장중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs tracking-[0.15em] uppercase text-stone-500 border border-stone-200 rounded-full px-6 py-2 hover:border-stone-400 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}
