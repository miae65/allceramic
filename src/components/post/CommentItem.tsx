'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Comment } from '@/types'

type Props = {
  comment: Comment
  onReply?: (parentId: string, content: string) => void
  isReply?: boolean
}

export function CommentItem({ comment, onReply, isReply = false }: Props) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  const submitReply = () => {
    const trimmed = replyText.trim()
    if (!trimmed) return
    onReply?.(comment.id, trimmed)
    setReplyText('')
    setReplyOpen(false)
  }

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return '방금 전'
    if (m < 60) return `${m}분 전`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}시간 전`
    return `${Math.floor(h / 24)}일 전`
  }

  return (
    <div className={isReply ? 'pl-10' : ''}>
      <div className="flex gap-3">
        {/* 아바타 */}
        <Link href={`/profile/${comment.profile?.username}`} className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
            {comment.profile?.avatar_url && (
              <Image
                src={comment.profile.avatar_url}
                alt={comment.profile.username}
                width={32}
                height={32}
                className="object-cover"
              />
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          {/* 닉네임 + 시간 */}
          <div className="flex items-baseline gap-2 mb-1">
            <Link
              href={`/profile/${comment.profile?.username}`}
              className="text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors"
            >
              {comment.profile?.username ?? 'unknown'}
            </Link>
            <span className="text-xs text-stone-400">{timeAgo(comment.created_at)}</span>
          </div>

          {/* 내용 */}
          <p className="text-sm text-stone-700 leading-relaxed">{comment.content}</p>

          {/* 답글 달기 버튼 (최상위 댓글에만) */}
          {!isReply && (
            <button
              onClick={() => setReplyOpen(v => !v)}
              className="mt-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              {replyOpen ? '취소' : '답글 달기'}
            </button>
          )}

          {/* 인라인 답글 입력 */}
          {replyOpen && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitReply()}
                placeholder="답글을 입력하세요..."
                className="flex-1 text-sm bg-stone-100 rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400"
                autoFocus
              />
              <button
                onClick={submitReply}
                disabled={!replyText.trim()}
                className="text-xs text-stone-700 font-medium hover:text-stone-900 disabled:text-stone-300 transition-colors"
              >
                게시
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )
}
