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
  // 업로드 허용 = on (blocked의 반대)
  const on = !blocked

  const toggle = async () => {
    const nextBlocked = on // on→off로 토글 = 차단으로 변경
    const msg = nextBlocked
      ? `${username} 회원의 업로드를 정지하시겠어요?`
      : `${username} 회원의 업로드 정지를 해제하시겠어요?`
    if (!confirm(msg)) return

    setSaving(true)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ upload_blocked: nextBlocked, updated_at: new Date().toISOString() })
        .eq('id', userId)
      if (error) throw new Error(error.message)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '변경 실패')
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`${username} 업로드 ${on ? '허용' : '정지'}`}
        onClick={toggle}
        disabled={saving}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
          on ? 'bg-emerald-500' : 'bg-stone-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
      <span className={`text-xs tabular-nums ${on ? 'text-emerald-600' : 'text-stone-400'}`}>
        {saving ? '...' : on ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}
