export type Profile = {
  id: string
  username: string
  bio: string | null
  avatar_url: string | null
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

export type SiteSettings = {
  id: number
  site_name: string
  contact_email: string | null
  sns_links: Record<string, string>
  hero_image_url: string | null
  hero_title: string
  hero_subtitle: string
  updated_at: string
}
