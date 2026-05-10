import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { FeedGrid } from '@/components/feed/FeedGrid'
import { StickyAdBanner } from '@/components/ui/StickyAdBanner'
import { MOCK_POSTS } from '@/lib/mock/posts'
import { MOCK_BOARD_POSTS } from '@/lib/mock/board'
import type { Post, Profile } from '@/types'

const PROFILE_IMG_IDS = [
  '1635138844879-a2df56556def', '1650425801207-6c50edf1aa1a', '1762781960753-f6fcbc23e913',
  '1594138352322-731eff042041', '1607556671927-78a6605e290b', '1609881583302-61548332039c',
  '1676616579740-168d25dd2b0e', '1722925815479-9bbbc509add0', '1739475837710-d74d97fdb520',
  '1660721671073-e139688fa3cf', '1631125915902-d8abe9225ff2', '1597696929736-6d13bed8e6a8',
]

function findAvatar(username: string): string | null {
  // 피드 게시물 작성자
  const feedMatch = MOCK_POSTS.find(p => p.profile?.username === username)
  if (feedMatch?.profile?.avatar_url) return feedMatch.profile.avatar_url

  // 게시판 글 작성자
  const boardMatch = MOCK_BOARD_POSTS.find(p => p.author === username)
  if (boardMatch) return boardMatch.avatar_url

  // 게시판 댓글 작성자
  for (const post of MOCK_BOARD_POSTS) {
    const commentMatch = post.comments.find(c => c.author === username)
    if (commentMatch) return commentMatch.avatar_url
  }

  return null
}

function getMockProfile(username: string): Profile {
  const avatar = findAvatar(username)
  const feedMatch = MOCK_POSTS.find(p => p.profile?.username === username)
  return {
    id: feedMatch?.user_id ?? 'user-1',
    username,
    bio: '고령토와 불의 대화를 담습니다. 서울 / 환원염 전공.',
    avatar_url: avatar ?? 'https://i.pravatar.cc/150?img=7',
    created_at: '',
    updated_at: '',
  }
}

function getMockPosts(userId: string): Post[] {
  const Q = '?w=600&h=800&fit=crop&crop=center&q=80'
  const U = 'https://images.unsplash.com/photo-'
  return Array.from({ length: 12 }, (_, i) => ({
    id: `post-${i + 1}`,
    user_id: userId,
    caption: i === 0 ? '첫 작품' : null,
    like_count: [148, 92, 176, 63, 210, 88, 134, 55, 189, 77, 112, 41][i],
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: `img-${i}`, post_id: `post-${i + 1}`, url: `${U}${PROFILE_IMG_IDS[i]}${Q}`, position: 0, created_at: '' }],
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
    <>
      <div className="pb-20">
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
      <StickyAdBanner />
    </>
  )
}
