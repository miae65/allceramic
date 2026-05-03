import Link from 'next/link'
import Image from 'next/image'
import type { Profile } from '@/types'

export function FavoriteProfileGrid({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="grid grid-cols-5 gap-x-5 gap-y-8">
      {profiles.map(profile => (
        <Link
          key={profile.id}
          href={`/profile/${profile.username}`}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-16 h-16 rounded-full bg-stone-200 overflow-hidden ring-2 ring-transparent group-hover:ring-stone-300 transition-all duration-200">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300" />
            )}
          </div>
          <span className="text-xs text-stone-600 group-hover:text-stone-900 transition-colors text-center w-full truncate px-1">
            {profile.username}
          </span>
        </Link>
      ))}
    </div>
  )
}
