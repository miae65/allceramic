'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BookmarkIcon, UserIcon, PlusIcon } from '@/components/ui/icons'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { UploadModal } from '@/components/upload/UploadModal'
import { AuthModal } from '@/components/auth/AuthModal'

export function GNB() {
  const pathname = usePathname()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user } = useAuth()

  const handleProtected = (action: () => void) => {
    if (!user) { setAuthOpen(true); return }
    action()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/90 backdrop-blur-sm border-b border-stone-100">
        <nav className="max-w-5xl mx-auto h-full px-6 flex items-center justify-between">
          {/* 좌측 */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-serif text-xl tracking-widest text-stone-900 hover:text-stone-600 transition-colors"
            >
              Allceramic
            </Link>
            <Link
              href="/favorites"
              aria-label="즐겨찾기"
              className={`text-stone-500 hover:text-stone-900 transition-colors ${
                pathname === '/favorites' ? 'text-stone-900' : ''
              }`}
            >
              <BookmarkIcon className="w-5 h-5" />
            </Link>
            <Link
              href="/board"
              className={`text-sm transition-colors ${
                pathname.startsWith('/board')
                  ? 'text-stone-900 font-medium'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              자유게시판
            </Link>
          </div>

          {/* 우측 */}
          <div className="flex items-center gap-5 text-sm text-stone-600">
            <AuthButtons
              onUploadClick={() => handleProtected(() => setUploadOpen(true))}
              onAuthRequired={() => setAuthOpen(true)}
            />
          </div>
        </nav>
      </header>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}

function AuthButtons({
  onUploadClick,
  onAuthRequired,
}: {
  onUploadClick: () => void
  onAuthRequired: () => void
}) {
  const { user, loading } = useAuth()

  if (loading) return <div className="w-16 h-4 bg-stone-100 rounded animate-pulse" />

  if (user) {
    const signOut = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
    }

    const username = user.user_metadata?.preferred_username
      ?? user.user_metadata?.full_name?.replace(/\s+/g, '_').toLowerCase()
      ?? user.id.slice(0, 8)

    const avatarUrl: string | undefined = user.user_metadata?.avatar_url ?? user.user_metadata?.picture

    return (
      <>
        <Link
          href={`/profile/${username}`}
          aria-label="마이페이지"
          className="hover:opacity-80 transition-opacity"
        >
          {avatarUrl ? (
            <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-stone-200">
              <Image src={avatarUrl} alt={username} width={28} height={28} className="object-cover w-full h-full" />
            </div>
          ) : (
            <UserIcon className="w-5 h-5 text-stone-500" />
          )}
        </Link>
        <button
          onClick={onUploadClick}
          aria-label="게시물 업로드"
          className="text-stone-500 hover:text-stone-900 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        <button onClick={signOut} className="hover:text-stone-900 transition-colors">
          로그아웃
        </button>
      </>
    )
  }

  return (
    <>
      <button
        onClick={onAuthRequired}
        aria-label="마이페이지"
        className="text-stone-500 hover:text-stone-900 transition-colors"
      >
        <UserIcon className="w-5 h-5" />
      </button>
      <button
        onClick={onUploadClick}
        aria-label="게시물 업로드"
        className="text-stone-500 hover:text-stone-900 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
      <button onClick={onAuthRequired} className="hover:text-stone-900 transition-colors">
        로그인
      </button>
    </>
  )
}
