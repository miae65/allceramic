'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import { XMarkIcon } from '@/components/ui/icons'

type Props = {
  onClose: () => void
}

export function InquiryModal({ onClose }: Props) {
  const { user } = useAuth()
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const submit = async () => {
    if (!user) { setError('로그인이 필요합니다'); return }
    if (!subject.trim() || !content.trim()) { setError('제목과 내용을 모두 입력해주세요'); return }
    setSubmitting(true)
    setError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('inquiries')
        .insert({ user_id: user.id, subject: subject.trim(), content: content.trim() })
      if (insertError) {
        console.error('[inquiry insert]', insertError)
        throw new Error(insertError.message)
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '문의 등록 실패')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <p className="font-serif text-base tracking-widest text-stone-900">문의하기</p>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <p className="text-stone-700 mb-2">문의가 접수되었습니다</p>
            <p className="text-xs text-stone-400 mb-6">확인 후 답변드리겠습니다</p>
            <button
              onClick={onClose}
              className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors"
            >
              닫기
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs text-stone-400 tracking-wider uppercase">제목</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                disabled={submitting}
                maxLength={120}
                placeholder="문의 제목"
                className="mt-1 w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 tracking-wider uppercase">내용</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={submitting}
                maxLength={2000}
                placeholder="문의 내용을 자세히 적어주세요"
                rows={6}
                className="mt-1 w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 resize-none disabled:opacity-60"
              />
              <p className="text-xs text-stone-300 mt-1 tabular-nums text-right">{content.length} / 2000</p>
            </div>

            {error && <p className="text-xs text-rose-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                disabled={submitting}
                className="text-xs tracking-wider text-stone-500 hover:text-stone-900 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={submit}
                disabled={submitting || !subject.trim() || !content.trim()}
                className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
              >
                {submitting ? '전송중' : '보내기'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
