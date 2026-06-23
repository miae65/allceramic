'use client'

import { useState } from 'react'
import { InquiryModal } from './InquiryModal'

export function InquiryButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs tracking-[0.15em] uppercase text-stone-900 border border-stone-300 rounded-full px-4 py-2 hover:border-stone-700 transition-colors"
      >
        문의하기
      </button>
      {open && <InquiryModal onClose={() => setOpen(false)} />}
    </>
  )
}
