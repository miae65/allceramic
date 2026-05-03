import { HeroSection } from '@/components/feed/HeroSection'
import { HighlightPost } from '@/components/feed/HighlightPost'
import { FeedGrid } from '@/components/feed/FeedGrid'
import type { Post } from '@/types'

const Q = '?w=600&h=800&fit=crop&crop=center&q=80'
const U = 'https://images.unsplash.com/photo-'

// --- mock data ---
const MOCK_POSTS: Post[] = [
  // 백자 (White Porcelain)
  {
    id: 'post-1',
    user_id: 'u1',
    caption: '백자 달항아리 — 순백의 흙과 재유약으로 완성한 작품입니다.',
    like_count: 214,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u1', username: 'baekja_studio', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i1-1', post_id: 'post-1', url: `${U}1565193566173-7a0ee3dbe261${Q}`, position: 0, created_at: '' },
      { id: 'i1-2', post_id: 'post-1', url: `${U}1613547351929-e6b69a8ba8f7${Q}`, position: 1, created_at: '' },
    ],
  },
  {
    id: 'post-2',
    user_id: 'u2',
    caption: '백자 제기 — 조선시대 형태에서 영감을 받았습니다.',
    like_count: 98,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u2', username: 'white_ware', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i2-1', post_id: 'post-2', url: `${U}1578749556568-bc2c40e68b61${Q}`, position: 0, created_at: '' },
    ],
  },
  {
    id: 'post-3',
    user_id: 'u3',
    caption: null,
    like_count: 176,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u3', username: 'porcelain_lab', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i3-1', post_id: 'post-3', url: `${U}1610701596061-2ecf227e85b2${Q}`, position: 0, created_at: '' },
    ],
  },

  // 청자 (Celadon)
  {
    id: 'post-4',
    user_id: 'u4',
    caption: '고려청자 — 천년의 비색을 현대적으로 재해석했습니다.',
    like_count: 301,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u4', username: 'celadon_kr', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i4-1', post_id: 'post-4', url: `${U}1526762068844-8c91c784bac5${Q}`, position: 0, created_at: '' },
      { id: 'i4-2', post_id: 'post-4', url: `${U}1584905066893-7d5c142ba4e1${Q}`, position: 1, created_at: '' },
    ],
  },
  {
    id: 'post-5',
    user_id: 'u5',
    caption: '청자 상감 국화문 — 전통 상감 기법으로 완성했습니다.',
    like_count: 143,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u5', username: 'bisaek', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i5-1', post_id: 'post-5', url: `${U}1607619056574-7b8d3ee536b2${Q}`, position: 0, created_at: '' },
    ],
  },
  {
    id: 'post-6',
    user_id: 'u6',
    caption: null,
    like_count: 89,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u6', username: 'jade_kiln', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i6-1', post_id: 'post-6', url: `${U}1595436708082-8cc6a3af98ab${Q}`, position: 0, created_at: '' },
    ],
  },

  // 옹기 (Earthenware)
  {
    id: 'post-7',
    user_id: 'u7',
    caption: '옹기 항아리 — 자연 유약과 장작 가마로 완성한 작품입니다.',
    like_count: 258,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u7', username: 'onggi_works', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i7-1', post_id: 'post-7', url: `${U}1515777315835-281b4c36ba81${Q}`, position: 0, created_at: '' },
      { id: 'i7-2', post_id: 'post-7', url: `${U}1508700929628-666bc8bd84ea${Q}`, position: 1, created_at: '' },
      { id: 'i7-3', post_id: 'post-7', url: `${U}1586023492125-27b2c045efd7${Q}`, position: 2, created_at: '' },
    ],
  },
  {
    id: 'post-8',
    user_id: 'u8',
    caption: '간장 독 — 전통 방식으로 성형·소성한 생활 옹기입니다.',
    like_count: 112,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u8', username: 'earthen_jar', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i8-1', post_id: 'post-8', url: `${U}1543886024-ab8baad6b2ac${Q}`, position: 0, created_at: '' },
    ],
  },
  {
    id: 'post-9',
    user_id: 'u9',
    caption: null,
    like_count: 67,
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u9', username: 'clay_fire', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i9-1', post_id: 'post-9', url: `${U}1596040033229-a9821ebd058d${Q}`, position: 0, created_at: '' },
    ],
  },

  // 분청·현대도예
  {
    id: 'post-10',
    user_id: 'u10',
    caption: '분청사기 — 귀얄 기법으로 표면을 거칠게 표현했습니다.',
    like_count: 189,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u10', username: 'buncheong', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i10-1', post_id: 'post-10', url: `${U}1580974852861-c381510bc98a${Q}`, position: 0, created_at: '' },
    ],
  },
  {
    id: 'post-11',
    user_id: 'u11',
    caption: '현대도예 — 산화 소성으로 얻은 예측 불가능한 색감입니다.',
    like_count: 134,
    created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u11', username: 'modern_clay', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i11-1', post_id: 'post-11', url: `${U}1614364495-d5c7bcbf9d5c${Q}`, position: 0, created_at: '' },
      { id: 'i11-2', post_id: 'post-11', url: `${U}1612196808214-58c61b8f1b25${Q}`, position: 1, created_at: '' },
    ],
  },
  {
    id: 'post-12',
    user_id: 'u12',
    caption: null,
    like_count: 77,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u12', username: 'kiln_form', bio: null, avatar_url: null, created_at: '', updated_at: '' },
    images: [
      { id: 'i12-1', post_id: 'post-12', url: `${U}1600699034134-c95d2b1da6d8${Q}`, position: 0, created_at: '' },
    ],
  },
]

/*
 * Supabase 연결 후 이 함수로 교체:
 *
 * async function fetchPosts(): Promise<Post[]> {
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
      <FeedGrid posts={posts} columns={4} />
    </div>
  )
}
