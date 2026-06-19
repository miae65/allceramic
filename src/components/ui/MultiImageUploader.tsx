'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Props = {
  userId: string
  pathPrefix: string
  urls: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function MultiImageUploader({
  userId,
  pathPrefix,
  urls,
  onChange,
  maxImages = 10,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remaining = maxImages - urls.length

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const list = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (list.length === 0) { setError('이미지 파일만 가능합니다'); return }
    if (list.length > remaining) {
      setError(`최대 ${maxImages}장까지 업로드할 수 있습니다`)
      return
    }
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const uploaded: string[] = []
      for (const file of list) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path = `${pathPrefix}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('post-images')
          .upload(path, file, { contentType: file.type, upsert: false })
        if (upErr) throw new Error(upErr.message)
        const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(path)
        uploaded.push(publicUrl)
      }
      onChange([...urls, ...uploaded])
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeAt = (i: number) => {
    onChange(urls.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {urls.map((url, i) => (
          <div key={url} className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden group">
            <Image src={url} alt="" fill sizes="160px" unoptimized className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              disabled={disabled || uploading}
              aria-label="이미지 삭제"
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-stone-200 hover:border-stone-400 text-stone-400 hover:text-stone-700 flex flex-col items-center justify-center transition-colors disabled:opacity-50"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="text-xs mt-1">{uploading ? '업로드중' : '사진 추가'}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-stone-400">
        {urls.length}/{maxImages}장
      </p>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  )
}
