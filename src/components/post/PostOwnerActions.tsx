'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TrashIcon } from '@/components/ui/icons'

type Props = {
  postId: string
  ownerId: string
  imagePaths: string[]
  redirectTo: string
  initialCaption: string | null
}

export function PostOwnerActions({ postId, ownerId, imagePaths, redirectTo, initialCaption }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [caption, setCaption] = useState(initialCaption ?? '')
  const [saving, setSaving] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSave = async () => {
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
      setEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    setDeleting(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== ownerId) throw new Error('권한이 없습니다')
      if (imagePaths.length > 0) {
        await supabase.storage.from('post-images').remove(imagePaths)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any).from('posts').delete().eq('id', postId)
      if (err) throw new Error(err.message)
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 실패')
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <>
      {/* 캡션 */}
      {editing ? (
        <div className="mb-3 space-y-2">
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            rows={5}
            autoFocus
            className="w-full text-[1.05rem] font-serif text-stone-700 leading-relaxed border border-stone-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-stone-400 transition-colors"
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={onSave}
              disabled={saving}
              className="text-xs tracking-[0.12em] uppercase text-white bg-stone-900 rounded-full px-4 py-1.5 hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {saving ? '저장중...' : '저장'}
            </button>
            <button
              onClick={() => { setEditing(false); setCaption(initialCaption ?? ''); setError(null) }}
              className="text-xs tracking-[0.12em] uppercase text-stone-500 border border-stone-200 rounded-full px-4 py-1.5 hover:border-stone-400 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        initialCaption && (
          <p className="font-serif text-stone-700 text-[1.05rem] leading-relaxed mb-3">
            {caption}
          </p>
        )
      )}

      {/* 수정/삭제 버튼 */}
      {!editing && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors py-3 pr-3"
          >
            수정
          </button>
          {confirming ? (
            <div className="flex items-center gap-2 py-3">
              <span className="text-xs text-stone-500">정말 삭제하시겠어요?</span>
              <button
                onClick={onDelete}
                disabled={deleting}
                className="text-xs text-white bg-rose-500 hover:bg-rose-600 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {deleting ? '삭제중...' : '삭제'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
              >
                취소
              </button>
              {error && <span className="text-xs text-rose-500">{error}</span>}
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-500 transition-colors py-3"
            >
              <TrashIcon className="w-4 h-4" />
              <span>삭제</span>
            </button>
          )}
        </div>
      )}
    </>
  )
}
