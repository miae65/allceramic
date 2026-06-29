'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'

export function InfoWriteButton({ className }: { className?: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const handleClick = () => {
    if (!user) {
      setAuthOpen(true)
    } else {
      setNoticeOpen(true)
    }
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        글쓰기
      </button>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      {noticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNoticeOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <h2 className="font-serif text-base tracking-widest text-stone-900 mb-5">※ 거래 안내 ※</h2>
            <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
              <p>
                이 공간은 세라믹 도구, 재료 등을 회원 간 자유롭게 거래할 수 있도록 마련된 게시판입니다.
              </p>
              <p>
                올세라믹은 거래를 위한 게시 공간만 제공하며, 실제 거래의 당사자가 아닙니다.
                상품의 상태, 가격 협의, 결제, 배송, 환불, 교환 및 거래 과정에서 발생하는 문제에 대한 책임은 거래 당사자에게 있습니다.
              </p>
              <p>
                거래 전에는 상품 정보와 상태, 가격, 배송 방법 등을 충분히 확인해주시고 신중하게 거래를 진행해 주세요.
              </p>
              <p>
                서로를 존중하는 안전한 거래 문화를 위해 허위 정보, 사기성 게시글, 불쾌감을 주는 내용은 제한될 수 있습니다.
              </p>
            </div>
            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setNoticeOpen(false)}
                className="flex-1 text-xs tracking-[0.15em] uppercase text-stone-500 border border-stone-200 rounded-full py-2.5 hover:border-stone-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { setNoticeOpen(false); router.push('/info/write') }}
                className="flex-1 text-xs tracking-[0.15em] uppercase text-white bg-stone-900 rounded-full py-2.5 hover:bg-stone-700 transition-colors"
              >
                확인 후 작성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
