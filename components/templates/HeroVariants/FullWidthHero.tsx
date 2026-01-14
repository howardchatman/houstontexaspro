import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { MapPin, CheckCircle, Star } from 'lucide-react'
import { Contractor } from '@/types'

interface FullWidthHeroProps {
  contractor: Contractor
  customTagline?: string | null
}

export function FullWidthHero({ contractor, customTagline }: FullWidthHeroProps) {
  return (
    <div className="relative h-72 md:h-80 lg:h-96 w-full overflow-hidden">
      {/* Cover Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--template-primary-rgb),0.9)] to-[rgba(var(--template-secondary-rgb),0.95)]"
      >
        {contractor.cover_image_url && (
          <Image
            src={contractor.cover_image_url}
            alt={`${contractor.business_name} cover`}
            fill
            className="object-cover mix-blend-overlay opacity-40"
            priority
          />
        )}
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-end h-full pb-8">
          <div className="flex items-end gap-6">
            {/* Logo */}
            {contractor.logo_url && (
              <div className="hidden sm:block relative w-28 h-28 rounded-xl border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0">
                <Image
                  src={contractor.logo_url}
                  alt={`${contractor.business_name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Business Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-2">
                {contractor.is_verified && (
                  <Badge className="bg-[var(--template-accent)] text-white hover:bg-[var(--template-accent)]">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {contractor.is_featured && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {contractor.business_name}
              </h1>

              {customTagline && (
                <p className="text-lg md:text-xl text-white/90 mb-3 max-w-2xl">
                  {customTagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{contractor.city}, TX</span>
                </div>

                {contractor.review_count > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[var(--template-accent)] text-[var(--template-accent)]" />
                    <span className="font-semibold">{contractor.avg_rating.toFixed(1)}</span>
                    <span className="text-white/70">({contractor.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
