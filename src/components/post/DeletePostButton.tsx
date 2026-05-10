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
}

export function DeletePostButton({ postId, ownerId, imagePaths, redirectTo }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const db = supabase as any
      const { error: deleteError } = await db.from('posts').delete().eq('id', postId)
      if (deleteError) throw new Error(deleteError.message)

      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다')
      setDeleting(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 py-3">
        <span className="text-xs text-stone-500">정말 삭제하시겠어요?</span>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-xs tracking-wide text-white bg-rose-500 hover:bg-rose-600 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
        >
          {deleting ? '삭제중...' : '삭제'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="text-xs tracking-wide text-stone-500 hover:text-stone-900 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
        >
          취소
        </button>
        {error && <span className="text-xs text-rose-500">{error}</span>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-500 transition-colors py-3"
    >
      <TrashIcon className="w-4 h-4" />
      <span>삭제</span>
    </button>
  )
}
