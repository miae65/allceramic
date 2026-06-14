'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  postId: string
  canEdit: boolean
  canDelete: boolean
}

export function InfoPostActions({ postId, canEdit, canDelete }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const onDelete = async () => {
    if (!confirm('이 게시글을 삭제하시겠어요?')) return
    setDeleting(true)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('info_posts').delete().eq('id', postId)
      if (error) throw new Error(error.message)
      router.push('/info')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패')
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {canEdit && (
        <Link
          href={`/info/${postId}/edit`}
          className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          수정
        </Link>
      )}
      {canDelete && (
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-xs text-stone-400 hover:text-rose-500 transition-colors disabled:opacity-50"
        >
          {deleting ? '삭제중' : '삭제'}
        </button>
      )}
    </div>
  )
}
