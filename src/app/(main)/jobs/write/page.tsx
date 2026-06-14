import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { JobPostForm } from '@/components/jobs/JobPostForm'
import type { JobKind } from '@/types'

export default async function JobWritePage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const sp = await searchParams
  const defaultKind: JobKind = sp?.kind === 'seeking' ? 'seeking' : 'hiring'

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-2">Community</p>
      <h1 className="font-serif text-2xl text-stone-900 mb-8">구인·구직 글쓰기</h1>
      <JobPostForm userId={user.id} defaultKind={defaultKind} />
    </div>
  )
}
