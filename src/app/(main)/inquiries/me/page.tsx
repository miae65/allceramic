import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MarkInquiriesSeenOnMount } from '@/components/inquiry/MarkInquiriesSeenOnMount'
import { InquiryButton } from '@/components/inquiry/InquiryButton'
import { InquiryItem } from '@/components/inquiry/InquiryItem'
import type { Inquiry } from '@/types'

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
        <div className="flex items-end justify-between mb-1">
          <h1 className="font-serif text-2xl tracking-wide text-stone-900">내 문의</h1>
          <InquiryButton />
        </div>
        <p className="text-xs text-stone-400 tracking-wider uppercase mb-8">총 {inquiries.length}건</p>

        {inquiries.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-20">아직 보낸 문의가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {inquiries.map(q => <InquiryItem key={q.id} inquiry={q} />)}
          </ul>
        )}
      </div>
    </>
  )
}
