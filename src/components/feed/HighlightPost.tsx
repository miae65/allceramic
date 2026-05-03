import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon } from '@/components/ui/icons'
import type { Post } from '@/types'

export function HighlightPost({ post }: { post: Post }) {
  const image = post.images?.[0]

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-10">Best Curation</p>

      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-16 items-start">
        {/* 이미지 */}
        <Link href={`/post/${post.id}`} className="block group">
          <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
            {image ? (
              <Image
                src={image.url}
                alt={post.caption ?? ''}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-400" />
            )}
          </div>
        </Link>

        {/* 정보 */}
        <div className="flex flex-col justify-between h-full md:pt-6">
          <div>
            {/* 작성자 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-full bg-stone-200 overflow-hidden flex-shrink-0">
                {post.profile?.avatar_url && (
                  <Image
                    src={post.profile.avatar_url}
                    alt={post.profile.username}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                )}
              </div>
              <Link
                href={`/profile/${post.profile?.username}`}
                className="text-sm text-stone-700 hover:text-stone-900 transition-colors tracking-wide"
              >
                {post.profile?.username ?? 'unknown'}
              </Link>
            </div>

            {/* 캡션 */}
            {post.caption && (
              <p className="font-serif text-stone-700 text-lg leading-relaxed">
                {post.caption}
              </p>
            )}
          </div>

          <div className="mt-10 space-y-6">
            {/* 좋아요 */}
            <div className="flex items-center gap-2 text-stone-500">
              <HeartIcon className="w-4 h-4" filled />
              <span className="text-sm tabular-nums">{post.like_count.toLocaleString()}</span>
            </div>

            {/* 보러가기 */}
            <Link
              href={`/post/${post.id}`}
              className="inline-block text-xs tracking-[0.2em] uppercase text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
            >
              View Post
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
