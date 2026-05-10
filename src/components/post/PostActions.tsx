'use client'

import { useState, useRef, useEffect } from 'react'
import { HeartIcon, ShareIcon } from '@/components/ui/icons'

type Props = {
  likeCount: number
  isLiked?: boolean
  postUrl?: string
}

export function PostActions({ likeCount, isLiked = false, postUrl }: Props) {
  const [liked, setLiked] = useState(isLiked)
  const [count, setCount] = useState(likeCount)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  const toggleLike = () => {
    setLiked(prev => {
      setCount(c => prev ? c - 1 : c + 1)
      return !prev
    })
    // TODO: supabase.from('likes').insert / delete
  }

  const copyLink = async () => {
    const url = postUrl ?? window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setShowShare(false)
    }, 1500)
  }

  useEffect(() => {
    if (!showShare) return
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowShare(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showShare])

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
      <div className="relative" ref={popupRef}>
        <button
          onClick={() => setShowShare(prev => !prev)}
          aria-label="공유"
          className="flex items-center gap-1.5 group"
        >
          <ShareIcon className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        </button>

        {showShare && (
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-stone-200 rounded-lg shadow-lg p-3 w-56 z-10">
            <p className="text-xs text-stone-400 mb-2 tracking-wide">링크 공유</p>
            <div className="flex items-center gap-2 bg-stone-50 rounded px-3 py-2 mb-2">
              <span className="text-xs text-stone-400 truncate flex-1">
                {typeof window !== 'undefined' ? (postUrl ?? window.location.href) : ''}
              </span>
            </div>
            <button
              onClick={copyLink}
              className={`w-full text-xs py-2 rounded transition-colors ${
                copied
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {copied ? '복사됨 ✓' : '링크 복사'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
