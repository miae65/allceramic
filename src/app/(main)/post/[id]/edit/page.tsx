import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditCaptionForm } from '@/components/post/EditCaptionForm'

export default async function PostEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: post } = await (supabase as any)
    .from('posts')
    .select('id, user_id, caption')
    .eq('id', id)
    .maybeSingle()

  if (!post) notFound()
  if (post.user_id !== user.id) redirect(`/post/${id}`)

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl text-stone-900 mb-8">게시글 수정</h1>
      <EditCaptionForm postId={post.id} initialCaption={post.caption} />
    </div>
  )
}
