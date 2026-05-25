'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Props = {
  userId: string
  postId?: string
  initialTitle?: string
  initialContent?: string
}

export function BoardPostForm({ userId, postId, initialTitle = '', initialContent = '' }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    const t = title.trim()
    const c = content.trim()
    if (!t || !c) { setError('제목과 내용을 모두 입력해주세요'); return }
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      if (postId) {
        const { error: e } = await db
          .from('board_posts')
          .update({ title: t, content: c, updated_at: new Date().toISOString() })
          .eq('id', postId)
        if (e) throw new Error(e.message)
        router.push(`/board/${postId}`)
        router.refresh()
      } else {
        const { data, error: e } = await db
          .from('board_posts')
          .insert({ user_id: userId, title: t, content: c })
          .select('id')
          .single()
        if (e) throw new Error(e.message)
        router.push(`/board/${data.id}`)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={saving}
        maxLength={200}
        placeholder="제목"
        className="w-full text-base bg-stone-50 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 disabled:opacity-60"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={saving}
        maxLength={10000}
        rows={15}
        placeholder="내용을 입력해주세요"
        className="w-full text-sm bg-stone-50 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 leading-relaxed disabled:opacity-60 resize-none"
      />
      <p className="text-xs text-stone-300 tabular-nums text-right">{content.length} / 10000</p>

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Link
          href={postId ? `/board/${postId}` : '/board'}
          className="text-xs tracking-wider text-stone-500 hover:text-stone-900 rounded-full px-4 py-2 transition-colors"
        >
          취소
        </Link>
        <button
          onClick={submit}
          disabled={saving}
          className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? '저장중' : postId ? '수정' : '게시'}
        </button>
      </div>
    </div>
  )
}
