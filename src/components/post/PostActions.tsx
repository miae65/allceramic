'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HeartIcon, ShareIcon } from '@/components/ui/icons'
import { useAuth } from '@/components/auth/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'
import { createClient } from '@/lib/supabase/client'

type Props = {
  likeCount: number
  isLiked?: boolean
  postUrl?: string
  postId?: string
}

export function PostActions({ likeCount, isLiked = false, postUrl, postId }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [liked, setLiked] = useState(isLiked)
  const [count, setCount] = useState(likeCount)
  const [authOpen, setAuthOpen] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const pendingRef = useRef(false)

  const toggleLike = async () => {
    if (!user) { setAuthOpen(true); return }
    if (!postId) return
    if (pendingRef.current) return
    pendingRef.current = true

    const wasLiked = liked
    // Optimistic
    setLiked(!wasLiked)
    setCount(c => wasLiked ? c - 1 : c + 1)

    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      if (wasLiked) {
        const { error } = await db
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await db
          .from('likes')
          .insert({ post_id: postId, user_id: user.id })
        if (error) throw new Error(error.message)
      }
      router.refresh()
    } catch (err) {
      console.error('[toggle like]', err)
      // 롤백
      setLiked(wasLiked)
      setCount(c => wasLiked ? c + 1 : c - 1)
    } finally {
      pendingRef.current = false
    }
  }

  const copyLink = async () => {
    const url = postUrl ?? window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    if (postId) {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(supabase as any).rpc('increment_share_count', { post: postId }).then(({ error }: { error: unknown }) => {
        if (error) console.error('[share count]', error)
      })
    }
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

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  )
}
