import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExhibitionPostForm } from '@/components/exhibition/ExhibitionPostForm'

export default async function ExhibitionWritePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl text-stone-900 mb-8">전시정보 글쓰기</h1>
      <ExhibitionPostForm userId={user.id} />
    </div>
  )
}
