import { createClient } from '@/lib/supabase/server'
import { AdminNoticeManager } from '@/components/admin/AdminNoticeManager'
import type { Notice } from '@/types'

async function fetchNotices() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('notices')
    .select('*, author:profiles!notices_author_id_fkey(username)')
    .order('created_at', { ascending: false })
  return (data ?? []) as Notice[]
}

async function fetchCurrentUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export default async function AdminNoticesPage() {
  const [notices, currentUserId] = await Promise.all([fetchNotices(), fetchCurrentUserId()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-stone-900">공지 관리</h1>
        <p className="text-xs text-stone-400 tracking-wider uppercase mt-1">총 {notices.length}건</p>
      </div>

      <AdminNoticeManager initialNotices={notices} authorId={currentUserId ?? ''} />
    </div>
  )
}
