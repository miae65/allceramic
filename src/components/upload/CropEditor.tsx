'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'

type Props = {
  imageSrc: string
  index: number
  total: number
  onDone: (pixels: Area) => void
}

export function CropEditor({ imageSrc, index, total, onDone }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedPixels(pixels)
  }, [])

  const handleDone = () => {
    if (croppedPixels) onDone(croppedPixels)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 상단 인디케이터 */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
        <p className="text-xs text-stone-400">
          {index + 1} / {total}
        </p>
        <p className="text-xs text-stone-500 tracking-widest uppercase">Crop</p>
        <button
          onClick={handleDone}
          disabled={!croppedPixels}
          className="text-xs font-medium text-stone-900 hover:text-stone-500 disabled:text-stone-300 transition-colors"
        >
          {index + 1 < total ? '다음 →' : '완료'}
        </button>
      </div>

      {/* 크롭 영역 */}
      <div className="relative flex-1 bg-stone-900">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={3 / 4}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={false}
          style={{
            containerStyle: { borderRadius: 0 },
            cropAreaStyle: { border: '2px solid rgba(255,255,255,0.7)' },
          }}
        />
      </div>

      {/* 줌 슬라이더 */}
      <div className="px-8 py-4 flex items-center gap-4">
        <span className="text-xs text-stone-400 select-none">—</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className="flex-1 h-0.5 appearance-none bg-stone-200 rounded-full accent-stone-900 cursor-pointer"
        />
        <span className="text-xs text-stone-400 select-none">+</span>
      </div>
    </div>
  )
}
