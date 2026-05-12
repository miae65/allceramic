'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Inquiry, InquiryStatus } from '@/types'

const STATUS_MAP: Record<InquiryStatus, { label: string; cls: string }> = {
  pending: { label: '대기', cls: 'bg-amber-100 text-amber-700' },
  in_progress: { label: '처리중', cls: 'bg-blue-100 text-blue-700' },
  resolved: { label: '완료', cls: 'bg-emerald-100 text-emerald-700' },
}

export function AdminInquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [reply, setReply] = useState(inquiry.admin_reply ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateStatus = async (next: InquiryStatus) => {
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: e } = await (supabase as any)
        .from('inquiries')
        .update({ status: next, updated_at: new Date().toISOString() })
        .eq('id', inquiry.id)
      if (e) throw new Error(e.message)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '상태 변경 실패')
    } finally {
      setSaving(false)
    }
  }

  const saveReply = async () => {
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: e } = await (supabase as any)
        .from('inquiries')
        .update({
          admin_reply: reply.trim() || null,
          status: 'resolved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', inquiry.id)
      if (e) throw new Error(e.message)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '답변 저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const status = STATUS_MAP[inquiry.status]

  return (
    <li className="p-5">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
            <p className="text-sm font-medium text-stone-900 truncate">{inquiry.subject}</p>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {inquiry.profile?.username ?? '-'} · {new Date(inquiry.created_at).toLocaleString('ko-KR')}
          </p>
        </div>
        <span className="text-xs text-stone-300">{expanded ? '접기' : '펼치기'}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="bg-stone-50 rounded-lg p-4">
            <p className="text-xs text-stone-400 tracking-wider uppercase mb-2">문의 내용</p>
            <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">{inquiry.content}</p>
          </div>

          <div>
            <p className="text-xs text-stone-400 tracking-wider uppercase mb-2">답변</p>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              disabled={saving}
              maxLength={2000}
              rows={4}
              placeholder="답변 내용 작성 (저장 시 완료 처리)"
              className="w-full text-sm bg-white border border-stone-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-stone-300 disabled:opacity-60"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus('pending')}
                disabled={saving || inquiry.status === 'pending'}
                className="text-xs text-stone-500 hover:text-stone-900 px-3 py-1.5 rounded-full bg-stone-100 disabled:opacity-40 transition-colors"
              >
                대기로
              </button>
              <button
                onClick={() => updateStatus('in_progress')}
                disabled={saving || inquiry.status === 'in_progress'}
                className="text-xs text-stone-500 hover:text-stone-900 px-3 py-1.5 rounded-full bg-stone-100 disabled:opacity-40 transition-colors"
              >
                처리중
              </button>
              <button
                onClick={() => updateStatus('resolved')}
                disabled={saving || inquiry.status === 'resolved'}
                className="text-xs text-stone-500 hover:text-stone-900 px-3 py-1.5 rounded-full bg-stone-100 disabled:opacity-40 transition-colors"
              >
                완료로
              </button>
            </div>

            <button
              onClick={saveReply}
              disabled={saving}
              className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-5 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {saving ? '저장중' : '답변 저장'}
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
