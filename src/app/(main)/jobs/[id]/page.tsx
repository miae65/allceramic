import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeftIcon } from '@/components/ui/icons'
import { JobCommentSection } from '@/components/jobs/JobCommentSection'
import { JobPostActions } from '@/components/jobs/JobPostActions'
import type { JobPost, JobComment } from '@/types'
import { isAdmin } from '@/lib/admin'

async function fetchPost(id: string): Promise<JobPost | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('job_posts')
    .select('*, profile:profiles!job_posts_user_id_fkey(id, username, avatar_url)')
    .eq('id', id)
    .maybeSingle()
  return (data as JobPost) ?? null
}

async function fetchComments(postId: string): Promise<JobComment[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('job_comments')
    .select('*, profile:profiles!job_comments_user_id_fkey(id, username, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  return (data ?? []) as JobComment[]
}

async function incrementView(id: string) {
  const supabase = await createClient()
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('increment_job_view', { post: id })
  } catch (e) {
    console.error('[increment_job_view]', e)
  }
}

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await fetchPost(id)
  if (!post) return { title: '공고를 찾을 수 없습니다' }
  const label = post.kind === 'hiring' ? '구인' : '구직'
  const parts = [`[${label}] ${post.position}`, post.region, post.content.slice(0, 80).replace(/\n/g, ' ')].filter(Boolean)
  const description = parts.join(' · ')
  return {
    title: post.title,
    description,
    openGraph: { title: `${post.title} | 구인구직`, description, url: `/jobs/${id}` },
  }
}

export default async function JobPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await fetchPost(id)
  if (!post) notFound()

  await incrementView(id)
  const comments = await fetchComments(id)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const canEdit = !!user && user.id === post.user_id
  const canDelete = canEdit || isAdmin(user)

  const isHiring = post.kind === 'hiring'

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors text-sm mb-8"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>구인/구직 목록</span>
      </Link>

      <article>
        <h1 className="text-xl font-medium text-stone-900 mb-3">{post.title}</h1>
        <div className="flex items-center justify-between gap-3 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-3 text-xs text-stone-400 min-w-0 flex-wrap">
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
            <JobPostActions postId={post.id} canEdit={canEdit} canDelete={canDelete} />
          )}
        </div>

        {/* 메타 정보 */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 py-6 border-b border-stone-100 text-sm">
          {isHiring && post.company_name && <Meta label="공방/브랜드" value={post.company_name} />}
          <Meta label={isHiring ? '직무' : '희망 직무'} value={post.position} />
          <Meta label={isHiring ? '지역' : '희망 지역'} value={post.region} />
          <Meta label={isHiring ? '근무 형태' : '근무 가능 형태'} value={post.work_type} />
          {isHiring && post.salary && <Meta label="급여" value={post.salary} />}
          {isHiring && post.experience_required && <Meta label="경력 조건" value={post.experience_required} />}
          {isHiring && <Meta label="마감일" value={post.deadline ? formatDate(post.deadline)! : '상시모집'} />}
          {!isHiring && post.experience && <Meta label="경력" value={post.experience} />}
          {!isHiring && post.available_from && <Meta label="가능 시작일" value={formatDate(post.available_from)!} />}
          {!isHiring && post.portfolio_url && (
            <Meta
              label="포트폴리오"
              value={
                <a
                  href={post.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-700 hover:text-stone-900 underline underline-offset-2 break-all"
                >
                  {post.portfolio_url}
                </a>
              }
            />
          )}
          <Meta label="연락처" value={post.contact} />
        </dl>

        <div className="py-6 text-sm text-stone-700 whitespace-pre-wrap leading-relaxed min-h-[120px]">
          {post.content}
        </div>
      </article>

      <div className="mt-10">
        <JobCommentSection
          postId={post.id}
          initialComments={comments}
          currentUserId={user?.id ?? null}
          isAdminUser={isAdmin(user)}
        />
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
