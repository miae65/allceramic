'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { XMarkIcon, GoogleIcon } from '@/components/ui/icons'
import { TermsModal } from './TermsModal'

type Props = {
  onClose: () => void
}

export function AuthModal({ onClose }: Props) {
  const [showTerms, setShowTerms] = useState(false)

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
    <>
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
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm px-8 pt-10 pb-8 flex flex-col items-center text-center">
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
            환영합니다.
          </p>

          {/* Google 로그인 버튼 */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 border border-stone-200 rounded-full py-3 px-5 text-sm text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors"
          >
            <GoogleIcon className="w-5 h-5 flex-shrink-0" />
            Google로 계속하기
          </button>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-stone-400">
              로그인 시 서비스 이용약관에 동의하게 됩니다.
            </p>
            <button
              onClick={() => setShowTerms(true)}
              className="text-xs text-stone-500 border border-stone-200 rounded-full px-4 py-1.5 hover:border-stone-400 hover:text-stone-800 transition-colors"
            >
              이용약관 보기
            </button>
          </div>
        </div>
      </div>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  )
}
