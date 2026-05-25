import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { recordVisitIfNeeded } from '@/lib/visit-tracker'

export async function proxy(request: NextRequest) {
  const response = await updateSession(request)
  if (request.nextUrl.pathname === '/') {
    await recordVisitIfNeeded(request, response)
  }
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
