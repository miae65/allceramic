import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
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
  metadataBase: new URL('https://allceramic.shop'),
  title: {
    default: 'Allceramic',
    template: '%s | Allceramic',
  },
  description: '도예인을 위한 커뮤니티 — 작품, 전시정보, 구인/구직을 한 곳에서',
  keywords: ['도예', '세라믹', '도예 커뮤니티', '도자기', '전시', '구인/구직', '도예인', 'Allceramic'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://allceramic.shop',
    siteName: 'Allceramic',
    title: 'Allceramic',
    description: '도예인을 위한 커뮤니티 — 작품, 전시정보, 구인/구직을 한 곳에서',
    images: [{ url: '/hero.jpg', width: 1200, height: 630, alt: 'Allceramic' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allceramic',
    description: '도예인을 위한 커뮤니티 — 작품, 전시정보, 구인/구직을 한 곳에서',
    images: ['/hero.jpg'],
  },
  other: {
    'naver-site-verification': '91a74ac78462d782ceb21816e7a530b0512196ba',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-50 text-stone-900">{children}</body>
      <GoogleAnalytics gaId="G-36Y468BJHH" />
      <Script id="ms-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","xahjhz543w");`}
      </Script>
    </html>
  )
}
