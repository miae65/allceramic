import type { User } from '@supabase/supabase-js'

export const ADMIN_EMAILS = ['dlaldo0605@gmail.com'] as const

export function isAdmin(user: User | null | undefined): boolean {
  if (!user?.email) return false
  return (ADMIN_EMAILS as readonly string[]).includes(user.email)
}
