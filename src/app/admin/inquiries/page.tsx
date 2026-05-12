import { createClient } from '@/lib/supabase/server'
import { AdminInquiryRow } from '@/components/admin/AdminInquiryRow'
import type { Inquiry } from '@/types'

async function fetchInquiries() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('inquiries')
    .select('*, profile:profiles!inquiries_user_id_fkey(id, username, avatar_url)')
    .order('created_at', { ascending: false })
  return (data ?? []) as Inquiry[]
}

export default async function AdminInquiriesPage() {
  const inquiries = await fetchInquiries()
  const pending = inquiries.filter(q => q.status === 'pending').length
  const inProgress = inquiries.filter(q => q.status === 'in_progress').length
  const resolved = inquiries.filter(q => q.status === 'resolved').length

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-2xl tracking-wide text-stone-900">문의 관리</h1>
          <p className="text-xs text-stone-400 tracking-wider uppercase mt-1">총 {inquiries.length}건</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 tabular-nums">대기 {pending}</span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 tabular-nums">처리중 {inProgress}</span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 tabular-nums">완료 {resolved}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        {inquiries.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-20">문의가 없습니다</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {inquiries.map(q => (
              <AdminInquiryRow key={q.id} inquiry={q} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
