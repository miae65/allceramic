export type BoardPost = {
  id: string
  title: string
  content: string
  author: string
  avatar_url: string
  created_at: string
  comment_count: number
  view_count: number
  comments: BoardComment[]
}

export type BoardComment = {
  id: string
  author: string
  avatar_url: string
  content: string
  created_at: string
}

export const MOCK_BOARD_POSTS: BoardPost[] = []
