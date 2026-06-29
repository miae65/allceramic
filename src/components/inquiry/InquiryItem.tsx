'use client'

import { useState, useTransition } from 'react'
import { updateInquiry, deleteInquiry } from '@/app/actions/inquiry'
import type { Inquiry } from '@/types'

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: '대기', cls: 'bg-amber-100 text-amber-700' },
  in_progress: { label: '처리중', cls: 'bg-blue-100 text-blue-700' },
  resolved: { label: '완료', cls: 'bg-emerald-100 text-emerald-700' },
}

export function InquiryItem({ inquiry: q }: { inquiry: Inquiry }) {
  const s = STATUS[q.status] ?? { label: q.status, cls: 'bg-stone-100 text-stone-700' }
  const canModify = !q.admin_reply

  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [subject, setSubject] = useState(q.subject)
  const [content, setContent] = useState(q.content)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onSave = () => {
    if (!subject.trim() || !content.trim()) return
    setError(null)
    startTransition(async () => {
      try {
        await updateInquiry(q.id, subject, content)
        setEditing(false)
      } catch (e) {
        setError(e instanceof Error ? e.message : '수정 실패')
      }
    })
  }

  const onDelete = () => {
    setError(null)
    startTransition(async () => {
      try {
        await deleteInquiry(q.id)
      } catch (e) {
        setError(e instanceof Error ? e.message : '삭제 실패')
        setConfirming(false)
      }
    })
  }

  return (
    <li className="bg-white rounded-2xl border border-stone-100 p-5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${s.cls}`}>{s.label}</span>
          {editing ? (
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="flex-1 text-sm font-medium text-stone-900 border-b border-stone-300 focus:outline-none focus:border-stone-600 bg-transparent"
            />
          ) : (
            <p className="text-sm font-medium text-stone-900 truncate">{subject}</p>
          )}
        </div>
        {canModify && !editing && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="text-xs text-stone-400 hover:text-rose-500 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-stone-400 mb-3">{new Date(q.created_at).toLocaleString('ko-KR')}</p>

      {editing ? (
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          className="w-full text-sm text-stone-600 border border-stone-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-stone-400 transition-colors mb-3"
        />
      ) : (
        <p className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed">{content}</p>
      )}

      {error && <p className="text-xs text-rose-500 mt-1 mb-2">{error}</p>}

      {editing && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={onSave}
            disabled={isPending}
            className="text-xs tracking-[0.12em] uppercase text-white bg-stone-900 rounded-full px-4 py-1.5 hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {isPending ? '저장중...' : '저장'}
          </button>
          <button
            onClick={() => { setEditing(false); setSubject(q.subject); setContent(q.content); setError(null) }}
            className="text-xs tracking-[0.12em] uppercase text-stone-500 border border-stone-200 rounded-full px-4 py-1.5 hover:border-stone-400 transition-colors"
          >
            취소
          </button>
        </div>
      )}

      {confirming && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-stone-500">정말 삭제하시겠어요?</span>
          <button
            onClick={onDelete}
            disabled={isPending}
            className="text-xs text-white bg-rose-500 hover:bg-rose-600 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            {isPending ? '삭제중...' : '삭제'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            취소
          </button>
        </div>
      )}

      {q.admin_reply ? (
        <div className="mt-4 p-4 bg-stone-50 rounded-lg border-l-2 border-stone-900">
          <p className="text-xs text-stone-400 tracking-wider uppercase mb-2">관리자 답변</p>
          <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">{q.admin_reply}</p>
          {q.replied_at && (
            <p className="text-[11px] text-stone-400 mt-2 tabular-nums">{new Date(q.replied_at).toLocaleString('ko-KR')}</p>
          )}
        </div>
      ) : (
        !editing && !confirming && (
          <p className="mt-4 text-xs text-stone-400">답변 대기중</p>
        )
      )}
    </li>
  )
}
