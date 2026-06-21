import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeftIcon } from '@/components/ui/icons'
import { ExhibitionCommentSection } from '@/components/exhibition/ExhibitionCommentSection'
import { ExhibitionPostActions } from '@/components/exhibition/ExhibitionPostActions'
import type { ExhibitionPost, ExhibitionComment } from '@/types'
import { isAdmin } from '@/lib/admin'
import { exhibitionStatus, formatPeriod } from '@/lib/exhibition'

async function fetchPost(id: string): Promise<ExhibitionPost | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('exhibition_posts')
    .select('*, profile:profiles!exhibition_posts_user_id_fkey(id, username, avatar_url)')
    .eq('id', id)
    .maybeSingle()
  return (data as ExhibitionPost) ?? null
}

async function fetchComments(postId: string): Promise<ExhibitionComment[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('exhibition_comments')
    .select('*, profile:profiles!exhibition_comments_user_id_fkey(id, username, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  return (data ?? []) as ExhibitionComment[]
}

async function incrementView(id: string) {
  const supabase = await createClient()
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('increment_exhibition_view', { post: id })
  } catch (e) {
    console.error('[increment_exhibition_view]', e)
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await fetchPost(id)
  if (!post) return { title: '전시를 찾을 수 없습니다' }
  const parts = [post.content.slice(0, 100).replace(/\n/g, ' ')]
  if (post.location) parts.unshift(`📍 ${post.location}`)
  const description = parts.join(' — ')
  const ogImage = post.image_urls?.[0]
  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | 전시정보`,
      description,
      url: `/exhibition/${id}`,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] }),
    },
  }
}

export default async function ExhibitionPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
        href="/exhibition"
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
            <ExhibitionPostActions postId={post.id} canEdit={canEdit} canDelete={canDelete} />
          )}
        </div>

        {/* 메타 정보 */}
        {(post.start_date || post.location || post.organizer) && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 py-6 border-b border-stone-100 text-sm">
            {(post.start_date || post.end_date) && (
              <Meta
                label="전시 기간"
                value={
                  <span className="inline-flex items-center gap-2">
                    <span>{formatPeriod(post.start_date, post.end_date)}</span>
                    <StatusBadge status={exhibitionStatus(post.start_date, post.end_date)} />
                  </span>
                }
              />
            )}
            {post.location && <Meta label="장소" value={post.location} />}
            {post.organizer && <Meta label="주최자" value={post.organizer} />}
          </dl>
        )}

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
        <ExhibitionCommentSection postId={post.id} initialComments={comments} currentUserId={user?.id ?? null} isAdminUser={isAdmin(user)} />
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="text-xs tracking-wider text-stone-400 shrink-0 w-20 pt-0.5">{label}</dt>
      <dd className="text-sm text-stone-700 min-w-0">{value}</dd>
    </div>
  )
}

function StatusBadge({ status }: { status: 'upcoming' | 'ongoing' | 'ended' | 'unknown' }) {
  if (status === 'unknown') return null
  const map = {
    upcoming: { text: '예정', cls: 'bg-sky-50 text-sky-700' },
    ongoing: { text: '진행중', cls: 'bg-emerald-50 text-emerald-700' },
    ended: { text: '종료', cls: 'bg-stone-100 text-stone-500' },
  } as const
  const { text, cls } = map[status]
  return <span className={`text-[10px] tracking-[0.1em] px-1.5 py-0.5 rounded ${cls}`}>{text}</span>
}
