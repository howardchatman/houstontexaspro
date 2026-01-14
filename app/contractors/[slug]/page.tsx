import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Clock,
  Star,
  Shield,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LeadForm } from '@/components/leads/LeadForm'
import { CallButton } from '@/components/leads/CallButton'
import { StarRating } from '@/components/reviews/StarRating'
import { TemplateWrapper } from '@/components/templates/TemplateWrapper'
import { FullWidthHero, SplitHero, MinimalHero } from '@/components/templates/HeroVariants'
import { ContractorTier, HeroLayout } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: contractor } = await supabase
    .from('contractors')
    .select('business_name, description, city')
    .eq('slug', slug)
    .single()

  if (!contractor) {
    return { title: 'Contractor Not Found' }
  }

  return {
    title: `${contractor.business_name} - ${contractor.city}, TX`,
    description: contractor.description || `${contractor.business_name} - Professional contractor services in ${contractor.city}, Texas.`,
  }
}

export default async function ContractorPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch contractor with categories, reviews, and template settings
  const { data: contractor, error } = await supabase
    .from('contractors')
    .select(`
      *,
      profiles (full_name, email),
      contractor_categories (
        categories (id, name, slug)
      ),
      gallery_images (id, image_url, caption, project_type),
      reviews (
        id, rating, title, content, project_type, contractor_response,
        created_at, profiles (full_name)
      ),
      contractor_templates (*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !contractor) {
    notFound()
  }

  const categories = contractor.contractor_categories?.map(
    (cc: { categories: { id: string; name: string; slug: string } }) => cc.categories
  ) || []
  const galleryImages = contractor.gallery_images || []
  const reviews = contractor.reviews || []

  // Template settings
  const template = contractor.contractor_templates
  const tier: ContractorTier = contractor.tier || 'free'
  const heroLayout: HeroLayout = template?.hero_layout || 'full-width'
  const primaryCategory = categories[0]?.slug
  const showServiceAreas = template?.show_service_areas ?? true
  const showCredentials = template?.show_credentials ?? true
  const showTestimonials = template?.show_testimonials ?? true

  // Helper function to render the hero based on layout
  const renderHero = () => {
    switch (heroLayout) {
      case 'split':
        return (
          <SplitHero
            contractor={contractor}
            customTagline={template?.custom_tagline}
            ctaText={template?.custom_cta_text}
          />
        )
      case 'minimal':
        return (
          <MinimalHero
            contractor={contractor}
            customTagline={template?.custom_tagline}
          />
        )
      case 'full-width':
      default:
        return (
          <FullWidthHero
            contractor={contractor}
            customTagline={template?.custom_tagline}
          />
        )
    }
  }

  return (
    <TemplateWrapper tier={tier} template={template} tradeCategory={primaryCategory}>
      <div className="min-h-screen bg-gray-50">
        {/* Dynamic Hero based on template settings */}
        {renderHero()}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Rating & Quick Info */}
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-wrap gap-6 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={contractor.avg_rating} readonly size="lg" />
                        <span className="text-2xl font-bold">
                          {contractor.avg_rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {contractor.review_count} reviews
                      </p>
                    </div>
                  </div>

                  {showCredentials && (
                    <div className="flex flex-wrap gap-4 text-sm">
                      {contractor.years_in_business && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[var(--template-primary)]" />
                          <span>{contractor.years_in_business} years in business</span>
                        </div>
                      )}
                      {contractor.insurance_verified && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Shield className="h-4 w-4" />
                          <span>Insurance Verified</span>
                        </div>
                      )}
                      {contractor.license_number && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[var(--template-primary)]" />
                          <span>License #{contractor.license_number}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {contractor.business_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {contractor.description || 'No description provided.'}
                </p>

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat: { id: string; name: string; slug: string }) => (
                        <Link key={cat.id} href={`/categories/${cat.slug}`}>
                          <Badge variant="secondary" className="hover:bg-gray-200">
                            {cat.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Areas */}
                {showServiceAreas && contractor.service_area && contractor.service_area.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Service Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {contractor.service_area.map((area: string) => (
                        <Badge key={area} variant="outline" className="border-[var(--template-primary)] text-[var(--template-primary)]">
                          <MapPin className="h-3 w-3 mr-1" />
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            {galleryImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Photo Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.slice(0, 6).map((image: { id: string; image_url: string; caption: string | null }) => (
                      <div
                        key={image.id}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={image.image_url}
                          alt={image.caption || 'Project photo'}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                  {galleryImages.length > 6 && (
                    <Button variant="outline" className="w-full mt-4">
                      View All {galleryImages.length} Photos
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {showTestimonials && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Reviews ({contractor.review_count})</span>
                  <Button variant="outline" size="sm" className="border-[var(--template-primary)] text-[var(--template-primary)] hover:bg-[var(--template-primary)] hover:text-white">
                    Write a Review
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.slice(0, 5).map((review: {
                      id: string
                      rating: number
                      title: string | null
                      content: string
                      project_type: string | null
                      contractor_response: string | null
                      created_at: string
                      profiles: { full_name: string | null }
                    }) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">
                              {review.profiles?.full_name || 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.rating} readonly size="sm" />
                              {review.project_type && (
                                <Badge variant="secondary" className="text-xs">
                                  {review.project_type}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="font-medium mb-1">{review.title}</h4>
                        )}
                        <p className="text-gray-600">{review.content}</p>

                        {review.contractor_response && (
                          <div className="mt-3 pl-4 border-l-2 border-[var(--template-primary)]/30 bg-[var(--template-primary)]/5 p-3 rounded-r">
                            <p className="text-sm font-medium text-[var(--template-primary)] mb-1">
                              Response from {contractor.business_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {review.contractor_response}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {reviews.length > 5 && (
                      <Button variant="outline" className="w-full">
                        View All {reviews.length} Reviews
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </CardContent>
            </Card>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contractor.phone && (
                  <CallButton
                    phone={contractor.phone}
                    contractorName={contractor.business_name}
                    aivaEnabled={true}
                  />
                )}

                <Separator />

                <div className="space-y-3">
                  {contractor.phone && (
                    <a
                      href={`tel:${contractor.phone}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-900"
                    >
                      <Phone className="h-5 w-5" />
                      <span>{contractor.phone}</span>
                    </a>
                  )}
                  {contractor.email && (
                    <a
                      href={`mailto:${contractor.email}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-900"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{contractor.email}</span>
                    </a>
                  )}
                  {contractor.website && (
                    <a
                      href={contractor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-900"
                    >
                      <Globe className="h-5 w-5" />
                      <span>Visit Website</span>
                    </a>
                  )}
                  {contractor.address && (
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="h-5 w-5 mt-0.5" />
                      <span>
                        {contractor.address}
                        <br />
                        {contractor.city}, TX {contractor.zip_code}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                  <Clock className="h-4 w-4" />
                  <span>Usually responds within 24 hours</span>
                </div>
              </CardContent>
            </Card>

            {/* Lead Form */}
            <LeadForm
              contractorId={contractor.id}
              contractorName={contractor.business_name}
            />
          </aside>
        </div>
      </div>
      </div>
    </TemplateWrapper>
  )
}
