import Link from 'next/link'
import type { Post } from '@/types'

export function FeedList({ posts, emptyMessage }: { posts: Post[]; emptyMessage?: string }) {
  if (posts.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-stone-400 text-sm tracking-widest uppercase">
          {emptyMessage ?? 'No posts yet'}
        </p>
      </section>
    )
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-sm tracking-widest text-stone-400 uppercase mb-10">
        게시물 <span className="tabular-nums normal-case tracking-normal text-stone-500 ml-1">{posts.length}</span>
      </p>

      {/* 컬럼 헤더 */}
      <div className="flex items-center justify-between py-3 px-3 -mx-3 border-y border-stone-200 bg-stone-50/50 text-xs tracking-wider text-stone-500 uppercase">
        <div className="flex items-center gap-4 min-w-0">
          <span className="w-5 shrink-0" />
          <span>제목</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="hidden sm:block w-20 text-center">작성자</span>
          <span className="w-12 text-center">업로드</span>
          <span className="hidden sm:block w-12 text-right">좋아요</span>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="flex items-center justify-between py-4 group hover:bg-stone-50 -mx-3 px-3 rounded transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-xs text-stone-300 w-5 text-right shrink-0 tabular-nums">{posts.length - i}</span>
              <span className="text-sm text-stone-800 group-hover:text-stone-600 transition-colors truncate">
                {post.caption ?? <span className="text-stone-400 italic">캡션 없음</span>}
              </span>
              {post.images && post.images.length > 1 && (
                <span className="text-xs text-stone-400 shrink-0">[{post.images.length}]</span>
              )}
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <span className="text-xs text-stone-400 hidden sm:block w-20 text-center truncate">
                {post.profile?.username ?? '-'}
              </span>
              <span className="text-xs text-stone-300 w-12 text-center tabular-nums">
                {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
              </span>
              <span className="text-xs text-stone-300 hidden sm:block w-12 text-right tabular-nums">
                {post.like_count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
