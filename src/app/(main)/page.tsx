import { HeroSection } from '@/components/feed/HeroSection'
import { FeedGrid } from '@/components/feed/FeedGrid'
import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/types'

async function fetchPosts(): Promise<Post[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('posts')
    .select('*, profile:profiles!posts_user_id_fkey(*), images:post_images(*)')
    .order('created_at', { ascending: false })

  const posts = (data ?? []) as Post[]
  posts.forEach(p => p.images?.sort((a, b) => a.position - b.position))
  return posts
}

export default async function HomePage() {
  const posts = await fetchPosts()

  return (
    <div>
      <HeroSection />
      <FeedGrid posts={posts} columns={4} label="게시물" emptyMessage="아직 게시물이 없습니다" />
    </div>
  )
}
