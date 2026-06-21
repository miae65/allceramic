import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeftIcon } from '@/components/ui/icons'
import { InfoCommentSection } from '@/components/info/InfoCommentSection'
import { InfoPostActions } from '@/components/info/InfoPostActions'
import type { InfoPost, InfoComment } from '@/types'
import { isAdmin } from '@/lib/admin'

async function fetchPost(id: string): Promise<InfoPost | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('info_posts')
    .select('*, profile:profiles!info_posts_user_id_fkey(id, username, avatar_url)')
    .eq('id', id)
    .maybeSingle()
  return (data as InfoPost) ?? null
}

async function fetchComments(postId: string): Promise<InfoComment[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('info_comments')
    .select('*, profile:profiles!info_comments_user_id_fkey(id, username, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  return (data ?? []) as InfoComment[]
}

async function incrementView(id: string) {
  const supabase = await createClient()
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('increment_info_view', { post: id })
  } catch (e) {
    console.error('[increment_info_view]', e)
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await fetchPost(id)
  if (!post) return { title: '게시글을 찾을 수 없습니다' }
  const description = post.content.slice(0, 120).replace(/\n/g, ' ')
  const ogImage = post.image_urls?.[0]
  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | 정보게시판`,
      description,
      url: `/info/${id}`,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] }),
    },
  }
}

export default async function InfoPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
        href="/info"
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
            <span className="tabular-nums">
              {new Date(post.created_at)
                .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
                .replace(/\.$/, '')}
            </span>
            <span>·</span>
            <span className="tabular-nums">조회 {post.view_count + 1}</span>
          </div>
          {(canEdit || canDelete) && (
            <InfoPostActions postId={post.id} canEdit={canEdit} canDelete={canDelete} />
          )}
        </div>

        <div className="py-6 text-sm text-stone-700 whitespace-pre-wrap leading-relaxed min-h-[120px]">
          {post.content}
        </div>

        {post.image_urls && post.image_urls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-6">
            {post.image_urls.map((url, i) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden">
                <Image src={url} alt={`첨부 이미지 ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 33vw" unoptimized className="object-cover hover:opacity-90 transition-opacity" />
              </a>
            ))}
          </div>
        )}
      </article>

      <div className="mt-10">
        <InfoCommentSection postId={post.id} initialComments={comments} currentUserId={user?.id ?? null} isAdminUser={isAdmin(user)} />
      </div>
    </div>
  )
}
