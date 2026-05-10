import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // DB에서 실제 username 조회
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (profile?.username) {
    redirect(`/profile/${profile.username}`)
  }

  // 프로필이 없으면 이메일 기반으로 fallback
  const fallback = user.email?.split('@')[0] ?? user.id.slice(0, 8)
  redirect(`/profile/${fallback}`)
}
