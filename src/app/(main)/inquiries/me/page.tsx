import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MarkInquiriesSeenOnMount } from '@/components/inquiry/MarkInquiriesSeenOnMount'
import type { Inquiry } from '@/types'

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: '대기', cls: 'bg-amber-100 text-amber-700' },
  in_progress: { label: '처리중', cls: 'bg-blue-100 text-blue-700' },
  resolved: { label: '완료', cls: 'bg-emerald-100 text-emerald-700' },
}

export default async function MyInquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // 미확인 답변을 본 것으로 표시
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('mark_my_inquiries_seen')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('inquiries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const inquiries = (data ?? []) as Inquiry[]

  return (
    <>
      <MarkInquiriesSeenOnMount />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-serif text-2xl tracking-wide text-stone-900 mb-1">내 문의</h1>
        <p className="text-xs text-stone-400 tracking-wider uppercase mb-8">총 {inquiries.length}건</p>

        {inquiries.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-20">아직 보낸 문의가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {inquiries.map(q => {
              const s = STATUS[q.status] ?? { label: q.status, cls: 'bg-stone-100 text-stone-700' }
              return (
                <li key={q.id} className="bg-white rounded-2xl border border-stone-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                    <p className="text-sm font-medium text-stone-900 truncate">{q.subject}</p>
                  </div>
                  <p className="text-xs text-stone-400 mb-3">{new Date(q.created_at).toLocaleString('ko-KR')}</p>
                  <p className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed">{q.content}</p>

                  {q.admin_reply ? (
                    <div className="mt-4 p-4 bg-stone-50 rounded-lg border-l-2 border-stone-900">
                      <p className="text-xs text-stone-400 tracking-wider uppercase mb-2">관리자 답변</p>
                      <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">{q.admin_reply}</p>
                      {q.replied_at && (
                        <p className="text-[11px] text-stone-400 mt-2 tabular-nums">{new Date(q.replied_at).toLocaleString('ko-KR')}</p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-stone-400">답변 대기중</p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
