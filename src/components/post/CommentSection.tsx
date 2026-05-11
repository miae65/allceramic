'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CommentItem } from './CommentItem'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import type { Comment, Profile } from '@/types'

type Props = {
  postId: string
  initialComments: Comment[]
}

export function CommentSection({ postId, initialComments }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submittingRef = useRef(false)

  const insertComment = async (content: string, parentId: string | null) => {
    if (!user) throw new Error('로그인이 필요합니다')
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data, error: insertError } = await db
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, parent_id: parentId, content })
      .select('*, profile:profiles!comments_user_id_fkey(*)')
      .single()
    if (insertError) {
      console.error('[comment insert error]', insertError)
      throw new Error(insertError.message ?? '댓글 등록 실패')
    }
    if (!data) throw new Error('댓글 등록 실패: 응답 없음')
    return data as Comment
  }

  const submitComment = async () => {
    if (submittingRef.current) return
    const trimmed = newComment.trim()
    if (!trimmed) return
    if (!user) { setError('로그인이 필요합니다'); return }

    submittingRef.current = true
    setSubmitting(true)
    setError(null)
    try {
      const inserted = await insertComment(trimmed, null)
      setComments(prev => [{ ...inserted, replies: [] }, ...prev])
      setNewComment('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '댓글 등록 중 오류가 발생했습니다')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const handleReply = async (parentId: string, content: string) => {
    if (submittingRef.current) return
    if (!user) { setError('로그인이 필요합니다'); return }
    submittingRef.current = true
    try {
      const inserted = await insertComment(content, parentId)
      setComments(prev =>
        prev.map(c =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies ?? []), inserted] }
            : c
        )
      )
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '답글 등록 중 오류가 발생했습니다')
    } finally {
      submittingRef.current = false
    }
  }

  const handleDelete = async (commentId: string, parentId: string | null) => {
    if (!user) { setError('로그인이 필요합니다'); return }
    if (!confirm('댓글을 삭제하시겠어요?')) return
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { error: deleteError } = await db
        .from('comments')
        .delete()
        .eq('id', commentId)
      if (deleteError) {
        console.error('[comment delete error]', deleteError)
        throw new Error(deleteError.message ?? '댓글 삭제 실패')
      }

      setComments(prev => {
        if (parentId === null) {
          return prev.filter(c => c.id !== commentId)
        }
        return prev.map(c =>
          c.id === parentId
            ? { ...c, replies: (c.replies ?? []).filter(r => r.id !== commentId) }
            : c
        )
      })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다')
    }
  }

  const meProfile: Profile | null = user
    ? {
        id: user.id,
        username: user.user_metadata?.preferred_username ?? user.user_metadata?.user_name ?? user.email?.split('@')[0] ?? user.id.slice(0, 8),
        bio: null,
        avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
        created_at: '',
        updated_at: '',
      }
    : null

  return (
    <div className="pt-5 border-t border-stone-100">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-6">
        Comments {comments.length > 0 && `(${comments.length})`}
      </p>

      {/* 입력창 */}
      <div className="flex gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-stone-200 flex-shrink-0 overflow-hidden">
          {meProfile?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={meProfile.avatar_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => {
              if (e.key !== 'Enter') return
              if (e.nativeEvent.isComposing) return
              e.preventDefault()
              submitComment()
            }}
            placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 남길 수 있어요'}
            disabled={!user || submitting}
            className="flex-1 text-sm bg-stone-100 rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 disabled:opacity-60"
          />
          <button
            onClick={submitComment}
            disabled={!newComment.trim() || !user || submitting}
            className="text-xs text-stone-700 font-medium hover:text-stone-900 disabled:text-stone-300 transition-colors"
          >
            {submitting ? '등록중' : '게시'}
          </button>
        </div>
      </div>
      {error && <p className="ml-11 mb-4 text-xs text-rose-500">{error}</p>}
      {!error && <div className="mb-8" />}

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-8">첫 번째 댓글을 남겨보세요.</p>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id ?? null}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
