import { FeedCard } from './FeedCard'
import type { Post } from '@/types'

type Props = {
  posts: Post[]
  label?: string
  emptyMessage?: string
  columns?: 3 | 4
}

const colClass = {
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
} as const

export function FeedGrid({ posts, label = 'All Works', emptyMessage, columns = 3 }: Props) {
  if (posts.length === 0) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-stone-400 text-sm tracking-widest uppercase">
          {emptyMessage ?? 'No posts yet'}
        </p>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-10">{label}</p>
      <div className={`grid gap-2 ${colClass[columns]}`}>
        {posts.map(post => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
