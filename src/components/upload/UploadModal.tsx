'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Area } from 'react-easy-crop'
import { CropEditor } from './CropEditor'
import { XMarkIcon } from '@/components/ui/icons'
import { getCroppedImg } from '@/lib/utils/cropImage'
import { createClient } from '@/lib/supabase/client'

type Step = 'select' | 'crop' | 'caption' | 'submitting'

type Props = {
  onClose: () => void
}

export function UploadModal({ onClose }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('select')

  const [rawUrls, setRawUrls] = useState<string[]>([])
  const [cropIndex, setCropIndex] = useState(0)
  const [croppedBlobs, setCroppedBlobs] = useState<Blob[]>([])
  const [croppedUrls, setCroppedUrls] = useState<string[]>([])

  const [caption, setCaption] = useState('')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    return () => {
      rawUrls.forEach(URL.revokeObjectURL)
      croppedUrls.forEach(URL.revokeObjectURL)
    }
  }, [rawUrls, croppedUrls])

  const loadImages = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 5)
    if (!imageFiles.length) return
    const urls = imageFiles.map(f => URL.createObjectURL(f))
    setRawUrls(urls)
    setCropIndex(0)
    setCroppedBlobs([])
    setCroppedUrls([])
    setStep('crop')
  }

  const onCropDone = useCallback(async (pixels: Area) => {
    const blob = await getCroppedImg(rawUrls[cropIndex], pixels)
    const url = URL.createObjectURL(blob)
    const newBlobs = [...croppedBlobs, blob]
    const newUrls = [...croppedUrls, url]
    setCroppedBlobs(newBlobs)
    setCroppedUrls(newUrls)

    if (cropIndex + 1 < rawUrls.length) {
      setCropIndex(i => i + 1)
    } else {
      setStep('caption')
    }
  }, [cropIndex, rawUrls, croppedBlobs, croppedUrls])

  const onSubmit = async () => {
    setStep('submitting')
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('로그인이 필요합니다')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any

      const { data: profile } = await db
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single()

      if (!profile) throw new Error('프로필을 찾을 수 없습니다')

      const { data: post, error: postError } = await db
        .from('posts')
        .insert({ user_id: user.id, caption: caption.trim() || null })
        .select('id')
        .single()
      if (postError || !post) throw new Error('게시물 생성 실패')

      const imageUrls: string[] = []
      for (let i = 0; i < croppedBlobs.length; i++) {
        const blob = croppedBlobs[i]
        const path = `${user.id}/${post.id}/${i}.jpg`
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(path, blob, { contentType: 'image/jpeg', upsert: true })
        if (uploadError) throw new Error(`이미지 업로드 실패: ${uploadError.message}`)
        const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(path)
        imageUrls.push(publicUrl)
      }

      await db.from('post_images').insert(
        imageUrls.map((url: string, position: number) => ({ post_id: post.id, url, position }))
      )

      onClose()
      router.push(`/profile/${profile.username}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다')
      setStep('caption')
    }
  }

  const modalHeight = step === 'select' ? 'h-auto' : 'h-[560px]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden ${modalHeight}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 flex-shrink-0">
          <p className="font-serif text-base tracking-widest text-stone-900">
            {step === 'select' && '업로드'}
            {step === 'crop' && 'Crop Image'}
            {step === 'caption' && 'Add Caption'}
            {step === 'submitting' && 'Posting...'}
          </p>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {step === 'select' && (
          <div className="p-6 space-y-3">
            <div
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-colors ${
                dragging ? 'border-stone-400 bg-stone-50' : 'border-stone-200 hover:border-stone-300'
              }`}
              onClick={() => imageInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault()
                setDragging(false)
                loadImages(e.dataTransfer.files)
              }}
            >
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-stone-700 font-medium">클릭하거나 드래그하세요</p>
                <p className="text-xs text-stone-400 mt-1">이미지 최대 5장 · JPG, PNG, WebP</p>
              </div>
            </div>

            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full text-xs tracking-wider text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full py-2.5 transition-colors"
            >
              이미지 선택
            </button>

            {error && <p className="text-xs text-rose-500">{error}</p>}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => e.target.files && loadImages(e.target.files)}
            />
          </div>
        )}

        {step === 'crop' && rawUrls[cropIndex] && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <CropEditor
              key={rawUrls[cropIndex]}
              imageSrc={rawUrls[cropIndex]}
              index={cropIndex}
              total={rawUrls.length}
              onDone={onCropDone}
            />
          </div>
        )}

        {step === 'caption' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex gap-2 p-4 overflow-x-auto flex-shrink-0 border-b border-stone-100">
              {croppedUrls.map((url, i) => (
                <div key={i} className="w-20 flex-shrink-0 relative overflow-hidden rounded-md bg-stone-200" style={{ height: '106px' }}>
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>

            <div className="flex-1 p-4">
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="작품에 대한 이야기를 적어주세요 (선택)"
                maxLength={500}
                className="w-full h-full resize-none text-sm text-stone-700 placeholder:text-stone-400 outline-none leading-relaxed"
              />
            </div>

            {error && (
              <p className="px-4 pb-2 text-xs text-red-500">{error}</p>
            )}

            <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-stone-400 tabular-nums">{caption.length} / 500</span>
              <button
                onClick={onSubmit}
                className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors"
              >
                게시하기
              </button>
            </div>
          </div>
        )}

        {step === 'submitting' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
              <p className="text-xs text-stone-400 tracking-widest uppercase">Posting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
