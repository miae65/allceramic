'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'

export function SearchInput({ placeholder = '검색' }: { placeholder?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputRef.current?.value.trim() ?? ''
    const params = new URLSearchParams(searchParams.toString())
    if (q) {
      params.set('q', q)
    } else {
      params.delete('q')
    }
    router.push(`?${params.toString()}`)
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = ''
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`?${params.toString()}`)
  }

  const currentQ = searchParams.get('q') ?? ''

  return (
    <form onSubmit={handleSubmit} className="relative inline-flex items-center">
      <input
        ref={inputRef}
        type="text"
        defaultValue={currentQ}
        placeholder={placeholder}
        className="w-44 sm:w-56 text-xs text-stone-700 placeholder-stone-300 bg-transparent border border-stone-200 rounded-full px-4 py-2 pr-8 focus:outline-none focus:border-stone-400 transition-colors"
      />
      {currentQ ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-stone-300 hover:text-stone-500 transition-colors text-base leading-none"
          aria-label="검색어 지우기"
        >
          ×
        </button>
      ) : (
        <button
          type="submit"
          className="absolute right-3 text-stone-300 hover:text-stone-500 transition-colors"
          aria-label="검색"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx={11} cy={11} r={8} />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </form>
  )
}
