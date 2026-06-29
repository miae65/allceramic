import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SearchInput } from '@/components/ui/SearchInput'
import type { InfoPost } from '@/types'

export const metadata: Metadata = {
  title: '정보게시판',
  description: '도예 관련 정보와 팁을 공유하는 게시판',
  openGraph: { title: '정보게시판 | Allceramic', description: '도예 관련 정보와 팁을 공유하는 게시판' },
}

async function fetchInfoPosts(q?: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('info_posts')
    .select('id, title, view_count, created_at, profile:profiles!info_posts_user_id_fkey(username), info_comments(count)')
    .order('created_at', { ascending: false })
  if (q) query = query.ilike('title', `%${q}%`)
  const { data } = await query
  return (data ?? []) as Array<InfoPost & { info_comments: { count: number }[] }>
}

export default async function InfoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const posts = await fetchInfoPosts(q)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900">중고거래</h1>
          <p className="text-xs text-stone-400 mt-2">세라믹 작품·도구·재료를 거래하는 공간입니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <SearchInput placeholder="제목 검색" />
          </Suspense>
          <Link
            href="/info/my"
            className="text-xs tracking-[0.15em] uppercase text-stone-500 border border-stone-200 rounded-full px-4 py-2 hover:border-stone-400 hover:text-stone-700 transition-colors"
          >
            내가 쓴 글
          </Link>
          <Link
            href="/info/write"
            className="text-xs tracking-[0.15em] uppercase text-stone-900 border border-stone-300 rounded-full px-4 py-2 hover:border-stone-700 transition-colors"
          >
            글쓰기
          </Link>
        </div>
      </div>

      <div className="mt-10">
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
              const commentCount = post.info_comments?.[0]?.count ?? 0
              return (
                <Link
                  key={post.id}
                  href={`/info/${post.id}`}
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
    </div>
  )
}
