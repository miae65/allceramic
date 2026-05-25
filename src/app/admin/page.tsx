import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminInquiryRow } from '@/components/admin/AdminInquiryRow'
import type { Inquiry } from '@/types'

async function fetchStats() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - 6) // 오늘 포함 7일

  const [posts, users, comments, inquiriesPending, inquiriesAll, notices, newToday, newWeek] = await Promise.all([
    sb.from('posts').select('*', { count: 'exact', head: true }),
    sb.from('profiles').select('*', { count: 'exact', head: true }),
    sb.from('comments').select('*', { count: 'exact', head: true }),
    sb.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('inquiries').select('*', { count: 'exact', head: true }),
    sb.from('notices').select('*', { count: 'exact', head: true }),
    sb.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday.toISOString()),
    sb.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfWeek.toISOString()),
  ])

  return {
    posts: posts.count ?? 0,
    users: users.count ?? 0,
    comments: comments.count ?? 0,
    inquiriesPending: inquiriesPending.count ?? 0,
    inquiriesAll: inquiriesAll.count ?? 0,
    notices: notices.count ?? 0,
    newToday: newToday.count ?? 0,
    newWeek: newWeek.count ?? 0,
  }
}

async function fetchRecent() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const [recentPosts, recentInquiries] = await Promise.all([
    sb.from('posts')
      .select('id, caption, created_at, profile:profiles!posts_user_id_fkey(username)')
      .order('created_at', { ascending: false })
      .limit(5),
    sb.from('inquiries')
      .select('*, profile:profiles!inquiries_user_id_fkey(id, username, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])
  return {
    recentPosts: recentPosts.data ?? [],
    recentInquiries: (recentInquiries.data ?? []) as Inquiry[],
  }
}

export default async function AdminHomePage() {
  const stats = await fetchStats()
  const recent = await fetchRecent()

  const tiles = [
    { label: '회원', value: stats.users },
    { label: '신규 가입 (오늘)', value: stats.newToday, sub: `최근 7일 ${stats.newWeek}명` },
    { label: '게시물', value: stats.posts },
    { label: '댓글', value: stats.comments },
    { label: '문의 (대기)', value: stats.inquiriesPending, sub: `전체 ${stats.inquiriesAll}` },
    { label: '공지', value: stats.notices },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-stone-900">대시보드</h1>
        <p className="text-xs text-stone-400 tracking-wider uppercase mt-1">전체 현황</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {tiles.map(t => (
          <div key={t.label} className="bg-white rounded-2xl border border-stone-100 p-6">
            <p className="text-xs text-stone-400 tracking-wider uppercase">{t.label}</p>
            <p className="font-serif text-3xl text-stone-900 mt-2 tabular-nums">{t.value.toLocaleString()}</p>
            {t.sub && <p className="text-xs text-stone-400 mt-1">{t.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs text-stone-400 tracking-wider uppercase mb-4">최근 게시물</p>
          {recent.recentPosts.length === 0 ? (
            <p className="text-sm text-stone-400 py-8 text-center">게시물 없음</p>
          ) : (
            <ul className="space-y-3">
              {recent.recentPosts.map((p: { id: string; caption: string | null; created_at: string; profile: { username: string } | null }) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-stone-700 truncate">{p.caption || '(캡션 없음)'}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{p.profile?.username ?? '-'}</p>
                  </div>
                  <span className="text-xs text-stone-300 tabular-nums">{new Date(p.created_at).toLocaleDateString('ko-KR')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-stone-100 p-6">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs text-stone-400 tracking-wider uppercase">최근 문의</p>
            <Link href="/admin/inquiries" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">전체 보기</Link>
          </div>
          {recent.recentInquiries.length === 0 ? (
            <p className="text-sm text-stone-400 py-8 text-center">문의 없음</p>
          ) : (
            <ul className="-mx-6 divide-y divide-stone-100 border-t border-stone-100">
              {recent.recentInquiries.map(q => (
                <AdminInquiryRow key={q.id} inquiry={q} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

