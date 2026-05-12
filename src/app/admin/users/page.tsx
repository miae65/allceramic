import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAILS } from '@/lib/admin'

async function fetchUsers() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profiles } = await (supabase as any)
    .from('profiles')
    .select('id, username, avatar_url, bio, created_at')
    .order('created_at', { ascending: false })

  return (profiles ?? []) as Array<{
    id: string
    username: string
    avatar_url: string | null
    bio: string | null
    created_at: string
  }>
}

async function fetchPostCounts(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, number>()
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('posts')
    .select('user_id')
    .in('user_id', userIds)
  const counts = new Map<string, number>()
  for (const row of (data ?? []) as { user_id: string }[]) {
    counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1)
  }
  return counts
}

export default async function AdminUsersPage() {
  const users = await fetchUsers()
  const postCounts = await fetchPostCounts(users.map(u => u.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-stone-900">회원 관리</h1>
        <p className="text-xs text-stone-400 tracking-wider uppercase mt-1">총 {users.length}명</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr className="text-xs tracking-wider text-stone-400 uppercase">
              <th className="text-left px-6 py-3 font-normal">프로필</th>
              <th className="text-left px-6 py-3 font-normal">소개</th>
              <th className="text-left px-6 py-3 font-normal">게시물</th>
              <th className="text-left px-6 py-3 font-normal">권한</th>
              <th className="text-left px-6 py-3 font-normal">가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-16 text-center text-stone-400">회원이 없습니다</td></tr>
            ) : users.map(u => {
              const adminTag = (ADMIN_EMAILS as readonly string[]).some(e => u.username === e.split('@')[0])
              return (
                <tr key={u.id} className="border-b border-stone-50 hover:bg-stone-50/50">
                  <td className="px-6 py-3">
                    <Link href={`/profile/${u.username}`} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-stone-200 overflow-hidden flex-shrink-0">
                        {u.avatar_url && (
                          <Image src={u.avatar_url} alt={u.username} width={36} height={36} className="object-cover w-full h-full" />
                        )}
                      </div>
                      <span className="text-stone-700 hover:text-stone-900">{u.username}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-stone-500 max-w-xs truncate">{u.bio || '-'}</td>
                  <td className="px-6 py-3 text-stone-700 tabular-nums">{postCounts.get(u.id) ?? 0}</td>
                  <td className="px-6 py-3">
                    {adminTag ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-900 text-white">관리자</span>
                    ) : (
                      <span className="text-xs text-stone-400">일반</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-stone-400 tabular-nums text-xs">{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

