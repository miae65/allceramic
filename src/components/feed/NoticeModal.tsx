'use client'

import { useEffect, useState } from 'react'
import { XMarkIcon } from '@/components/ui/icons'
import type { Notice } from '@/types'

type Props = {
  notice: Notice | null
}

const storageKey = (id: string) => `notice:dismissed-until:${id}`

export function NoticeModal({ notice }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!notice) return
    try {
      const until = window.localStorage.getItem(storageKey(notice.id))
      if (until) {
        const untilTime = new Date(until).getTime()
        if (!Number.isNaN(untilTime) && untilTime > Date.now()) return
      }
    } catch {
      // 로컬스토리지 접근 실패 시 표시
    }
    setOpen(true)
  }, [notice])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  if (!notice || !open) return null

  const hideUntilMidnight = () => {
    // 다음 자정 (당일 24:00 = 다음날 00:00)
    const next = new Date()
    next.setHours(24, 0, 0, 0)
    try {
      window.localStorage.setItem(storageKey(notice.id), next.toISOString())
    } catch {
      // 무시
    }
    setOpen(false)
  }

  const closeOnce = () => setOpen(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeOnce} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <p className="font-serif text-base tracking-widest text-stone-900">공지</p>
          <button onClick={closeOnce} className="text-stone-400 hover:text-stone-700 transition-colors" aria-label="닫기">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">{notice.content}</p>
          <p className="text-[11px] text-stone-300 mt-4 tabular-nums">
            {new Date(notice.created_at).toLocaleDateString('ko-KR')}
          </p>
        </div>

        <div className="flex border-t border-stone-100">
          <button
            onClick={hideUntilMidnight}
            className="flex-1 py-3 text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors border-r border-stone-100"
          >
            오늘 안 보기
          </button>
          <button
            onClick={closeOnce}
            className="flex-1 py-3 text-sm text-stone-700 font-medium hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
