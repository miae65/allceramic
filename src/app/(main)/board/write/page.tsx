import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BoardPostForm } from '@/components/board/BoardPostForm'

export default async function BoardWritePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-2">Community</p>
      <h1 className="font-serif text-2xl text-stone-900 mb-8">글쓰기</h1>
      <BoardPostForm userId={user.id} />
    </div>
  )
}
