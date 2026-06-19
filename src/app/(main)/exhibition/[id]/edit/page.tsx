import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExhibitionPostForm } from '@/components/exhibition/ExhibitionPostForm'

export default async function ExhibitionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: post } = await (supabase as any)
    .from('exhibition_posts')
    .select('id, user_id, title, content, image_urls')
    .eq('id', id)
    .maybeSingle()
  if (!post) notFound()
  if (post.user_id !== user.id) redirect(`/exhibition/${id}`)

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl text-stone-900 mb-8">글 수정</h1>
      <ExhibitionPostForm
        userId={user.id}
        postId={post.id}
        initialTitle={post.title}
        initialContent={post.content}
        initialImageUrls={post.image_urls ?? []}
      />
    </div>
  )
}
