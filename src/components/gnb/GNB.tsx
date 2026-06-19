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
import { ProfileSettingsModal } from '@/components/profile/ProfileSettingsModal'
import { isAdmin } from '@/lib/admin'

export function GNB() {
  const pathname = usePathname()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [blockedAlertOpen, setBlockedAlertOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  const navItems = [
    { href: '/jobs', label: '구인·구직', isActive: pathname.startsWith('/jobs') },
    { href: '/info', label: '중고거래', isActive: pathname.startsWith('/info') },
    { href: '/exhibition', label: '전시정보', isActive: pathname.startsWith('/exhibition') },
    { href: '/board', label: '자유게시판', isActive: pathname.startsWith('/board') },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/90 backdrop-blur-sm border-b border-stone-100">
        <nav className="w-full h-full pr-[16px] flex items-center justify-between">
          {/* 좌측 */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="ml-[20px] md:ml-[50px] font-serif text-2xl font-medium tracking-widest text-stone-700 hover:text-stone-500 transition-colors"
            >
              Allceramic
            </Link>
            {/* 데스크탑 메뉴 */}
            <div className="ml-[15px] hidden md:flex items-center gap-[19px]">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    item.isActive ? 'text-stone-900 font-medium' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 우측 */}
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <Link
              href="/favorites"
              aria-label="즐겨찾기"
              className={`text-stone-500 hover:text-stone-900 transition-colors ${
                pathname === '/favorites' ? 'text-stone-900' : ''
              }`}
            >
              <BookmarkIcon className="w-5 h-5" />
            </Link>
            <AuthButtons
              onUploadClick={tryOpenUpload}
              onAuthRequired={() => setAuthOpen(true)}
              onInquiryClick={() => handleProtected(() => setInquiryOpen(true))}
              onSettingsClick={() => handleProtected(() => setSettingsOpen(true))}
            />
            {/* 모바일 햄버거 */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden text-stone-500 hover:text-stone-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* 모바일 메뉴 패널 */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-stone-100 shadow-sm">
            <div className="flex flex-col py-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-6 py-3 text-sm transition-colors ${
                    item.isActive
                      ? 'text-stone-900 font-medium bg-stone-50'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
      {settingsOpen && user && (
        <ProfileSettingsModal userId={user.id} onClose={() => setSettingsOpen(false)} />
      )}
      {blockedAlertOpen && <UploadBlockedAlert onClose={() => setBlockedAlertOpen(false)} />}
    </>
  )
}

function ProfileDropdown({
  username,
  avatarUrl,
  isAdminUser,
  unreadCount,
  onSignOut,
  onInquiryClick,
  onSettingsClick,
}: {
  username: string
  avatarUrl?: string
  isAdminUser: boolean
  unreadCount: number
  onSignOut: () => void
  onInquiryClick: () => void
  onSettingsClick: () => void
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
        className="relative hover:opacity-80 transition-opacity"
      >
        {avatarUrl ? (
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-stone-200">
            <Image src={avatarUrl} alt={username} width={28} height={28} className="object-cover w-full h-full" />
          </div>
        ) : (
          <UserIcon className="w-5 h-5 text-stone-500" />
        )}
        {unreadCount > 0 && (
          <span
            aria-label={`알림 ${unreadCount}건`}
            className="absolute -bottom-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-medium leading-none flex items-center justify-center tabular-nums ring-2 ring-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden z-50">
          <Link
            href="/profile/me"
            onClick={() => setOpen(false)}
            className="block w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            마이페이지
          </Link>
          <Link
            href="/inquiries/me"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <span>내 문의</span>
            {unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-medium flex items-center justify-center tabular-nums">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
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
            onClick={() => { setOpen(false); onSettingsClick() }}
            className="w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            설정
          </button>
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
  onSettingsClick,
}: {
  onUploadClick: () => void
  onAuthRequired: () => void
  onInquiryClick: () => void
  onSettingsClick: () => void
}) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) { setUnreadCount(0); return }
    let cancelled = false
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(supabase as any).rpc('count_my_unread_replies').then(({ data, error }: { data: number | null; error: unknown }) => {
      if (cancelled) return
      if (error) { console.error('[unread count]', error); return }
      setUnreadCount(typeof data === 'number' ? data : 0)
    })
    return () => { cancelled = true }
  }, [user, pathname])

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
          unreadCount={unreadCount}
          onSignOut={signOut}
          onInquiryClick={onInquiryClick}
          onSettingsClick={onSettingsClick}
        />
        <button
          onClick={onUploadClick}
          aria-label="게시물 업로드"
          className="text-stone-500 hover:text-stone-900 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
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
