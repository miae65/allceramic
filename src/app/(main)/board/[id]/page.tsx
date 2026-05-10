'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
import { MOCK_BOARD_POSTS, type BoardComment } from '@/lib/mock/board'
import { ChevronLeftIcon } from '@/components/ui/icons'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return '방금 전'
  if (h < 24) return `${h}시간 전`
  return `${Math.floor(h / 24)}일 전`
}

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const post = MOCK_BOARD_POSTS.find(p => p.id === id)
  if (!post) return notFound()

  const [comments, setComments] = useState<BoardComment[]>(post.comments)
  const [text, setText] = useState('')

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setComments(prev => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: '나',
        avatar_url: 'https://i.pravatar.cc/150?img=70',
        content: trimmed,
        created_at: new Date().toISOString(),
      },
    ])
    setText('')
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* 뒤로가기 */}
      <Link
        href="/board"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors text-sm mb-8"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>자유게시판</span>
      </Link>

      {/* 게시글 */}
      <article className="mb-10">
        <h1 className="font-serif text-xl text-stone-900 leading-snug mb-5">{post.title}</h1>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-200 shrink-0">
            <Image src={post.avatar_url} alt={post.author} width={32} height={32} className="object-cover" />
          </div>
          <div>
            <Link href={`/profile/${post.author}`} className="text-sm text-stone-700 hover:text-stone-900 transition-colors">
              {post.author}
            </Link>
            <p className="text-xs text-stone-300 mt-0.5">
              {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              &nbsp;·&nbsp;조회 {post.view_count}
            </p>
          </div>
        </div>

        <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>

      {/* 댓글 */}
      <section>
        <p className="text-xs tracking-widest text-stone-400 uppercase mb-6">
          댓글 {comments.length}
        </p>

        <div className="space-y-6 mb-10">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-200 shrink-0 mt-0.5">
                <Image src={c.avatar_url} alt={c.author} width={28} height={28} className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/profile/${c.author}`} className="text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors">
                    {c.author}
                  </Link>
                  <span className="text-xs text-stone-300">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="border-t border-stone-100 pt-6">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows={3}
            className="w-full text-sm text-stone-700 placeholder-stone-300 border border-stone-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-stone-400 transition-colors"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="text-xs tracking-[0.15em] uppercase px-5 py-2 rounded-full bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-30 transition-colors"
            >
              등록
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
