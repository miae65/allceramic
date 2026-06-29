'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

async function getOwnedPendingInquiry(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('inquiries')
    .select('id, user_id, admin_reply')
    .eq('id', id)
    .maybeSingle()

  if (!data) throw new Error('문의를 찾을 수 없습니다')
  if (data.user_id !== user.id) throw new Error('권한이 없습니다')
  if (data.admin_reply) throw new Error('답변이 완료된 문의는 변경할 수 없습니다')
  return data
}

export async function updateInquiry(id: string, subject: string, content: string) {
  await getOwnedPendingInquiry(id)
  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (service as any)
    .from('inquiries')
    .update({ subject: subject.trim(), content: content.trim(), updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/inquiries/me')
}

export async function deleteInquiry(id: string) {
  await getOwnedPendingInquiry(id)
  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (service as any)
    .from('inquiries')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/inquiries/me')
}
