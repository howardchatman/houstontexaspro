import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, CheckCircle, Star, Phone, Mail } from 'lucide-react'
import { Contractor } from '@/types'

interface SplitHeroProps {
  contractor: Contractor
  customTagline?: string | null
  ctaText?: string
  onCtaClick?: () => void
}

export function SplitHero({ contractor, customTagline, ctaText = 'Get a Free Quote', onCtaClick }: SplitHeroProps) {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Business Info */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-4">
              {contractor.is_verified && (
                <Badge className="bg-[var(--template-primary)] text-white hover:bg-[var(--template-primary)]">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Pro
                </Badge>
              )}
              {contractor.is_featured && (
                <Badge variant="outline" className="border-[var(--template-accent)] text-[var(--template-accent)]">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {contractor.business_name}
            </h1>

            {customTagline && (
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                {customTagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5 text-[var(--template-primary)]" />
                <span>{contractor.city}, TX</span>
              </div>

              {contractor.review_count > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[var(--template-accent)] text-[var(--template-accent)]" />
                  <span className="font-semibold text-gray-900">{contractor.avg_rating.toFixed(1)}</span>
                  <span>({contractor.review_count} reviews)</span>
                </div>
              )}
            </div>

            {/* Quick Contact */}
            <div className="flex flex-wrap gap-3 mb-6">
              {contractor.phone && (
                <a
                  href={`tel:${contractor.phone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-[var(--template-primary)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--template-primary)]" />
                  <span className="text-sm font-medium">{contractor.phone}</span>
                </a>
              )}
              {contractor.email && (
                <a
                  href={`mailto:${contractor.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-[var(--template-primary)] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--template-primary)]" />
                  <span className="text-sm font-medium">Email Us</span>
                </a>
              )}
            </div>

            <Button
              size="lg"
              className="bg-[var(--template-primary)] hover:bg-[var(--template-secondary)] text-white px-8"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              {contractor.cover_image_url ? (
                <Image
                  src={contractor.cover_image_url}
                  alt={`${contractor.business_name}`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--template-primary)] to-[var(--template-secondary)]">
                  {contractor.logo_url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-white shadow-lg">
                        <Image
                          src={contractor.logo_url}
                          alt={`${contractor.business_name} logo`}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Logo overlay on image */}
              {contractor.logo_url && contractor.cover_image_url && (
                <div className="absolute bottom-4 left-4 w-20 h-20 rounded-lg overflow-hidden bg-white shadow-lg">
                  <Image
                    src={contractor.logo_url}
                    alt={`${contractor.business_name} logo`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
