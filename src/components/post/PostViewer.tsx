'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons'
import type { PostImage } from '@/types'

export function PostViewer({ images }: { images: PostImage[] }) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setIndex(i => (i + 1) % images.length)

  const current = images[index]

  return (
    <div className="relative aspect-[3/4] bg-stone-200 overflow-hidden select-none">
      {current?.url ? (
        <Image
          key={current.id}
          src={current.url}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300" />
      )}

      {/* 좌우 화살표 */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="이전 이미지"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <ChevronLeftIcon className="w-4 h-4 text-stone-700" />
          </button>
          <button
            onClick={next}
            aria-label="다음 이미지"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <ChevronRightIcon className="w-4 h-4 text-stone-700" />
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`이미지 ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                i === index ? 'bg-white' : 'bg-white/45'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
