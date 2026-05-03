import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { FeedGrid } from '@/components/feed/FeedGrid'
import type { Post, Profile } from '@/types'

// --- mock data ---
function getMockProfile(username: string): Profile {
  return {
    id: 'user-1',
    username,
    bio: '고령토와 불의 대화를 담습니다. 서울 / 환원염 전공.',
    avatar_url: null,
    created_at: '',
    updated_at: '',
  }
}

function getMockPosts(userId: string): Post[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `post-${i + 1}`,
    user_id: userId,
    caption: i === 0 ? '첫 작품' : null,
    like_count: Math.floor(Math.random() * 200) + 5,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: `img-${i}`, post_id: `post-${i + 1}`, url: '', position: 0, created_at: '' }],
  }))
}

/*
 * Supabase 연결 후 교체:
 *
 * async function fetchProfile(username: string) {
 *   const supabase = await createClient()
 *   const { data: profile } = await supabase
 *     .from('profiles')
 *     .select('*')
 *     .eq('username', username)
 *     .single()
 *
 *   const { data: posts } = await supabase
 *     .from('posts')
 *     .select('*, images:post_images(*)')
 *     .eq('user_id', profile.id)
 *     .order('created_at', { ascending: false })
 *
 *   return { profile, posts: posts ?? [] }
 * }
 */

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = getMockProfile(username)
  const posts = getMockPosts(profile.id)

  // TODO: 로그인 유저와 비교해 isOwn 판별
  // const { data: { user } } = await (await createClient()).auth.getUser()
  // const isOwn = user?.id === profile.id
  const isOwn = false

  return (
    <div>
      <div className="max-w-5xl mx-auto px-6">
        <ProfileHeader
          profile={profile}
          postCount={posts.length}
          isOwn={isOwn}
        />

        <div className="border-t border-stone-100" />
      </div>

      <FeedGrid posts={posts} label="Works" />
    </div>
  )
}
