'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { BoardComment } from '@/types'

type Props = {
  postId: string
  initialComments: BoardComment[]
  currentUserId: string | null
  isAdminUser: boolean
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '방금 전'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  return `${Math.floor(h / 24)}일 전`
}

export function BoardCommentSection({ postId, initialComments, currentUserId, isAdminUser }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [comments, setComments] = useState<BoardComment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submittingRef = useRef(false)

  const submit = async () => {
    if (submittingRef.current) return
    const trimmed = newComment.trim()
    if (!trimmed) return
    if (!user) { setError('로그인이 필요합니다'); return }

    submittingRef.current = true
    setSubmitting(true)
    setError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: e } = await (supabase as any)
        .from('board_comments')
        .insert({ post_id: postId, user_id: user.id, content: trimmed })
        .select('*, profile:profiles!board_comments_user_id_fkey(id, username, avatar_url)')
        .single()
      if (e) throw new Error(e.message)
      setComments(prev => [...prev, data as BoardComment])
      setNewComment('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '댓글 등록 실패')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const onDelete = async (commentId: string) => {
    if (!confirm('이 댓글을 삭제하시겠어요?')) return
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: e } = await (supabase as any).from('board_comments').delete().eq('id', commentId)
      if (e) throw new Error(e.message)
      setComments(prev => prev.filter(c => c.id !== commentId))
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패')
    }
  }

  return (
    <div className="pt-6 border-t border-stone-100">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-5">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </p>

      {/* 입력 */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => {
            if (e.key !== 'Enter') return
            if (e.nativeEvent.isComposing) return
            e.preventDefault()
            submit()
          }}
          placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 남길 수 있어요'}
          disabled={!user || submitting}
          className="flex-1 text-sm bg-stone-100 rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 disabled:opacity-60"
        />
        <button
          onClick={submit}
          disabled={submitting}
          aria-disabled={!newComment.trim() || !user || submitting}
          className="text-xs text-stone-400 hover:text-stone-900 disabled:opacity-50 transition-colors"
        >
          {submitting ? '등록중' : '게시'}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500 mb-3">{error}</p>}

      {/* 목록 */}
      {comments.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-6">첫 번째 댓글을 남겨보세요.</p>
      ) : (
        <ul className="space-y-5">
          {comments.map(c => {
            const isOwn = currentUserId === c.user_id
            const canDelete = isOwn || isAdminUser
            return (
              <li key={c.id} className="flex gap-3">
                <Link href={`/profile/${c.profile?.username}`} className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
                    {c.profile?.avatar_url && (
                      <Image src={c.profile.avatar_url} alt={c.profile.username} width={32} height={32} className="object-cover" />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <Link href={`/profile/${c.profile?.username}`} className="text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors">
                      {c.profile?.username ?? '-'}
                    </Link>
                    <span className="text-xs text-stone-400">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                  {canDelete && (
                    <button
                      onClick={() => onDelete(c.id)}
                      className="mt-1.5 text-xs text-stone-400 hover:text-rose-500 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
