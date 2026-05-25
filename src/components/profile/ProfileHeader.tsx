'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookmarkIcon } from '@/components/ui/icons'
import { useAuth } from '@/components/auth/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'
import type { Profile } from '@/types'

type Props = {
  profile: Profile
  postCount: number
  isOwn?: boolean
  isFavorited?: boolean
}

export function ProfileHeader({ profile, postCount, isOwn = false, isFavorited = false }: Props) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(isFavorited)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSave = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setFavorited(prev => !prev)
    // TODO: supabase.from('user_favorites').insert / delete
  }

  return (
    <>
      <section className="flex flex-col items-center text-center pt-14 pb-10">
        {/* 원형 아바타 */}
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

        {/* 닉네임 */}
        <h1 className="font-sans text-2xl text-stone-900 tracking-wide mb-2">
          {profile.username}
        </h1>

        {/* 소개글 */}
        {profile.bio && (
          <p className="text-sm text-stone-500 leading-relaxed max-w-xs mb-4">
            {profile.bio}
          </p>
        )}

        {/* 게시물 수 */}
        <p className="text-xs text-stone-400 tabular-nums mb-6">
          {postCount} {postCount === 1 ? 'post' : 'posts'}
        </p>

        {/* 액션 버튼 — 본인 프로필은 GNB 드롭다운의 설정으로 진입 */}
        {!isOwn && (
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase rounded-full px-5 py-2 border transition-colors ${
              favorited
                ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-700 hover:border-stone-700'
                : 'text-stone-700 border-stone-300 hover:border-stone-700'
            }`}
          >
            <BookmarkIcon className="w-3.5 h-3.5" />
            {favorited ? 'Saved' : 'Save'}
          </button>
        )}
      </section>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
