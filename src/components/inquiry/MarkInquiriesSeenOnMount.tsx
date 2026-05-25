'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 페이지 진입 후 GNB 배지가 즉시 갱신되도록 라우터 캐시 무효화
export function MarkInquiriesSeenOnMount() {
  const router = useRouter()
  useEffect(() => {
    router.refresh()
    // server component에서 이미 mark_my_inquiries_seen RPC를 호출했으므로
    // 여기서는 다른 페이지(GNB 등)의 fetch를 강제로 갱신만 함
  }, [router])
  return null
}
