'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { XMarkIcon, UserIcon } from '@/components/ui/icons'

type Props = {
  userId: string
  currentUsername?: string
  currentAvatarUrl?: string | null
  onClose: () => void
}

const USERNAME_RE = /^[a-zA-Z0-9._-]{2,30}$/

export function ProfileSettingsModal({ userId, currentUsername, currentAvatarUrl, onClose }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [username, setUsername] = useState(currentUsername ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl ?? null)
  const [originalUsername, setOriginalUsername] = useState(currentUsername ?? '')
  const [loadingProfile, setLoadingProfile] = useState(currentUsername === undefined)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // props로 안 받았으면 직접 fetch
  useEffect(() => {
    if (currentUsername !== undefined) return
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .single()
      if (cancelled || !data) return
      setUsername(data.username ?? '')
      setOriginalUsername(data.username ?? '')
      setAvatarUrl(data.avatar_url ?? null)
      setLoadingProfile(false)
    })()
    return () => { cancelled = true }
  }, [userId, currentUsername])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const onPickFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('이미지 파일만 가능합니다'); return }
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${userId}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { contentType: file.type, upsert: false })
      if (upErr) throw new Error(upErr.message)
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드 실패')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const save = async () => {
    const trimmed = username.trim()
    if (!USERNAME_RE.test(trimmed)) {
      setError('닉네임은 영문/숫자/_/-/. 2~30자로 입력해주세요')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: e } = await (supabase as any)
        .from('profiles')
        .update({
          username: trimmed,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
      if (e) {
        if (e.code === '23505' || /duplicate|unique/i.test(e.message)) {
          throw new Error('이미 사용 중인 닉네임입니다')
        }
        throw new Error(e.message)
      }
      onClose()
      if (trimmed !== originalUsername) {
        router.push(`/profile/${trimmed}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <p className="font-serif text-base tracking-widest text-stone-900">프로필 설정</p>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 아바타 */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                <UserIcon className="w-10 h-10 text-stone-400" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-xs tracking-wider text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full px-4 py-1.5 transition-colors disabled:opacity-50"
              >
                {uploading ? '업로드중' : avatarUrl ? '사진 변경' : '사진 업로드'}
              </button>
              {avatarUrl && (
                <button
                  onClick={() => setAvatarUrl(null)}
                  className="text-xs tracking-wider text-stone-500 hover:text-rose-500 rounded-full px-4 py-1.5 transition-colors"
                >
                  사진 삭제
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && onPickFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="text-xs text-stone-400 tracking-wider uppercase">닉네임</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={saving}
              maxLength={30}
              placeholder="2~30자, 영문/숫자/_/-/."
              className="mt-1 w-full text-sm bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 disabled:opacity-60"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="text-xs tracking-wider text-stone-500 hover:text-stone-900 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={save}
              disabled={saving || uploading || loadingProfile}
              className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {saving ? '저장중' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
