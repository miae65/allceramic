'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { XMarkIcon, GoogleIcon } from '@/components/ui/icons'

type Props = {
  onClose: () => void
}

export function AuthModal({ onClose }: Props) {
  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const signInWithGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}`,
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 카드 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm px-8 py-10 flex flex-col items-center text-center">
        {/* 닫기 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* 브랜드 */}
        <p className="font-serif text-2xl tracking-widest text-stone-900 mb-2">
          Allceramic
        </p>

        <p className="text-sm text-stone-500 leading-relaxed mb-8">
          작가를 저장하려면 로그인이 필요합니다.
        </p>

        {/* Google 로그인 버튼 */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-stone-200 rounded-full py-3 px-5 text-sm text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors"
        >
          <GoogleIcon className="w-5 h-5 flex-shrink-0" />
          Google로 계속하기
        </button>

        <p className="mt-6 text-xs text-stone-400">
          로그인 시 서비스 이용약관에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}
