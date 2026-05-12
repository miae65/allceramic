'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BookmarkIcon, UserIcon, PlusIcon } from '@/components/ui/icons'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { UploadModal } from '@/components/upload/UploadModal'
import { UploadBlockedAlert } from '@/components/upload/UploadBlockedAlert'
import { AuthModal } from '@/components/auth/AuthModal'
import { InquiryModal } from '@/components/inquiry/InquiryModal'
import { isAdmin } from '@/lib/admin'

export function GNB() {
  const pathname = usePathname()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [blockedAlertOpen, setBlockedAlertOpen] = useState(false)
  const { user } = useAuth()

  const handleProtected = (action: () => void) => {
    if (!user) { setAuthOpen(true); return }
    action()
  }

  const tryOpenUpload = async () => {
    if (!user) { setAuthOpen(true); return }
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('profiles')
        .select('upload_blocked')
        .eq('id', user.id)
        .single()
      if (data?.upload_blocked) {
        setBlockedAlertOpen(true)
        return
      }
    } catch (err) {
      console.error('[upload block check]', err)
    }
    setUploadOpen(true)
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
              onUploadClick={tryOpenUpload}
              onAuthRequired={() => setAuthOpen(true)}
              onInquiryClick={() => handleProtected(() => setInquiryOpen(true))}
            />
          </div>
        </nav>
      </header>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
      {blockedAlertOpen && <UploadBlockedAlert onClose={() => setBlockedAlertOpen(false)} />}
    </>
  )
}

function ProfileDropdown({
  username,
  avatarUrl,
  isAdminUser,
  onSignOut,
  onInquiryClick,
}: {
  username: string
  avatarUrl?: string
  isAdminUser: boolean
  onSignOut: () => void
  onInquiryClick: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="프로필 메뉴"
        className="hover:opacity-80 transition-opacity"
      >
        {avatarUrl ? (
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-stone-200">
            <Image src={avatarUrl} alt={username} width={28} height={28} className="object-cover w-full h-full" />
          </div>
        ) : (
          <UserIcon className="w-5 h-5 text-stone-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden z-50">
          <button
            onClick={() => { setOpen(false); onInquiryClick() }}
            className="w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            문의하기
          </button>
          {isAdminUser && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
            >
              관리자
            </Link>
          )}
          <button
            onClick={() => { setOpen(false); onSignOut() }}
            className="w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors border-t border-stone-100"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}

function AuthButtons({
  onUploadClick,
  onAuthRequired,
  onInquiryClick,
}: {
  onUploadClick: () => void
  onAuthRequired: () => void
  onInquiryClick: () => void
}) {
  const { user, loading } = useAuth()

  if (loading) return <div className="w-16 h-4 bg-stone-100 rounded animate-pulse" />

  if (user) {
    const signOut = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
    }

    const username = user.user_metadata?.preferred_username
      ?? user.user_metadata?.user_name
      ?? user.email?.split('@')[0]
      ?? user.id.slice(0, 8)

    const avatarUrl: string | undefined = user.user_metadata?.avatar_url ?? user.user_metadata?.picture

    return (
      <>
        <ProfileDropdown
          username={username}
          avatarUrl={avatarUrl}
          isAdminUser={isAdmin(user)}
          onSignOut={signOut}
          onInquiryClick={onInquiryClick}
        />
        <button
          onClick={onUploadClick}
          aria-label="게시물 업로드"
          className="text-stone-500 hover:text-stone-900 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        <Link href="/profile/me" className="hover:text-stone-900 transition-colors">
          마이페이지
        </Link>
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
