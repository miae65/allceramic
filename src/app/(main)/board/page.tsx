import Link from 'next/link'
import { MOCK_BOARD_POSTS } from '@/lib/mock/board'

export default function BoardPage() {
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

      {/* 헤더와 목록 사이 간격 100px */}
      <div className="mt-[100px]">
        {MOCK_BOARD_POSTS.length === 0 && (
          <p className="text-sm text-stone-400 text-center py-20">아직 게시글이 없습니다.</p>
        )}
        <div className="divide-y divide-stone-100">
          {MOCK_BOARD_POSTS.map((post, i) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="flex items-center justify-between py-4 group hover:bg-stone-50 -mx-3 px-3 rounded transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs text-stone-300 w-5 text-right shrink-0">{MOCK_BOARD_POSTS.length - i}</span>
                <span className="text-sm text-stone-800 group-hover:text-stone-600 transition-colors truncate">
                  {post.title}
                </span>
                {post.comment_count > 0 && (
                  <span className="text-xs text-stone-400 shrink-0">[{post.comment_count}]</span>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-xs text-stone-400 hidden sm:block">{post.author}</span>
                <span className="text-xs text-stone-300">
                  {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                </span>
                <span className="text-xs text-stone-300 hidden sm:block">{post.view_count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
