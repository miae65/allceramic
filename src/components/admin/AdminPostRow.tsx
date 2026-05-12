'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  id: string
  caption: string | null
  createdAt: string
  likeCount: number
  commentCount: number
  shareCount: number
  authorUsername: string
  thumbnailUrl: string | null
  imagePaths: string[]
}

export function AdminPostRow({ id, caption, createdAt, likeCount, commentCount, shareCount, authorUsername, thumbnailUrl, imagePaths }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const onDelete = async () => {
    if (!confirm(`이 게시물을 삭제하시겠어요?\n작성자: ${authorUsername}`)) return
    setDeleting(true)
    try {
      const supabase = createClient()
      if (imagePaths.length > 0) {
        await supabase.storage.from('post-images').remove(imagePaths)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('posts').delete().eq('id', id)
      if (error) throw new Error(error.message)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패')
      setDeleting(false)
    }
  }

  return (
    <tr className="border-b border-stone-50 hover:bg-stone-50/50">
      <td className="px-6 py-3">
        <Link href={`/post/${id}`} className="block w-12 h-12 rounded-md overflow-hidden bg-stone-200 relative">
          {thumbnailUrl && (
            <Image src={thumbnailUrl} alt="" fill sizes="48px" className="object-cover" />
          )}
        </Link>
      </td>
      <td className="px-6 py-3 text-stone-700">
        <Link href={`/profile/${authorUsername}`} className="hover:text-stone-900">{authorUsername}</Link>
      </td>
      <td className="px-6 py-3 text-stone-600 max-w-md truncate">{caption || '-'}</td>
      <td className="px-6 py-3 text-stone-500 tabular-nums">{likeCount}</td>
      <td className="px-6 py-3 text-stone-500 tabular-nums">{commentCount}</td>
      <td className="px-6 py-3 text-stone-500 tabular-nums">{shareCount}</td>
      <td className="px-6 py-3 text-stone-400 tabular-nums text-xs">{new Date(createdAt).toLocaleDateString('ko-KR')}</td>
      <td className="px-6 py-3 text-right">
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-xs text-stone-400 hover:text-rose-500 transition-colors disabled:opacity-50"
        >
          {deleting ? '삭제중' : '삭제'}
        </button>
      </td>
    </tr>
  )
}
