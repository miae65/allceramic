import { HeroSection } from '@/components/feed/HeroSection'
import { FeedGrid } from '@/components/feed/FeedGrid'
import { NoticeModal } from '@/components/feed/NoticeModal'
import { createClient } from '@/lib/supabase/server'
import type { Post, Notice } from '@/types'

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

async function fetchLatestNotice(): Promise<Notice | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('notices')
    .select('id, title, content, is_published, created_at, updated_at, author_id')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(1)
  const rows = (data ?? []) as Notice[]
  return rows[0] ?? null
}

async function recordVisit() {
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('record_visit')
  } catch (e) {
    console.error('[record_visit]', e)
  }
}

export default async function HomePage() {
  const [posts, notice] = await Promise.all([fetchPosts(), fetchLatestNotice(), recordVisit()])

  return (
    <div>
      <HeroSection />
      <FeedGrid posts={posts} columns={4} label="게시물" emptyMessage="아직 게시물이 없습니다" />
      <NoticeModal notice={notice} />
    </div>
  )
}
