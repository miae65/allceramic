import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InfoPostForm } from '@/components/info/InfoPostForm'

export default async function InfoWritePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl text-stone-900 mb-8">정보공유 글쓰기</h1>
      <InfoPostForm userId={user.id} />
    </div>
  )
}
