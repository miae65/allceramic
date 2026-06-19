import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { exhibitionStatus, formatPeriod, type ExhibitionStatus } from '@/lib/exhibition'
import type { ExhibitionPost } from '@/types'

type ListItem = ExhibitionPost & { exhibition_comments: { count: number }[] }

async function fetchPosts() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('exhibition_posts')
    .select(
      'id, title, image_urls, start_date, end_date, location, organizer, view_count, created_at, profile:profiles!exhibition_posts_user_id_fkey(username), exhibition_comments(count)'
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
        <div className="flex items-center gap-3">
          <Link
            href="/exhibition/my"
            className="text-xs tracking-[0.15em] uppercase text-stone-500 border border-stone-200 rounded-full px-4 py-2 hover:border-stone-400 hover:text-stone-700 transition-colors"
          >
            내가 쓴 글
          </Link>
          <Link
            href="/exhibition/write"
            className="text-xs tracking-[0.15em] uppercase text-stone-900 border border-stone-300 rounded-full px-4 py-2 hover:border-stone-700 transition-colors"
          >
            글쓰기
          </Link>
        </div>
      </div>

      <div className="mt-10">
        {posts.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-20">아직 등록된 전시가 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  return (
    <li>
      <Link
        href={`/exhibition/${post.id}`}
        className="group block bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all"
      >
        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
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
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
          <p className="text-xs text-stone-500 tabular-nums">
            {formatPeriod(post.start_date, post.end_date)}
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
