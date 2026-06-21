import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/(auth)/', '/profile/me', '/board/write', '/board/my', '/info/write', '/info/my', '/exhibition/write', '/exhibition/my', '/jobs/write', '/jobs/my', '/favorites', '/inquiries/'],
      },
    ],
    sitemap: 'https://allceramic.shop/sitemap.xml',
  }
}
