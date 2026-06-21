import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { FeedGrid } from '@/components/feed/FeedGrid'
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

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from('profiles').select('bio, avatar_url').eq('username', username).single()
  const row = data as { bio?: string; avatar_url?: string } | null
  const description = row?.bio ?? `${username}의 도예 작품 모음`
  return {
    title: `${username}의 프로필`,
    description,
    openGraph: {
      title: `${username} | Allceramic`,
      description,
      url: `/profile/${username}`,
      ...(row?.avatar_url && { images: [{ url: row.avatar_url, width: 400, height: 400, alt: username }] }),
    },
  }
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

    // 본인 프로필에 아바타가 없고 Google 아바타가 있으면 최초 1회 동기화
    if (isOwn && user && !profile.avatar_url) {
      const googleAvatar: string | undefined = user.user_metadata?.avatar_url ?? user.user_metadata?.picture
      if (googleAvatar) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('profiles') as any).update({ avatar_url: googleAvatar }).eq('id', user.id)
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

  let isFavorited = false
  if (user && !isOwn && profile.id !== 'mock') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: favRow } = await (supabase as any)
      .from('user_favorites')
      .select('favorite_id')
      .eq('user_id', user.id)
      .eq('favorite_id', profile.id)
      .maybeSingle()
    isFavorited = !!favRow
  }

  return (
    <div className="pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <ProfileHeader
          profile={profile}
          isOwn={isOwn}
          isFavorited={isFavorited}
        />
        <div className="border-t border-stone-100" />
      </div>
      <FeedGrid posts={posts} label="게시물" />
    </div>
  )
}
