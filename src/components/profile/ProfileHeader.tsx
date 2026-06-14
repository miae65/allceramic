'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BookmarkIcon } from '@/components/ui/icons'
import { useAuth } from '@/components/auth/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

type Props = {
  profile: Profile
  postCount: number
  isOwn?: boolean
  isFavorited?: boolean
}

export function ProfileHeader({ profile, postCount, isOwn = false, isFavorited = false }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(isFavorited)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pendingRef = useRef(false)

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (pendingRef.current) return
    pendingRef.current = true

    const wasFavorited = favorited
    setFavorited(!wasFavorited)

    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      if (wasFavorited) {
        const { error } = await db
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('favorite_id', profile.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await db
          .from('user_favorites')
          .insert({ user_id: user.id, favorite_id: profile.id })
        if (error) throw new Error(error.message)
      }
      router.refresh()
    } catch (err) {
      console.error('[toggle favorite]', err)
      setFavorited(wasFavorited)
    } finally {
      pendingRef.current = false
    }
  }

  return (
    <>
      <section className="flex flex-col items-center text-center pt-14 pb-10">
        <div className="w-24 h-24 rounded-full bg-stone-200 overflow-hidden mb-5 ring-2 ring-stone-100">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.username}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300" />
          )}
        </div>

        <h1 className="font-sans text-2xl text-stone-900 tracking-wide mb-2">
          {profile.username}
        </h1>

        {profile.bio && (
          <p className="text-sm text-stone-500 leading-relaxed max-w-xs mb-4">
            {profile.bio}
          </p>
        )}

        <p className="text-xs text-stone-400 tabular-nums mb-6">
          {postCount} {postCount === 1 ? 'post' : 'posts'}
        </p>

        {!isOwn && (
          <button
            onClick={handleSave}
            aria-label={favorited ? '즐겨찾기 해제' : '즐겨찾기'}
            className={`inline-flex items-center justify-center rounded-full w-10 h-10 border transition-colors ${
              favorited
                ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-700 hover:border-stone-700'
                : 'text-stone-700 border-stone-300 hover:border-stone-700'
            }`}
          >
            <BookmarkIcon className="w-4 h-4" />
          </button>
        )}
      </section>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
