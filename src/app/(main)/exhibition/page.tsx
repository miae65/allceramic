import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { exhibitionStatus, formatPeriod, type ExhibitionStatus } from '@/lib/exhibition'
import type { ExhibitionPost } from '@/types'

export const metadata: Metadata = {
  title: '전시정보',
  description: '전국 도예 전시 정보를 한눈에 — 진행중·예정·종료 전시를 확인하세요',
  openGraph: { title: '전시정보 | Allceramic', description: '전국 도예 전시 정보' },
}

type ListItem = ExhibitionPost & { exhibition_comments: { count: number }[] }

async function fetchPosts() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('exhibition_posts')
    .select(
      'id, title, content, image_urls, start_date, end_date, location, organizer, view_count, created_at, profile:profiles!exhibition_posts_user_id_fkey(username), exhibition_comments(count)'
    )
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  return (data ?? []) as ListItem[]
}

export default async function ExhibitionPage() {
  const posts = await fetchPosts()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900">전시정보</h1>
          <p className="text-xs text-stone-400 mt-2">국내외 세라믹 전시 소식을 공유하는 공간입니다.</p>
        </div>
        <Link
          href="/exhibition/write"
          className="text-xs tracking-[0.15em] uppercase text-stone-900 border border-stone-300 rounded-full px-4 py-2 hover:border-stone-700 transition-colors"
        >
          글쓰기
        </Link>
      </div>

      <div className="mt-10">
        {posts.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-20">아직 등록된 전시가 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-4">
            {posts.map(post => (
              <ExhibitionCard key={post.id} post={post} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ExhibitionCard({ post }: { post: ListItem }) {
  const cover = post.image_urls?.[0] ?? null
  const status = exhibitionStatus(post.start_date, post.end_date)
  const isPermanent = !post.start_date && !post.end_date && /상설전시/.test(post.content ?? '')
  return (
    <li className="h-full">
      <Link
        href={`/exhibition/${post.id}`}
        className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all"
      >
        <div className="relative aspect-[5/4] bg-stone-100 overflow-hidden shrink-0">
          {cover ? (
            <Image
              src={cover}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200" />
          )}
          <div className="absolute top-3 left-3">
            {isPermanent ? (
              <span className="text-[10px] tracking-[0.1em] font-medium px-2 py-1 rounded bg-amber-500/90 text-white backdrop-blur-sm">
                상설전시
              </span>
            ) : (
              <StatusBadge status={status} />
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
          <p className="text-xs text-stone-500 tabular-nums">
            {isPermanent ? '상설전시' : formatPeriod(post.start_date, post.end_date)}
          </p>
          {post.location && (
            <p className="text-xs text-stone-400 mt-1 truncate">📍 {post.location}</p>
          )}
          {post.organizer && (
            <p className="text-xs text-stone-400 mt-0.5 truncate">{post.organizer}</p>
          )}
        </div>
      </Link>
    </li>
  )
}

function StatusBadge({ status }: { status: ExhibitionStatus }) {
  if (status === 'unknown') return null
  const map = {
    upcoming: { text: '예정', cls: 'bg-sky-500/90 text-white' },
    ongoing: { text: '진행중', cls: 'bg-emerald-500/90 text-white' },
    ended: { text: '종료', cls: 'bg-stone-700/80 text-white' },
  } as const
  const { text, cls } = map[status]
  return (
    <span className={`text-[10px] tracking-[0.1em] font-medium px-2 py-1 rounded ${cls} backdrop-blur-sm`}>
      {text}
    </span>
  )
}
