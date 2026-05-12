'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  userId: string
  username: string
  blocked: boolean
}

export function AdminUploadBlockToggle({ userId, username, blocked }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const toggle = async () => {
    const next = !blocked
    const msg = next
      ? `${username} 회원의 업로드를 정지하시겠어요?`
      : `${username} 회원의 업로드 정지를 해제하시겠어요?`
    if (!confirm(msg)) return

    setSaving(true)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ upload_blocked: next, updated_at: new Date().toISOString() })
        .eq('id', userId)
      if (error) throw new Error(error.message)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '변경 실패')
      setSaving(false)
    }
  }

  if (blocked) {
    return (
      <button
        onClick={toggle}
        disabled={saving}
        className="text-xs px-3 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors disabled:opacity-50"
      >
        {saving ? '처리중' : '정지중 · 해제'}
      </button>
    )
  }
  return (
    <button
      onClick={toggle}
      disabled={saving}
      className="text-xs px-3 py-1 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-50"
    >
      {saving ? '처리중' : '정상 · 정지'}
    </button>
  )
}
