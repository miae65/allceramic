'use client'

import { useState } from 'react'
import { CommentItem } from './CommentItem'
import type { Comment } from '@/types'

type Props = {
  postId: string
  initialComments: Comment[]
}

export function CommentSection({ postId: _postId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')

  const submitComment = () => {
    const trimmed = newComment.trim()
    if (!trimmed) return

    const optimistic: Comment = {
      id: `temp-${Date.now()}`,
      post_id: _postId,
      user_id: '',
      parent_id: null,
      content: trimmed,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: {
        id: '',
        username: 'me',
        bio: null,
        avatar_url: null,
        created_at: '',
        updated_at: '',
      },
      replies: [],
    }

    setComments(prev => [optimistic, ...prev])
    setNewComment('')
    // TODO: supabase.from('comments').insert(...)
  }

  const handleReply = (parentId: string, content: string) => {
    const optimisticReply: Comment = {
      id: `temp-${Date.now()}`,
      post_id: _postId,
      user_id: '',
      parent_id: parentId,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: {
        id: '',
        username: 'me',
        bio: null,
        avatar_url: null,
        created_at: '',
        updated_at: '',
      },
      replies: [],
    }

    setComments(prev =>
      prev.map(c =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies ?? []), optimisticReply] }
          : c
      )
    )
    // TODO: supabase.from('comments').insert(...)
  }

  return (
    <div className="pt-5 border-t border-stone-100">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-6">
        Comments {comments.length > 0 && `(${comments.length})`}
      </p>

      {/* 입력창 */}
      <div className="flex gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-stone-200 flex-shrink-0" />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitComment()}
            placeholder="댓글을 입력하세요..."
            className="flex-1 text-sm bg-stone-100 rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400"
          />
          <button
            onClick={submitComment}
            disabled={!newComment.trim()}
            className="text-xs text-stone-700 font-medium hover:text-stone-900 disabled:text-stone-300 transition-colors"
          >
            게시
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-8">첫 번째 댓글을 남겨보세요.</p>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
          ))}
        </div>
      )}
    </div>
  )
}
