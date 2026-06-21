import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE = 'https://allceramic.shop'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [boardRes, infoRes, exhibitionRes, jobsRes, profileRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('board_posts').select('id, updated_at').order('created_at', { ascending: false }).limit(200),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('info_posts').select('id, updated_at').order('created_at', { ascending: false }).limit(200),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('exhibition_posts').select('id, updated_at').order('created_at', { ascending: false }).limit(200),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('job_posts').select('id, updated_at').order('created_at', { ascending: false }).limit(200),
    supabase.from('profiles').select('username, updated_at').limit(500),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/board`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/info`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/exhibition`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  const boardRoutes = ((boardRes.data ?? []) as { id: string; updated_at: string }[]).map(p => ({
    url: `${BASE}/board/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const infoRoutes = ((infoRes.data ?? []) as { id: string; updated_at: string }[]).map(p => ({
    url: `${BASE}/info/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const exhibitionRoutes = ((exhibitionRes.data ?? []) as { id: string; updated_at: string }[]).map(p => ({
    url: `${BASE}/exhibition/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const jobsRoutes = ((jobsRes.data ?? []) as { id: string; updated_at: string }[]).map(p => ({
    url: `${BASE}/jobs/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const profileRoutes = ((profileRes.data ?? []) as { username: string; updated_at: string }[]).map(p => ({
    url: `${BASE}/profile/${p.username}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...boardRoutes, ...infoRoutes, ...exhibitionRoutes, ...jobsRoutes, ...profileRoutes]
}
