import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Allceramic',
  description: 'A curated community for ceramic artists and enthusiasts',
  other: {
    'naver-site-verification': '91a74ac78462d782ceb21816e7a530b0512196ba',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-50 text-stone-900">{children}</body>
      <GoogleAnalytics gaId="G-36Y468BJHH" />
    </html>
  )
}
