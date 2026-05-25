import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BoardPostForm } from '@/components/board/BoardPostForm'

export default async function BoardEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: post } = await (supabase as any)
    .from('board_posts')
    .select('id, user_id, title, content')
    .eq('id', id)
    .maybeSingle()
  if (!post) notFound()
  if (post.user_id !== user.id) redirect(`/board/${id}`)

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-xs tracking-widest text-stone-400 uppercase mb-2">Community</p>
      <h1 className="font-serif text-2xl text-stone-900 mb-8">글 수정</h1>
      <BoardPostForm userId={user.id} postId={post.id} initialTitle={post.title} initialContent={post.content} />
    </div>
  )
}
