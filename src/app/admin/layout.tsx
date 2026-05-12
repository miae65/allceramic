import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Allceramic Admin',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')
  if (!isAdmin(user)) redirect('/')

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-60">
        <header className="h-14 bg-white border-b border-stone-100 flex items-center justify-between px-8">
          <Link href="/" className="text-xs tracking-widest text-stone-400 hover:text-stone-700 transition-colors uppercase">
            ← 사이트로 돌아가기
          </Link>
          <span className="text-xs text-stone-400 tabular-nums">{user.email}</span>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
