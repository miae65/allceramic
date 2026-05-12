import { createClient } from '@/lib/supabase/server'
import { AdminPostRow } from '@/components/admin/AdminPostRow'

async function fetchAllPosts() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('posts')
    .select('id, caption, created_at, like_count, profile:profiles!posts_user_id_fkey(id, username, avatar_url), images:post_images(url, position)')
    .order('created_at', { ascending: false })
  const posts = (data ?? []) as Array<{
    id: string
    caption: string | null
    created_at: string
    like_count: number
    profile: { id: string; username: string; avatar_url: string | null } | null
    images: { url: string; position: number }[]
  }>
  posts.forEach(p => p.images?.sort((a, b) => a.position - b.position))
  return posts
}

export default async function AdminPostsPage() {
  const posts = await fetchAllPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-2xl tracking-wide text-stone-900">게시물 관리</h1>
          <p className="text-xs text-stone-400 tracking-wider uppercase mt-1">총 {posts.length}건</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr className="text-xs tracking-wider text-stone-400 uppercase">
              <th className="text-left px-6 py-3 font-normal">이미지</th>
              <th className="text-left px-6 py-3 font-normal">작성자</th>
              <th className="text-left px-6 py-3 font-normal">캡션</th>
              <th className="text-left px-6 py-3 font-normal">좋아요</th>
              <th className="text-left px-6 py-3 font-normal">작성일</th>
              <th className="text-right px-6 py-3 font-normal">관리</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-16 text-center text-stone-400">게시물이 없습니다</td></tr>
            ) : posts.map(p => (
              <AdminPostRow
                key={p.id}
                id={p.id}
                caption={p.caption}
                createdAt={p.created_at}
                likeCount={p.like_count}
                authorUsername={p.profile?.username ?? '-'}
                thumbnailUrl={p.images[0]?.url ?? null}
                imagePaths={p.images.map(img => {
                  const m = img.url.match(/\/storage\/v1\/object\/public\/post-images\/(.+)$/)
                  return m ? m[1] : null
                }).filter((s): s is string => !!s)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
