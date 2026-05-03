import { FavoriteProfileGrid } from '@/components/favorites/FavoriteProfileGrid'
import { FavoritesEmpty } from '@/components/feed/FavoritesEmpty'
import type { Profile } from '@/types'

// --- mock data (5열 × 3행 = 15명) ---
const MOCK_FAVORITES: Profile[] = [
  'clay_works', 'mud_studio', 'fire_form', 'earth_wheel', 'glaze_co',
  'kiln_kr', 'pottery_j', 'ceramic_m', 'raku_seoul', 'slip_cast',
  'thrown_ware', 'salt_fire', 'ash_glaze', 'wood_kiln', 'porcelain_a',
].map((username, i) => ({
  id: `user-${i + 2}`,
  username,
  bio: null,
  avatar_url: null,
  created_at: '',
  updated_at: '',
}))

/*
 * Supabase 연결 후 교체:
 *
 * async function fetchFavoriteProfiles(userId: string): Promise<Profile[]> {
 *   const supabase = await createClient()
 *   const { data } = await supabase
 *     .from('user_favorites')
 *     .select('profile:profiles(*)')
 *     .eq('user_id', userId)
 *     .order('created_at', { ascending: false })
 *   return data?.map(f => f.profile) ?? []
 * }
 */

export default async function FavoritesPage() {
  const profiles = MOCK_FAVORITES

  return (
    <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
      {/* 헤더 */}
      <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] text-stone-900 leading-none tracking-wide">
        Archive
      </h1>
      <p className="mt-3 text-sm text-stone-400 tracking-wide">
        Artists saved for inspiration
      </p>
      {profiles.length > 0 && (
        <p className="mt-1 text-xs text-stone-300 tabular-nums">
          {profiles.length} saved
        </p>
      )}

      {/* 그리드 or 빈 상태 */}
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
