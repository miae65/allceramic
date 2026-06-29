import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SearchInput } from '@/components/ui/SearchInput'
import type { JobPost } from '@/types'

export const metadata: Metadata = {
  title: '구인구직',
  description: '도예 공방·브랜드 구인 및 도예인 구직 정보',
  openGraph: { title: '구인구직 | Allceramic', description: '도예 공방·브랜드 구인 및 도예인 구직 정보' },
}

type ListItem = JobPost & {
  job_comments: { count: number }[]
}

async function fetchJobs(q?: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('job_posts')
    .select(
      'id, kind, title, position, region, work_type, company_name, deadline, view_count, created_at, profile:profiles!job_posts_user_id_fkey(username), job_comments(count)'
    )
    .order('created_at', { ascending: false })
  if (q) query = query.ilike('title', `%${q}%`)
  const { data } = await query
  return (data ?? []) as ListItem[]
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const posts = await fetchJobs(q)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900">구인/구직</h1>
          <p className="text-xs text-stone-400 mt-2">세라믹 업계의 채용 정보와 구직 소식을 나누는 공간입니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <SearchInput placeholder="제목 검색" />
          </Suspense>
          <Link
            href="/jobs/my"
            className="text-xs tracking-[0.15em] uppercase text-stone-500 border border-stone-200 rounded-full px-4 py-2 hover:border-stone-400 hover:text-stone-700 transition-colors"
          >
            내가 쓴 글
          </Link>
          <Link
            href="/jobs/write"
            className="text-xs tracking-[0.15em] uppercase text-stone-900 border border-stone-300 rounded-full px-4 py-2 hover:border-stone-700 transition-colors"
          >
            글쓰기
          </Link>
        </div>
      </div>

      <div className="mt-10">
        {/* 컬럼 헤더 */}
        <div className="flex items-center justify-between py-3 px-3 -mx-3 border-y border-stone-200 bg-stone-50/50 text-xs tracking-wider text-stone-500 uppercase">
          <div className="flex items-center gap-4 min-w-0">
            <span className="w-5 shrink-0" />
            <span>제목</span>
          </div>
          <div className="flex items-center gap-4 shrink-0 ml-4">
            <span className="hidden sm:block w-20 text-center">지역</span>
            <span className="hidden md:block w-20 text-center">근무형태</span>
            <span className="w-12 text-center">마감일</span>
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
              return (
                <Link
                  key={post.id}
                  href={`/jobs/${post.id}`}
                  className="flex items-center justify-between py-4 group hover:bg-stone-50 -mx-3 px-3 rounded transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs text-stone-300 w-5 text-right shrink-0">{posts.length - i}</span>
                    <span className="text-sm text-stone-800 group-hover:text-stone-600 transition-colors truncate">
                      {post.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-xs text-stone-400 hidden sm:block w-20 text-center truncate">{post.region}</span>
                    <span className="text-xs text-stone-400 hidden md:block w-20 text-center truncate">{post.work_type}</span>
                    <span className="text-xs text-stone-500 w-12 text-center tabular-nums">
                      {post.deadline
                        ? new Date(post.deadline).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
                        : '-'}
                    </span>
                    <span className="text-xs text-stone-500 hidden sm:block w-12 text-right tabular-nums">{post.view_count}</span>
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
