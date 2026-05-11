import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PostViewer } from '@/components/post/PostViewer'
import { PostActions } from '@/components/post/PostActions'
import { CommentSection } from '@/components/post/CommentSection'
import { DeletePostButton } from '@/components/post/DeletePostButton'
import { ChevronLeftIcon } from '@/components/ui/icons'
import { createClient } from '@/lib/supabase/server'
import type { Post, Comment } from '@/types'

function extractStoragePath(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/public\/post-images\/(.+)$/)
  return match ? match[1] : null
}

async function fetchPost(id: string): Promise<Post | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('posts')
    .select('*, profile:profiles!posts_user_id_fkey(*), images:post_images(*)')
    .eq('id', id)
    .single()
  if (!data) return null
  const post = data as Post
  if (post.images) post.images.sort((a, b) => a.position - b.position)
  return post
}

async function fetchComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('comments')
    .select('*, profile:profiles!comments_user_id_fkey(*)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  const all = (data ?? []) as Comment[]
  const topLevel = all.filter(c => !c.parent_id).map(c => ({ ...c, replies: [] as Comment[] }))
  const byParent = new Map(topLevel.map(c => [c.id, c]))
  for (const c of all) {
    if (c.parent_id && byParent.has(c.parent_id)) {
      byParent.get(c.parent_id)!.replies!.push(c)
    }
  }
  return topLevel
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await fetchPost(id)
  if (!post) notFound()

  const comments = await fetchComments(id)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwn = !!user && user.id === post.user_id
  const imagePaths = (post.images ?? [])
    .map(img => extractStoragePath(img.url))
    .filter((p): p is string => p !== null)
  const redirectTo = post.profile?.username ? `/profile/${post.profile.username}` : '/'

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

          {/* 본인 글 삭제 */}
          {isOwn && (
            <DeletePostButton
              postId={post.id}
              ownerId={post.user_id}
              imagePaths={imagePaths}
              redirectTo={redirectTo}
            />
          )}

          {/* 댓글 */}
          <CommentSection postId={post.id} initialComments={comments} />
        </div>
      </div>
    </div>
  )
}
