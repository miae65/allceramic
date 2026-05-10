import type { Post } from '@/types'

const Q = '?w=600&h=800&fit=crop&crop=center&q=80'
const U = 'https://images.unsplash.com/photo-'

export const MOCK_POSTS: Post[] = [
  // 백자 (White Porcelain)
  {
    id: 'post-1',
    user_id: 'u1',
    caption: '백자 달항아리 — 순백의 흙과 재유약으로 완성한 작품입니다.',
    like_count: 214,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u1', username: 'baekja_studio', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=1', created_at: '', updated_at: '' },
    images: [
      { id: 'i1-1', post_id: 'post-1', url: `${U}1676616579740-168d25dd2b0e${Q}`, position: 0, created_at: '' },
      { id: 'i1-2', post_id: 'post-1', url: `${U}1722925815479-9bbbc509add0${Q}`, position: 1, created_at: '' },
    ],
  },
  {
    id: 'post-2',
    user_id: 'u2',
    caption: '백자 제기 — 조선시대 형태에서 영감을 받았습니다.',
    like_count: 98,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u2', username: 'white_ware', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=15', created_at: '', updated_at: '' },
    images: [
      { id: 'i2-1', post_id: 'post-2', url: `${U}1739475837710-d74d97fdb520${Q}`, position: 0, created_at: '' },
    ],
  },
  {
    id: 'post-3',
    user_id: 'u3',
    caption: null,
    like_count: 176,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u3', username: 'porcelain_lab', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=22', created_at: '', updated_at: '' },
    images: [
      { id: 'i3-1', post_id: 'post-3', url: `${U}1660721671073-e139688fa3cf${Q}`, position: 0, created_at: '' },
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
    profile: { id: 'u4', username: 'celadon_kr', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=33', created_at: '', updated_at: '' },
    images: [
      { id: 'i4-1', post_id: 'post-4', url: `${U}1631125915902-d8abe9225ff2${Q}`, position: 0, created_at: '' },
      { id: 'i4-2', post_id: 'post-4', url: `${U}1631125915732-b98f8774f675${Q}`, position: 1, created_at: '' },
    ],
  },
  {
    id: 'post-5',
    user_id: 'u5',
    caption: '청자 상감 국화문 — 전통 상감 기법으로 완성했습니다.',
    like_count: 143,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u5', username: 'bisaek', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=5', created_at: '', updated_at: '' },
    images: [
      { id: 'i5-1', post_id: 'post-5', url: `${U}1650425801207-6c50edf1aa1a${Q}`, position: 0, created_at: '' },
    ],
  },
  {
    id: 'post-6',
    user_id: 'u6',
    caption: null,
    like_count: 89,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u6', username: 'jade_kiln', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=45', created_at: '', updated_at: '' },
    images: [
      { id: 'i6-1', post_id: 'post-6', url: `${U}1597696929736-6d13bed8e6a8${Q}`, position: 0, created_at: '' },
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
    profile: { id: 'u7', username: 'onggi_works', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=10', created_at: '', updated_at: '' },
    images: [
      { id: 'i7-1', post_id: 'post-7', url: `${U}1762781960753-f6fcbc23e913${Q}`, position: 0, created_at: '' },
      { id: 'i7-2', post_id: 'post-7', url: `${U}1773973541365-fb9fd0827db6${Q}`, position: 1, created_at: '' },
      { id: 'i7-3', post_id: 'post-7', url: `${U}1762781960741-08923e31caf4${Q}`, position: 2, created_at: '' },
    ],
  },
  {
    id: 'post-8',
    user_id: 'u8',
    caption: '간장 독 — 전통 방식으로 성형·소성한 생활 옹기입니다.',
    like_count: 112,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u8', username: 'earthen_jar', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=60', created_at: '', updated_at: '' },
    images: [
      { id: 'i8-1', post_id: 'post-8', url: `${U}1762781960299-c70b9332a9aa${Q}`, position: 0, created_at: '' },
    ],
  },
  {
    id: 'post-9',
    user_id: 'u9',
    caption: null,
    like_count: 67,
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u9', username: 'clay_fire', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=27', created_at: '', updated_at: '' },
    images: [
      { id: 'i9-1', post_id: 'post-9', url: `${U}1764059115796-46fcc9b842af${Q}`, position: 0, created_at: '' },
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
    profile: { id: 'u10', username: 'buncheong', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=38', created_at: '', updated_at: '' },
    images: [
      { id: 'i10-1', post_id: 'post-10', url: `${U}1594138352322-731eff042041${Q}`, position: 0, created_at: '' },
    ],
  },
  {
    id: 'post-11',
    user_id: 'u11',
    caption: '현대도예 — 산화 소성으로 얻은 예측 불가능한 색감입니다.',
    like_count: 134,
    created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u11', username: 'modern_clay', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=52', created_at: '', updated_at: '' },
    images: [
      { id: 'i11-1', post_id: 'post-11', url: `${U}1607556671927-78a6605e290b${Q}`, position: 0, created_at: '' },
      { id: 'i11-2', post_id: 'post-11', url: `${U}1609881583302-61548332039c${Q}`, position: 1, created_at: '' },
    ],
  },
  {
    id: 'post-12',
    user_id: 'u12',
    caption: null,
    like_count: 77,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: '',
    profile: { id: 'u12', username: 'kiln_form', bio: null, avatar_url: 'https://i.pravatar.cc/150?img=18', created_at: '', updated_at: '' },
    images: [
      { id: 'i12-1', post_id: 'post-12', url: `${U}1590605095243-072811dbe64c${Q}`, position: 0, created_at: '' },
    ],
  },
]
