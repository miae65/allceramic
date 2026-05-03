'use client'

import { useState } from 'react'
import { HeartIcon, ShareIcon } from '@/components/ui/icons'

type Props = {
  likeCount: number
  isLiked?: boolean
  postUrl?: string
}

export function PostActions({ likeCount, isLiked = false, postUrl }: Props) {
  const [liked, setLiked] = useState(isLiked)
  const [count, setCount] = useState(likeCount)
  const [copied, setCopied] = useState(false)

  const toggleLike = () => {
    setLiked(prev => {
      setCount(c => prev ? c - 1 : c + 1)
      return !prev
    })
    // TODO: supabase.from('likes').insert / delete
  }

  const share = async () => {
    const url = postUrl ?? window.location.href
    if (navigator.share) {
      await navigator.share({ url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-5 py-5 border-t border-stone-100">
      {/* 좋아요 */}
      <button
        onClick={toggleLike}
        aria-label={liked ? '좋아요 취소' : '좋아요'}
        className="flex items-center gap-1.5 group"
      >
        <HeartIcon
          className={`w-5 h-5 transition-colors ${
            liked ? 'text-rose-500' : 'text-stone-400 group-hover:text-stone-700'
          }`}
          filled={liked}
        />
        <span className={`text-sm tabular-nums ${liked ? 'text-rose-500' : 'text-stone-500'}`}>
          {count.toLocaleString()}
        </span>
      </button>

      {/* 공유 */}
      <button
        onClick={share}
        aria-label="공유"
        className="flex items-center gap-1.5 group"
      >
        <ShareIcon className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        {copied && (
          <span className="text-xs text-stone-400">링크 복사됨</span>
        )}
      </button>
    </div>
  )
}
