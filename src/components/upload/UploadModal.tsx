'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import type { Area } from 'react-easy-crop'
import { CropEditor } from './CropEditor'
import { XMarkIcon } from '@/components/ui/icons'
import { getCroppedImg } from '@/lib/utils/cropImage'

type Step = 'select' | 'crop' | 'caption' | 'submitting'

type Props = {
  onClose: () => void
}

export function UploadModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>('select')
  const [rawUrls, setRawUrls] = useState<string[]>([])
  const [cropIndex, setCropIndex] = useState(0)
  const [croppedBlobs, setCroppedBlobs] = useState<Blob[]>([])
  const [croppedUrls, setCroppedUrls] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ESC 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // object URL 정리
  useEffect(() => {
    return () => {
      rawUrls.forEach(URL.revokeObjectURL)
      croppedUrls.forEach(URL.revokeObjectURL)
    }
  }, [rawUrls, croppedUrls])

  const loadFiles = (files: FileList | File[]) => {
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
    /*
     * TODO: Supabase 연결 후 교체
     *
     * const supabase = createClient()
     * const { data: { user } } = await supabase.auth.getUser()
     *
     * const { data: post } = await supabase.from('posts')
     *   .insert({ user_id: user!.id, caption })
     *   .select('id').single()
     *
     * await Promise.all(croppedBlobs.map(async (blob, i) => {
     *   const path = `${user!.id}/${post.id}/${i}.jpg`
     *   await supabase.storage.from('post-images').upload(path, blob)
     *   const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(path)
     *   await supabase.from('post_images').insert({ post_id: post.id, url: publicUrl, position: i })
     * }))
     *
     * router.push(`/post/${post.id}`)
     */
    await new Promise(r => setTimeout(r, 800)) // mock delay
    onClose()
  }

  const modalHeight = step === 'select' ? 'h-auto' : 'h-[560px]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 백드롭 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 모달 */}
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden ${modalHeight}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 flex-shrink-0">
          <p className="font-serif text-base tracking-widest text-stone-900">
            {step === 'select' && 'New Post'}
            {step === 'crop' && 'Crop Image'}
            {step === 'caption' && 'Add Caption'}
            {step === 'submitting' && 'Posting...'}
          </p>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* --- Step: select --- */}
        {step === 'select' && (
          <div className="p-6">
            <div
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-16 cursor-pointer transition-colors ${
                dragging ? 'border-stone-400 bg-stone-50' : 'border-stone-200 hover:border-stone-300'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); loadFiles(e.dataTransfer.files) }}
            >
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-stone-700 font-medium">클릭하거나 드래그하세요</p>
                <p className="text-xs text-stone-400 mt-1">최대 5장 · JPG, PNG, WebP</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => e.target.files && loadFiles(e.target.files)}
            />
          </div>
        )}

        {/* --- Step: crop --- */}
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

        {/* --- Step: caption --- */}
        {step === 'caption' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 크롭된 이미지 미리보기 */}
            <div className="flex gap-2 p-4 overflow-x-auto flex-shrink-0 border-b border-stone-100">
              {croppedUrls.map((url, i) => (
                <div key={i} className="w-20 h-[calc(20px*4/3*4)] flex-shrink-0 relative overflow-hidden rounded-md bg-stone-200" style={{ height: '106px' }}>
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* 캡션 입력 */}
            <div className="flex-1 p-4">
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="작품에 대한 이야기를 적어주세요 (선택)"
                maxLength={500}
                className="w-full h-full resize-none text-sm text-stone-700 placeholder:text-stone-400 outline-none leading-relaxed"
              />
            </div>

            {/* 글자 수 + 제출 */}
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

        {/* --- Step: submitting --- */}
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
