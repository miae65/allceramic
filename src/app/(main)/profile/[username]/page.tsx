import { createClient } from '@/lib/supabase/server'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { FeedGrid } from '@/components/feed/FeedGrid'
import { StickyAdBanner } from '@/components/ui/StickyAdBanner'
import type { Post, Profile } from '@/types'

async function fetchProfile(username: string): Promise<{ profile: Profile; posts: Post[] } | null> {
  const supabase = await createClient()

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profileRow) return null

  const profile = profileRow as Profile

  const { data: postsRaw } = await supabase
    .from('posts')
    .select('*, images:post_images(*)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  const posts = (postsRaw ?? []) as Post[]
  posts.forEach(p => p.images?.sort((a, b) => a.position - b.position))
  return { profile, posts }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  // 현재 로그인 유저
  const { data: { user } } = await supabase.auth.getUser()

  // 실제 프로필 데이터 시도
  const data = await fetchProfile(username)

  // 프로필이 없으면 (아직 DB 없는 mock 유저) → 로그인 유저 데이터로 fallback
  let profile: Profile
  let posts: Post[]
  let isOwn = false

  if (data) {
    profile = data.profile
    posts = data.posts
    isOwn = user?.id === profile.id

    // 로그인 유저의 Google 아바타가 있으면 프로필에 반영
    if (isOwn && user) {
      const googleAvatar: string | undefined = user.user_metadata?.avatar_url ?? user.user_metadata?.picture
      if (googleAvatar) {
        if (!profile.avatar_url) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('profiles') as any).update({ avatar_url: googleAvatar }).eq('id', user.id)
        }
        profile = { ...profile, avatar_url: googleAvatar }
      }
    }
  } else {
    // mock fallback (구 목업 유저)
    profile = {
      id: 'mock',
      username,
      bio: '고령토와 불의 대화를 담습니다.',
      avatar_url: 'https://i.pravatar.cc/150?img=7',
      created_at: '',
      updated_at: '',
    }
    posts = []
    isOwn = false
  }

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
        <FeedGrid posts={posts} label="게시물" />
      </div>
      <StickyAdBanner />
    </>
  )
}
