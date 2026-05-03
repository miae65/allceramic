'use client'

import { createClient } from '@/lib/supabase/client'
import { GoogleIcon } from '@/components/ui/icons'

export function GoogleLoginButton({ redirectTo = '/' }: { redirectTo?: string }) {
  const signIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    })
  }

  return (
    <button
      onClick={signIn}
      className="w-full flex items-center justify-center gap-3 border border-stone-200 rounded-full py-3 px-5 text-sm text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors"
    >
      <GoogleIcon className="w-5 h-5 flex-shrink-0" />
      Google로 계속하기
    </button>
  )
}
