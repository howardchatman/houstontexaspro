import Link from 'next/link'
import { Star, MapPin, CheckCircle, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Contractor, Category } from '@/types'

interface ContractorCardProps {
  contractor: Contractor & { categories?: Category[] }
}

export function ContractorCard({ contractor }: ContractorCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="relative h-40 bg-gradient-to-r from-blue-900 to-blue-700">
        {contractor.cover_image_url ? (
          <img
            src={contractor.cover_image_url}
            alt={contractor.business_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold opacity-30">
              {contractor.business_name.charAt(0)}
            </span>
          </div>
        )}

        {/* Logo */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-16 h-16 rounded-lg bg-white shadow-md flex items-center justify-center overflow-hidden">
            {contractor.logo_url ? (
              <img
                src={contractor.logo_url}
                alt={`${contractor.business_name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-blue-900">
                {contractor.business_name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {contractor.is_verified && (
            <Badge className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {contractor.is_featured && (
            <Badge className="bg-yellow-500">Featured</Badge>
          )}
        </div>
      </div>

      <CardContent className="pt-10 pb-4">
        {/* Business Name */}
        <Link href={`/contractors/${contractor.slug}`}>
          <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-900 transition-colors">
            {contractor.business_name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          {renderStars(contractor.avg_rating)}
          <span className="text-sm text-gray-600">
            {contractor.avg_rating.toFixed(1)} ({contractor.review_count} reviews)
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>{contractor.city}, TX</span>
        </div>

        {/* Categories */}
        {contractor.categories && contractor.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {contractor.categories.slice(0, 3).map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
            {contractor.categories.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{contractor.categories.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Description Preview */}
        {contractor.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {contractor.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button asChild className="flex-1">
            <Link href={`/contractors/${contractor.slug}`}>View Profile</Link>
          </Button>
          {contractor.phone && (
            <Button variant="outline" size="icon" asChild>
              <a href={`tel:${contractor.phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
