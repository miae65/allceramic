'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Notice } from '@/types'

type Props = {
  initialNotices: Notice[]
  authorId: string
}

export function AdminNoticeManager({ initialNotices, authorId }: Props) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [draftPublished, setDraftPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetDraft = () => {
    setDraftTitle('')
    setDraftContent('')
    setDraftPublished(true)
    setError(null)
  }

  const startCreate = () => {
    resetDraft()
    setCreating(true)
    setEditing(null)
  }

  const startEdit = (n: Notice) => {
    setEditing(n.id)
    setCreating(false)
    setDraftTitle(n.title)
    setDraftContent(n.content)
    setDraftPublished(n.is_published)
    setError(null)
  }

  const cancel = () => {
    setCreating(false)
    setEditing(null)
    resetDraft()
  }

  const save = async () => {
    if (!draftTitle.trim() || !draftContent.trim()) {
      setError('제목과 내용을 모두 입력해주세요')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      if (editing) {
        const { error: e } = await db
          .from('notices')
          .update({
            title: draftTitle.trim(),
            content: draftContent.trim(),
            is_published: draftPublished,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editing)
        if (e) throw new Error(e.message)
      } else {
        const { error: e } = await db
          .from('notices')
          .insert({
            author_id: authorId,
            title: draftTitle.trim(),
            content: draftContent.trim(),
            is_published: draftPublished,
          })
        if (e) throw new Error(e.message)
      }
      cancel()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('이 공지를 삭제하시겠어요?')) return
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: e } = await (supabase as any).from('notices').delete().eq('id', id)
      if (e) throw new Error(e.message)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!creating && !editing && (
          <button
            onClick={startCreate}
            className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-5 py-2 hover:bg-stone-700 transition-colors"
          >
            공지 작성
          </button>
        )}
      </div>

      {(creating || editing) && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
          <p className="text-xs text-stone-400 tracking-wider uppercase">{editing ? '공지 수정' : '새 공지 작성'}</p>
          <input
            type="text"
            value={draftTitle}
            onChange={e => setDraftTitle(e.target.value)}
            placeholder="제목"
            maxLength={200}
            className="w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400"
          />
          <textarea
            value={draftContent}
            onChange={e => setDraftContent(e.target.value)}
            placeholder="내용"
            rows={6}
            className="w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 resize-none"
          />
          <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer">
            <input
              type="checkbox"
              checked={draftPublished}
              onChange={e => setDraftPublished(e.target.checked)}
              className="rounded"
            />
            <span>발행 (사용자에게 노출)</span>
          </label>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={cancel}
              disabled={saving}
              className="text-xs tracking-wider text-stone-500 hover:text-stone-900 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {saving ? '저장중' : '저장'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        {initialNotices.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-20">공지가 없습니다</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {initialNotices.map(n => (
              <li key={n.id} className="p-5 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {n.is_published ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">발행됨</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">비공개</span>
                    )}
                    <p className="text-sm font-medium text-stone-900 truncate">{n.title}</p>
                  </div>
                  <p className="text-xs text-stone-400 mb-2">{new Date(n.created_at).toLocaleString('ko-KR')}</p>
                  <p className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed line-clamp-3">{n.content}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(n)}
                    className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => remove(n.id)}
                    className="text-xs text-stone-400 hover:text-rose-500 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
