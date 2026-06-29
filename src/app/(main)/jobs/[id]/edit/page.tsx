import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { JobPostForm } from '@/components/jobs/JobPostForm'
import type { JobPost } from '@/types'

export default async function JobEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: post } = await (supabase as any)
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (!post) notFound()
  if ((post as JobPost).user_id !== user.id) redirect(`/jobs/${id}`)

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-2">Community</p>
      <h1 className="font-serif text-2xl text-stone-900 mb-8">구인/구직 수정</h1>
      <JobPostForm userId={user.id} postId={(post as JobPost).id} initial={post as JobPost} />
    </div>
  )
}
