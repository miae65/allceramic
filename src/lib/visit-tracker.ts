import type { NextRequest, NextResponse } from 'next/server'

const BOT_RE = /(bot|crawler|spider|crawling|preview|vercel|axios|node-fetch|node\.js|wget|curl|http-client|headless|playwright|puppeteer|lighthouse|monitor|uptime)/i

export async function recordVisitIfNeeded(request: NextRequest, response: NextResponse) {
  const ua = request.headers.get('user-agent') ?? ''
  if (BOT_RE.test(ua)) return

  if (request.cookies.get('visited_today')) return

  const expires = new Date()
  expires.setHours(24, 0, 0, 0)
  response.cookies.set('visited_today', '1', {
    expires,
    sameSite: 'lax',
    path: '/',
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return

  try {
    await fetch(`${url}/rest/v1/rpc/record_visit`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
      cache: 'no-store',
    })
  } catch (err) {
    console.error('[record_visit]', err)
  }
}
