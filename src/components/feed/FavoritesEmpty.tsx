import Link from 'next/link'
import { BookmarkIcon } from '@/components/ui/icons'

export function FavoritesEmpty() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
      <BookmarkIcon className="w-8 h-8 text-stone-300 mb-6" />
      <p className="font-serif text-xl text-stone-500 mb-2">
        즐겨찾기가 비어있습니다
      </p>
      <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
        마음에 드는 작가를 즐겨찾기에 추가하면 여기에 모입니다.
      </p>
      <Link
        href="/"
        className="mt-8 text-xs tracking-[0.2em] text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
      >
        작품 둘러보기
      </Link>
    </section>
  )
}
