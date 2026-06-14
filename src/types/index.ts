export type Profile = {
  id: string
  username: string
  bio: string | null
  avatar_url: string | null
  upload_blocked?: boolean
  created_at: string
  updated_at: string
}

export type PostImage = {
  id: string
  post_id: string
  url: string
  position: number
  created_at: string
}

export type Post = {
  id: string
  user_id: string
  caption: string | null
  like_count: number
  video_url?: string | null
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
  images?: PostImage[]
  is_liked?: boolean
  is_bookmarked?: boolean
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
  replies?: Comment[]
}

export type InquiryStatus = 'pending' | 'in_progress' | 'resolved'

export type Inquiry = {
  id: string
  user_id: string
  subject: string
  content: string
  status: InquiryStatus
  admin_reply: string | null
  replied_at: string | null
  reply_seen_at: string | null
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
}

export type Notice = {
  id: string
  author_id: string
  title: string
  content: string
  is_published: boolean
  created_at: string
  updated_at: string
  // joined
  author?: Profile
}

export type BoardPost = {
  id: string
  user_id: string
  title: string
  content: string
  view_count: number
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
  comment_count?: number
}

export type BoardComment = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
}

export type InfoPost = {
  id: string
  user_id: string
  title: string
  content: string
  view_count: number
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
  comment_count?: number
}

export type InfoComment = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
}

export type JobKind = 'hiring' | 'seeking'

export type JobPost = {
  id: string
  user_id: string
  kind: JobKind
  title: string
  position: string
  region: string
  work_type: string
  contact: string
  content: string
  // 구인 전용
  company_name: string | null
  salary: string | null
  experience_required: string | null
  deadline: string | null
  // 구직 전용
  experience: string | null
  portfolio_url: string | null
  available_from: string | null
  view_count: number
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
}

export type JobComment = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
}

export type SiteSettings = {
  id: number
  site_name: string
  contact_email: string | null
  sns_links: Record<string, string>
  hero_image_url: string | null
  hero_title: string
  hero_subtitle: string
  hero_object_position: string
  hero_scale: number
  hero_mobile_image_url: string | null
  hero_mobile_object_position: string
  hero_mobile_scale: number
  updated_at: string
}
