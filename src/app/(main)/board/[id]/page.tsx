import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeftIcon } from '@/components/ui/icons'
import { BoardCommentSection } from '@/components/board/BoardCommentSection'
import { BoardPostActions } from '@/components/board/BoardPostActions'
import type { BoardPost, BoardComment } from '@/types'
import { isAdmin } from '@/lib/admin'

async function fetchPost(id: string): Promise<BoardPost | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('board_posts')
    .select('*, profile:profiles!board_posts_user_id_fkey(id, username, avatar_url)')
    .eq('id', id)
    .maybeSingle()
  return (data as BoardPost) ?? null
}

async function fetchComments(postId: string): Promise<BoardComment[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('board_comments')
    .select('*, profile:profiles!board_comments_user_id_fkey(id, username, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  return (data ?? []) as BoardComment[]
}

async function incrementView(id: string) {
  const supabase = await createClient()
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('increment_board_view', { post: id })
  } catch (e) {
    console.error('[increment_board_view]', e)
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await fetchPost(id)
  if (!post) return { title: '게시글을 찾을 수 없습니다' }
  const description = post.content.slice(0, 120).replace(/\n/g, ' ')
  return {
    title: post.title,
    description,
    openGraph: { title: `${post.title} | 자유게시판`, description, url: `/board/${id}` },
  }
}

export default async function BoardPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await fetchPost(id)
  if (!post) notFound()

  await incrementView(id)
  const comments = await fetchComments(id)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const canEdit = !!user && user.id === post.user_id
  const canDelete = canEdit || isAdmin(user)

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href="/board"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors text-sm mb-8"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>목록</span>
      </Link>

      <article>
        <h1 className="text-xl font-medium text-stone-900 mb-3">{post.title}</h1>
        <div className="flex items-center justify-between gap-3 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-3 text-xs text-stone-400 min-w-0">
            <Link href={`/profile/${post.profile?.username}`} className="hover:text-stone-700 transition-colors truncate">
              {post.profile?.username ?? '-'}
            </Link>
            <span>·</span>
            <span className="tabular-nums">{new Date(post.created_at).toLocaleString('ko-KR')}</span>
            <span>·</span>
            <span className="tabular-nums">조회 {post.view_count + 1}</span>
          </div>
          {(canEdit || canDelete) && (
            <BoardPostActions postId={post.id} canEdit={canEdit} canDelete={canDelete} />
          )}
        </div>

        <div className="py-6 text-sm text-stone-700 whitespace-pre-wrap leading-relaxed min-h-[120px]">
          {post.content}
        </div>
      </article>

      <div className="mt-10">
        <BoardCommentSection postId={post.id} initialComments={comments} currentUserId={user?.id ?? null} isAdminUser={isAdmin(user)} />
      </div>
    </div>
  )
}
