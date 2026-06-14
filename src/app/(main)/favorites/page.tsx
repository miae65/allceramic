import { redirect } from 'next/navigation'
import { FavoriteProfileGrid } from '@/components/favorites/FavoriteProfileGrid'
import { FavoritesEmpty } from '@/components/feed/FavoritesEmpty'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types'

async function fetchFavoriteProfiles(userId: string): Promise<Profile[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('user_favorites')
    .select('created_at, profile:profiles!user_favorites_favorite_id_fkey(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map(r => r.profile).filter(Boolean) as Profile[]
}

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const profiles = await fetchFavoriteProfiles(user.id)

  return (
    <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
      <h1 className="font-serif font-medium text-3xl text-stone-700 leading-none tracking-[0.08em]">
        즐겨찾기
      </h1>
      <p className="mt-4 text-xs text-stone-400 tracking-[0.15em]">
        영감을 위해 저장한 작가들
      </p>
      {profiles.length > 0 && (
        <p className="mt-2 text-xs text-stone-300 tabular-nums tracking-[0.05em]">
          {profiles.length}명 저장됨
        </p>
      )}

      <div className="mt-12">
        {profiles.length === 0 ? (
          <FavoritesEmpty />
        ) : (
          <FavoriteProfileGrid profiles={profiles} />
        )}
      </div>
    </div>
  )
}
