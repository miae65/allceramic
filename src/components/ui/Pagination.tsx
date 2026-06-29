'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const WINDOW = 2 // current 기준 양쪽 표시할 페이지 수

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function href(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    return `?${params.toString()}`
  }

  // 표시할 페이지 번호 범위 계산
  const start = Math.max(1, currentPage - WINDOW)
  const end = Math.min(totalPages, currentPage + WINDOW)
  const pages: (number | '...')[] = []

  if (start > 1) { pages.push(1); if (start > 2) pages.push('...') }
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages) }

  const baseClass = 'w-8 h-8 flex items-center justify-center rounded text-xs transition-colors'

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="페이지 이동">
      {currentPage > 1 && (
        <Link href={href(currentPage - 1)} className={`${baseClass} text-stone-400 hover:text-stone-700 hover:bg-stone-100`}>
          ‹
        </Link>
      )}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className={`${baseClass} text-stone-300`}>…</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`${baseClass} ${p === currentPage ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'}`}
          >
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={href(currentPage + 1)} className={`${baseClass} text-stone-400 hover:text-stone-700 hover:bg-stone-100`}>
          ›
        </Link>
      )}
    </nav>
  )
}
