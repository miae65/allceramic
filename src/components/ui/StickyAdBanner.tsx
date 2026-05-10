'use client'

import { useState } from 'react'

export function StickyAdBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-[10px] text-stone-300 tracking-widest uppercase shrink-0">AD</span>
          <div className="h-10 flex-1 bg-stone-100 rounded flex items-center justify-center">
            <span className="text-xs text-stone-300 tracking-widest uppercase">Advertisement</span>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="배너 닫기"
          className="text-stone-300 hover:text-stone-500 transition-colors text-lg leading-none shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  )
}
