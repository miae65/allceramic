'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'

export function AuthGatedLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      setAuthOpen(true)
    }
  }

  return (
    <>
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}
