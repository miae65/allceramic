'use client'

import { useEffect } from 'react'
import { XMarkIcon } from '@/components/ui/icons'

type Props = {
  onClose: () => void
}

export function UploadBlockedAlert({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-end px-2 pt-2">
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors p-2">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="px-8 pb-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="font-serif text-lg text-stone-900 mb-2">업로드 정지</p>
          <p className="text-sm text-stone-600 leading-relaxed">관리자에 의해 업로드가 정지되었습니다.</p>
          <button
            onClick={onClose}
            className="mt-6 text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
