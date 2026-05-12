import { createClient } from '@/lib/supabase/server'
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm'
import type { SiteSettings } from '@/types'

async function fetchSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()
  return data as SiteSettings
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const settings = await fetchSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl tracking-wide text-stone-900">설정</h1>
        <p className="text-xs text-stone-400 tracking-wider uppercase mt-1">계정 및 사이트 설정</p>
      </div>

      <section className="bg-white rounded-2xl border border-stone-100 p-6">
        <p className="text-xs text-stone-400 tracking-wider uppercase mb-4">관리자 계정</p>
        <dl className="space-y-3 text-sm">
          <div className="flex">
            <dt className="w-28 text-stone-400">이메일</dt>
            <dd className="text-stone-800">{user?.email ?? '-'}</dd>
          </div>
          <div className="flex">
            <dt className="w-28 text-stone-400">이름</dt>
            <dd className="text-stone-800">
              {user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? '-'}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-28 text-stone-400">가입일</dt>
            <dd className="text-stone-800 tabular-nums">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-'}
            </dd>
          </div>
        </dl>
      </section>

      <AdminSettingsForm initial={settings} />
    </div>
  )
}
