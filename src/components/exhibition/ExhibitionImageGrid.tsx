'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ExhibitionImageGrid({ urls, title }: { urls: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-6">
        {urls.map((url, i) => (
          <button
            key={url}
            onClick={() => setLightbox(url)}
            className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden cursor-zoom-in"
          >
            <Image
              src={url}
              alt={`${title} 이미지 ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              unoptimized
              className="object-cover hover:opacity-90 transition-opacity"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt={title}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}
