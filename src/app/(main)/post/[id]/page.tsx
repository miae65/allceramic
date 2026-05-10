import Link from 'next/link'
import Image from 'next/image'
import { PostViewer } from '@/components/post/PostViewer'
import { PostActions } from '@/components/post/PostActions'
import { CommentSection } from '@/components/post/CommentSection'
import { ChevronLeftIcon } from '@/components/ui/icons'
import { MOCK_POSTS } from '@/lib/mock/posts'
import type { Comment } from '@/types'

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    post_id: '',
    user_id: 'user-2',
    parent_id: null,
    content: '정말 아름다운 작품이네요. 유약 색감이 특히 인상적입니다.',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: '',
    profile: { id: 'user-2', username: 'potter_kim', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=25', created_at: '', updated_at: '' },
    replies: [
      {
        id: 'c1-r1',
        post_id: '',
        user_id: 'user-1',
        parent_id: 'c1',
        content: '감사합니다! 환원 소성 덕분에 이런 색감이 나왔어요.',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        updated_at: '',
        profile: { id: 'user-1', username: 'ceramic.studio', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=12', created_at: '', updated_at: '' },
      },
    ],
  },
  {
    id: 'c2',
    post_id: '',
    user_id: 'user-3',
    parent_id: null,
    content: '소성 온도가 어떻게 되나요? 저도 비슷한 작업을 하고 있어서요.',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: '',
    profile: { id: 'user-3', username: 'clay_works', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=48', created_at: '', updated_at: '' },
    replies: [],
  },
  {
    id: 'c3',
    post_id: '',
    user_id: 'user-4',
    parent_id: null,
    content: '질감이 살아있네요. 손으로 만지고 싶은 느낌이 들어요.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: '',
    profile: { id: 'user-4', username: 'art_lover_j', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=36', created_at: '', updated_at: '' },
    replies: [],
  },
]

/*
 * Supabase 연결 후 교체:
 *
 * async function fetchPost(id: string) {
 *   const supabase = await createClient()
 *   const { data } = await supabase
 *     .from('posts')
 *     .select(`*, profile:profiles(*), images:post_images(*),
 *              comments(*, profile:profiles(*), replies:comments(*, profile:profiles(*)))`)
 *     .eq('id', id)
 *     .single()
 *   return data
 * }
 */

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const found = MOCK_POSTS.find(p => p.id === id)
  const post = found ?? MOCK_POSTS[0]
  const comments = MOCK_COMMENTS.map(c => ({ ...c, post_id: post.id }))

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors text-sm mb-8"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>Back</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-14 items-start">
        {/* 이미지 뷰어 (데스크탑에서 sticky) */}
        <div className="lg:sticky lg:top-24">
          <PostViewer images={post.images ?? []} />
        </div>

        {/* 우측 패널 */}
        <div>
          {/* 작성자 */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-stone-200 flex-shrink-0 overflow-hidden">
              {post.profile?.avatar_url && (
                <Image
                  src={post.profile.avatar_url}
                  alt={post.profile.username}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div>
              <Link
                href={`/profile/${post.profile?.username}`}
                className="text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors"
              >
                {post.profile?.username}
              </Link>
            </div>
          </div>

          {/* 캡션 */}
          {post.caption && (
            <p className="font-serif text-stone-700 text-[1.05rem] leading-relaxed mb-3">
              {post.caption}
            </p>
          )}

          {/* 날짜 */}
          <p className="text-xs text-stone-300 mb-1">
            {new Date(post.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>

          {/* 좋아요 / 공유 */}
          <PostActions likeCount={post.like_count} />

          {/* 댓글 */}
          <CommentSection postId={post.id} initialComments={comments} />
        </div>
      </div>
    </div>
  )
}
