export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string
          bio?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          caption: string | null
          like_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          caption?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          updated_at?: string
        }
      }
      post_images: {
        Row: {
          id: string
          post_id: string
          url: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          url: string
          position?: number
          created_at?: string
        }
        Update: {
          url?: string
          position?: number
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          parent_id: string | null
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          parent_id?: string | null
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: never
      }
      bookmarks: {
        Row: {
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: never
      }
    }
  }
}
