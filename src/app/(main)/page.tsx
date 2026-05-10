import { HeroSection } from '@/components/feed/HeroSection'
import { HighlightPost } from '@/components/feed/HighlightPost'
import { FeedGrid } from '@/components/feed/FeedGrid'
import { MOCK_POSTS } from '@/lib/mock/posts'

/*
 * Supabase 연결 후 이 함수로 교체:
 *
 * async function fetchPosts() {
 *   const supabase = await createClient()
 *   const { data } = await supabase
 *     .from('posts')
 *     .select('*, profile:profiles(*), images:post_images(*)')
 *     .order('created_at', { ascending: false })
 *   return data ?? []
 * }
 */

export default async function HomePage() {
  const posts = MOCK_POSTS
  const highlight = [...posts].sort((a, b) => b.like_count - a.like_count)[0]

  return (
    <div>
      <HeroSection />
      {highlight && <HighlightPost post={highlight} />}
      <FeedGrid posts={posts} columns={4} label="게시물" />
    </div>
  )
}
