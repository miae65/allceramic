import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { BoardPost } from '@/types'

async function fetchBoardPosts() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('board_posts')
    .select('id, title, view_count, created_at, profile:profiles!board_posts_user_id_fkey(username), board_comments(count)')
    .order('created_at', { ascending: false })
  return (data ?? []) as Array<BoardPost & { board_comments: { count: number }[] }>
}

export default async function BoardPage() {
  const posts = await fetchBoardPosts()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs tracking-widest text-stone-400 uppercase mb-2">Community</p>
          <h1 className="font-serif text-2xl text-stone-900">자유게시판</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/board/my"
            className="text-xs tracking-[0.15em] uppercase text-stone-500 border border-stone-200 rounded-full px-4 py-2 hover:border-stone-400 hover:text-stone-700 transition-colors"
          >
            내가 쓴 글
          </Link>
          <Link
            href="/board/write"
            className="text-xs tracking-[0.15em] uppercase text-stone-900 border border-stone-300 rounded-full px-4 py-2 hover:border-stone-700 transition-colors"
          >
            글쓰기
          </Link>
        </div>
      </div>

      {/* 목록 */}
      <div className="mt-[100px]">
        {posts.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-20">아직 게시글이 없습니다.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {posts.map((post, i) => {
              const commentCount = post.board_comments?.[0]?.count ?? 0
              return (
                <Link
                  key={post.id}
                  href={`/board/${post.id}`}
                  className="flex items-center justify-between py-4 group hover:bg-stone-50 -mx-3 px-3 rounded transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs text-stone-300 w-5 text-right shrink-0">{posts.length - i}</span>
                    <span className="text-sm text-stone-800 group-hover:text-stone-600 transition-colors truncate">
                      {post.title}
                    </span>
                    {commentCount > 0 && (
                      <span className="text-xs text-stone-400 shrink-0">[{commentCount}]</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-xs text-stone-400 hidden sm:block">{post.profile?.username ?? '-'}</span>
                    <span className="text-xs text-stone-300">
                      {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                    </span>
                    <span className="text-xs text-stone-300 hidden sm:block tabular-nums">{post.view_count}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
