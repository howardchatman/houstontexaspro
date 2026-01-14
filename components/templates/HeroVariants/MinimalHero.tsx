import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { MapPin, CheckCircle, Star, Calendar, Shield } from 'lucide-react'
import { Contractor } from '@/types'

interface MinimalHeroProps {
  contractor: Contractor
  customTagline?: string | null
}

export function MinimalHero({ contractor, customTagline }: MinimalHeroProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Logo */}
          {contractor.logo_url && (
            <div className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-white flex-shrink-0">
              <Image
                src={contractor.logo_url}
                alt={`${contractor.business_name} logo`}
                fill
                className="object-contain p-2"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {contractor.is_verified && (
                <Badge className="bg-[var(--template-primary)] text-white hover:bg-[var(--template-primary)]">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              {contractor.is_featured && (
                <Badge variant="outline" className="border-[var(--template-accent)] text-[var(--template-accent)]">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {contractor.business_name}
            </h1>

            {customTagline && (
              <p className="text-gray-600 mb-3 max-w-2xl">
                {customTagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[var(--template-primary)]" />
                <span>{contractor.city}, TX</span>
              </div>

              {contractor.review_count > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[var(--template-accent)] text-[var(--template-accent)]" />
                  <span className="font-semibold text-gray-900">{contractor.avg_rating.toFixed(1)}</span>
                  <span>({contractor.review_count} reviews)</span>
                </div>
              )}

              {contractor.years_in_business && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{contractor.years_in_business}+ years in business</span>
                </div>
              )}

              {contractor.insurance_verified && (
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Insured</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
