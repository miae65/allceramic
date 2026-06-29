import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SearchInput } from '@/components/ui/SearchInput'
import { Pagination } from '@/components/ui/Pagination'
import { AuthGatedLink } from '@/components/ui/AuthGatedLink'
import type { BoardPost } from '@/types'

export const metadata: Metadata = {
  title: '자유게시판',
  description: '도예 커뮤니티 자유게시판 — 자유롭게 이야기를 나눠보세요',
  openGraph: { title: '자유게시판 | Allceramic', description: '도예 커뮤니티 자유게시판' },
}

const PAGE_SIZE = 15

async function fetchBoardPosts(q?: string, page = 1) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('board_posts')
    .select('id, title, view_count, created_at, profile:profiles!board_posts_user_id_fkey(username), board_comments(count)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (q) query = query.ilike('title', `%${q}%`)
  const { data, count } = await query
  return { posts: (data ?? []) as Array<BoardPost & { board_comments: { count: number }[] }>, total: count ?? 0 }
}

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)
  const { posts, total } = await fetchBoardPosts(q, page)
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const { data: { user } } = await (await createClient()).auth.getUser()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900">자유게시판</h1>
          <p className="text-xs text-stone-400 mt-2">자유롭게 정보를 공유하는 공간입니다.</p>
          <div className="mt-4">
            <Suspense>
              <SearchInput placeholder="제목 검색" />
            </Suspense>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/board/my"
              className="text-xs tracking-[0.15em] uppercase text-stone-500 border border-stone-200 rounded-full px-4 py-2 hover:border-stone-400 hover:text-stone-700 transition-colors"
            >
              내가 쓴 글
            </Link>
          )}
          <AuthGatedLink
            href="/board/write"
            className="text-xs tracking-[0.15em] uppercase text-stone-900 border border-stone-300 rounded-full px-4 py-2 hover:border-stone-700 transition-colors"
          >
            글쓰기
          </AuthGatedLink>
        </div>
      </div>

      {/* 목록 */}
      <div className="mt-10">
        {/* 컬럼 헤더 */}
        <div className="flex items-center justify-between py-3 px-3 -mx-3 border-y border-stone-200 bg-stone-50/50 text-xs tracking-wider text-stone-500 uppercase">
          <div className="flex items-center gap-4 min-w-0">
            <span className="w-5 shrink-0" />
            <span>제목</span>
          </div>
          <div className="flex items-center gap-4 shrink-0 ml-4">
            <span className="hidden sm:block w-20 text-center">작성자</span>
            <span className="w-12 text-center">업로드</span>
            <span className="hidden sm:block w-12 text-right">조회수</span>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-20">
            {q ? `"${q}" 검색 결과가 없습니다.` : '아직 게시글이 없습니다.'}
          </p>
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
                    <span className="text-xs text-stone-300 w-5 text-right shrink-0">{i + 1}</span>
                    <span className="text-sm text-stone-800 group-hover:text-stone-600 transition-colors truncate">
                      {post.title}
                    </span>
                    {commentCount > 0 && (
                      <span className="text-xs text-stone-400 shrink-0">[{commentCount}]</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-xs text-stone-400 hidden sm:block w-20 text-center truncate">{post.profile?.username ?? '-'}</span>
                    <span className="text-xs text-stone-300 w-12 text-center tabular-nums">
                      {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                    </span>
                    <span className="text-xs text-stone-300 hidden sm:block w-12 text-right tabular-nums">{post.view_count}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
