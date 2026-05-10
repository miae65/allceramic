import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/ui/icons'
import { MOCK_BOARD_POSTS } from '@/lib/mock/board'

// Supabase 연결 후 로그인 유저의 글만 필터링
// 현재는 baekja_studio 작성 글을 예시로 표시
const MY_AUTHOR = 'baekja_studio'
const myPosts = MOCK_BOARD_POSTS.filter(p => p.author === MY_AUTHOR)

export default function MyBoardPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/board"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors text-sm mb-8"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>자유게시판</span>
      </Link>

      <div className="flex items-end justify-between mb-[100px]">
        <div>
          <p className="text-xs tracking-widest text-stone-400 uppercase mb-2">Community</p>
          <h1 className="font-serif text-2xl text-stone-900">내가 쓴 글</h1>
        </div>
      </div>

      {myPosts.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-20">작성한 글이 없습니다.</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {myPosts.map((post, i) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="flex items-center justify-between py-4 group hover:bg-stone-50 -mx-3 px-3 rounded transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs text-stone-300 w-5 text-right shrink-0">{myPosts.length - i}</span>
                <span className="text-sm text-stone-800 group-hover:text-stone-600 transition-colors truncate">
                  {post.title}
                </span>
                {post.comment_count > 0 && (
                  <span className="text-xs text-stone-400 shrink-0">[{post.comment_count}]</span>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-xs text-stone-300">
                  {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                </span>
                <span className="text-xs text-stone-300 hidden sm:block">{post.view_count}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
