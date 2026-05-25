'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@/components/ui/icons'
import type { Post } from '@/types'

export function FeedCard({ post }: { post: Post }) {
  const [imageIndex, setImageIndex] = useState(0)
  const [hovered, setHovered] = useState(false)

  const images = post.images ?? []
  const hasMultiple = images.length > 1
  const current = images[imageIndex]
  const isVideo = !!post.video_url

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    setImageIndex(i => (i - 1 + images.length) % images.length)
  }

  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    setImageIndex(i => (i + 1) % images.length)
  }

  return (
    <Link href={`/post/${post.id}`} className="block">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-stone-200 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* 미디어 */}
        {isVideo ? (
          <>
            <video
              src={post.video_url ?? undefined}
              muted
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-[1.03]' : 'scale-100'}`}
            />
            <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-[10px] tracking-wider uppercase px-2 py-0.5 rounded">
              VIDEO
            </div>
          </>
        ) : current ? (
          <Image
            src={current.url}
            alt={post.caption ?? ''}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${hovered ? 'scale-[1.03]' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 transition-transform duration-500" />
        )}

        {/* 호버 오버레이 */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${hovered ? 'opacity-10' : 'opacity-0'}`}
        />

        {/* 좌우 화살표 (복수 이미지 + 호버 시) */}
        {hasMultiple && hovered && (
          <>
            <button
              onClick={prev}
              aria-label="이전 이미지"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <ChevronLeftIcon className="w-4 h-4 text-stone-700" />
            </button>
            <button
              onClick={next}
              aria-label="다음 이미지"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <ChevronRightIcon className="w-4 h-4 text-stone-700" />
            </button>
          </>
        )}

        {/* 이미지 인디케이터 */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block w-1 h-1 rounded-full transition-colors duration-200 ${
                  i === imageIndex ? 'bg-white' : 'bg-white/45'
                }`}
              />
            ))}
          </div>
        )}

        {/* 좋아요 수 (호버 시) */}
        <div
          className={`absolute bottom-3 right-3 flex items-center gap-1 text-white transition-opacity duration-200 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <HeartIcon className="w-3.5 h-3.5" filled />
          <span className="text-xs tabular-nums">{post.like_count}</span>
        </div>
      </div>
    </Link>
  )
}
