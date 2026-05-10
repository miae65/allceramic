'use client'

import { useEffect } from 'react'
import { XMarkIcon } from '@/components/ui/icons'

export function TermsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
          <h2 className="font-serif text-lg text-stone-900 tracking-wide">Allceramic 이용약관</h2>
          <button onClick={onClose} aria-label="닫기" className="text-stone-400 hover:text-stone-700 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="overflow-y-auto px-7 py-6 text-sm text-stone-600 leading-relaxed space-y-7">

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제1조 (목적)</h3>
            <p>이 약관은 Allceramic(이하 "서비스")이 제공하는 콘텐츠 공유 및 큐레이션 플랫폼의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제2조 (정의)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>"서비스"란 Allceramic이 제공하는 이미지 기반 콘텐츠 공유 및 큐레이션 플랫폼을 의미합니다.</li>
              <li>"이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 의미합니다.</li>
              <li>"서비스 제공자"란 Allceramic 서비스를 운영하는 주체를 의미합니다.</li>
              <li>"회원"이란 서비스에 회원가입을 하고 지속적으로 서비스를 이용하는 자를 의미합니다.</li>
              <li>"콘텐츠"란 이용자가 서비스에 업로드한 이미지 및 관련 정보 일체를 의미합니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제3조 (약관의 효력 및 변경)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>본 약관은 서비스 내에 게시함으로써 효력이 발생합니다.</li>
              <li>서비스 제공자는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.</li>
              <li>약관이 변경될 경우 변경 내용 및 시행일을 사전에 공지합니다.</li>
              <li>이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제4조 (회원가입 및 계정 관리)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>회원가입은 이용자가 약관에 동의하고 가입 절차를 완료함으로써 성립합니다.</li>
              <li>회원은 자신의 계정 정보를 정확하게 관리할 책임이 있습니다.</li>
              <li>계정의 부정 사용으로 발생하는 문제에 대한 책임은 회원에게 있습니다.</li>
              <li>
                서비스 제공자는 다음의 경우 회원가입을 제한하거나 취소할 수 있습니다.
                <ul className="list-disc list-inside ml-4 mt-1.5 space-y-1">
                  <li>허위 정보를 기재한 경우</li>
                  <li>타인의 정보를 도용한 경우</li>
                  <li>기타 부정한 방법으로 가입한 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제5조 (서비스의 제공 및 변경)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>
                서비스는 다음과 같은 기능을 제공합니다.
                <ul className="list-disc list-inside ml-4 mt-1.5 space-y-1">
                  <li>콘텐츠 업로드 및 공유</li>
                  <li>콘텐츠 탐색 및 큐레이션</li>
                  <li>즐겨찾기(북마크) 기능</li>
                  <li>댓글 및 소통 기능</li>
                </ul>
              </li>
              <li>서비스 제공자는 운영상 또는 기술상 필요에 따라 서비스의 전부 또는 일부를 변경할 수 있습니다.</li>
              <li>서비스는 시스템 점검 등의 사유로 일시 중단될 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제6조 (이용자의 의무 및 금지행위)</h3>
            <p className="mb-2">이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>타인의 저작권, 초상권 등 권리를 침해하는 행위</li>
              <li>불법, 음란, 혐오, 폭력적 콘텐츠 업로드</li>
              <li>타인을 비방하거나 피해를 주는 행위</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>기타 관련 법령에 위반되는 행위</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제7조 (콘텐츠의 저작권 및 이용권)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>이용자가 업로드한 콘텐츠의 저작권은 해당 이용자에게 귀속됩니다.</li>
              <li>
                이용자는 서비스를 통해 업로드한 콘텐츠에 대해 서비스 운영 목적 범위 내에서 다음과 같은 이용을 허락합니다.
                <ul className="list-disc list-inside ml-4 mt-1.5 space-y-1">
                  <li>서비스 내 게시 및 전시</li>
                  <li>메인 피드, 추천 영역 및 큐레이션 노출</li>
                  <li>서비스 및 커뮤니티 홍보를 위한 활용</li>
                  <li>공식 웹사이트, SNS, 프로모션 및 마케팅 콘텐츠 활용</li>
                </ul>
              </li>
              <li>서비스 제공자는 콘텐츠의 원본 의미와 창작 의도를 훼손하지 않는 범위 내에서 콘텐츠를 활용합니다.</li>
              <li>서비스는 운영 및 커뮤니티 홍보 목적 범위 내에서 콘텐츠를 활용할 수 있습니다.</li>
              <li>이용자는 타인의 콘텐츠를 무단으로 사용할 수 없습니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제8조 (콘텐츠 관리 및 삭제)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>
                서비스 제공자는 다음의 경우 콘텐츠를 삭제하거나 제한할 수 있습니다.
                <ul className="list-disc list-inside ml-4 mt-1.5 space-y-1">
                  <li>약관을 위반하는 경우</li>
                  <li>권리 침해 신고가 접수된 경우</li>
                </ul>
              </li>
              <li>이용자는 자신의 콘텐츠를 언제든 삭제할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제9조 (서비스 이용 제한 및 해지)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>서비스 제공자는 이용자가 약관을 위반할 경우 사전 통지 없이 이용을 제한하거나 계정을 삭제할 수 있습니다.</li>
              <li>이용자는 언제든지 회원 탈퇴를 요청할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제10조 (책임의 제한)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>서비스 제공자는 천재지변 또는 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.</li>
              <li>이용자가 업로드한 콘텐츠에 대한 책임은 해당 이용자에게 있습니다.</li>
              <li>이용자 간 발생한 분쟁에 대해 서비스 제공자는 개입하지 않으며 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제11조 (개인정보 보호)</h3>
            <p>서비스 제공자는 이용자의 개인정보를 보호하기 위해 별도의 개인정보처리방침을 수립하여 운영합니다.</p>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">제12조 (준거법 및 관할)</h3>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>본 약관은 대한민국 법률에 따라 해석됩니다.</li>
              <li>서비스 이용과 관련하여 분쟁이 발생할 경우 관할 법원은 대한민국 법원으로 합니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-stone-900 mb-2">부칙</h3>
            <p>본 약관은 2026년 5월 10일부터 적용됩니다.</p>
          </section>

        </div>

        {/* 확인 버튼 */}
        <div className="px-7 py-5 border-t border-stone-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-stone-900 text-white text-sm tracking-wide hover:bg-stone-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
