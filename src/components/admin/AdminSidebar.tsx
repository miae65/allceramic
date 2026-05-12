'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: '대시보드 홈', exact: true },
  { href: '/admin/posts', label: '게시물 관리' },
  { href: '/admin/users', label: '회원 관리' },
  { href: '/admin/inquiries', label: '문의 관리' },
  { href: '/admin/notices', label: '공지 관리' },
  { href: '/admin/settings', label: '설정' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-stone-100 flex flex-col">
      <div className="px-6 h-14 flex items-center border-b border-stone-100">
        <p className="font-serif text-lg tracking-widest text-stone-900">Admin</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                active
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 text-xs text-stone-300 tracking-widest uppercase">Allceramic</div>
    </aside>
  )
}
