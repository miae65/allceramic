import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeftIcon } from '@/components/ui/icons'
import { createClient } from '@/lib/supabase/server'
import type { ExhibitionPost } from '@/types'

async function fetchMyPosts(userId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('exhibition_posts')
    .select('id, title, view_count, created_at, exhibition_comments(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return (data ?? []) as Array<ExhibitionPost & { exhibition_comments: { count: number }[] }>
}

export default async function MyExhibitionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const myPosts = await fetchMyPosts(user.id)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/exhibition"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors text-sm mb-8"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>전시정보</span>
      </Link>

      <div className="flex items-end justify-between mb-[100px]">
        <div>
          <h1 className="font-serif text-2xl text-stone-900">내가 쓴 글</h1>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 px-3 -mx-3 border-y border-stone-200 bg-stone-50/50 text-xs tracking-wider text-stone-500 uppercase">
        <div className="flex items-center gap-4 min-w-0">
          <span className="w-5 shrink-0" />
          <span>제목</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="w-12 text-center">업로드</span>
          <span className="hidden sm:block w-12 text-right">조회수</span>
        </div>
      </div>

      {myPosts.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-20">작성한 글이 없습니다.</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {myPosts.map((post, i) => {
            const commentCount = post.exhibition_comments?.[0]?.count ?? 0
            return (
              <Link
                key={post.id}
                href={`/exhibition/${post.id}`}
                className="flex items-center justify-between py-4 group hover:bg-stone-50 -mx-3 px-3 rounded transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs text-stone-300 w-5 text-right shrink-0">{myPosts.length - i}</span>
                  <span className="text-sm text-stone-800 group-hover:text-stone-600 transition-colors truncate">
                    {post.title}
                  </span>
                  {commentCount > 0 && (
                    <span className="text-xs text-stone-400 shrink-0">[{commentCount}]</span>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-xs text-stone-500 w-12 text-center tabular-nums">
                    {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                  </span>
                  <span className="text-xs text-stone-500 hidden sm:block w-12 text-right tabular-nums">{post.view_count}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
