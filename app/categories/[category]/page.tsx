import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/contractors/SearchBar'
import { ContractorCard } from '@/components/contractors/ContractorCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CONTRACTOR_CATEGORIES } from '@/types'
import { categoryImages } from '@/components/contractors/CategoryGrid'
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  MapPin,
  ArrowRight,
  MessageSquare,
  Shield,
} from 'lucide-react'

// Trade-specific intro copy for common categories
const CATEGORY_COPY: Record<string, { headline: string; intro: string; emergency?: string }> = {
  'plumbing': {
    headline: 'Houston Plumbers Who Respond Fast',
    intro: 'Licensed plumbers for emergencies, repairs, and installations. Burst pipe? Clogged drain? Reach a pro who answers.',
    emergency: 'Plumbing emergencies can cause thousands in water damage. Get routed to an available plumber now.',
  },
  'electrical': {
    headline: 'Licensed Houston Electricians',
    intro: 'Certified electricians for repairs, installations, and inspections. No power? Panel upgrade needed? Reach a licensed pro.',
    emergency: 'Electrical issues are dangerous. Don\'t wait—get connected to a licensed electrician immediately.',
  },
  'hvac': {
    headline: 'Houston HVAC Contractors',
    intro: 'AC repair, heating service, and installations from verified HVAC pros. Houston summers don\'t wait—neither should you.',
    emergency: 'AC down in Houston heat? Get priority routing to HVAC contractors who handle emergencies.',
  },
  'roofing': {
    headline: 'Houston Roofing Contractors',
    intro: 'Roof repair, replacement, and storm damage experts. Free inspections from verified Houston roofers.',
    emergency: 'Storm damage? Leak? Get connected to roofers who respond fast and handle insurance claims.',
  },
  'general-contractors': {
    headline: 'Houston General Contractors',
    intro: 'Licensed general contractors for renovations, additions, and commercial buildouts. Verified and ready to respond.',
  },
  'painting': {
    headline: 'Houston Painters & Painting Contractors',
    intro: 'Interior and exterior painting from verified Houston pros. Get quotes, compare reviews, and schedule service.',
  },
  'flooring': {
    headline: 'Houston Flooring Contractors',
    intro: 'Hardwood, tile, carpet, and luxury vinyl installation from verified Houston contractors. Get quotes today.',
  },
  'landscaping': {
    headline: 'Houston Landscaping Contractors',
    intro: 'Landscape design, lawn care, irrigation, and outdoor living from Houston pros. Transform your outdoor space.',
  },
}

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = CONTRACTOR_CATEGORIES.find((c) => c.slug === categorySlug)

  if (!category) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${category.name} in Houston, TX | HoustonTexasPro`,
    description: `Find licensed ${category.name.toLowerCase()} contractors in Houston who respond fast. Verified pros, real reviews, no runaround.`,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params
  const resolvedSearchParams = await searchParams
  const isEmergency = resolvedSearchParams.emergency === 'true'

  const category = CONTRACTOR_CATEGORIES.find((c) => c.slug === categorySlug)

  if (!category) {
    notFound()
  }

  const supabase = await createClient()

  // Fetch contractors in this category
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  let contractors: Array<{
    id: string
    business_name: string
    slug: string
    city: string
    avg_rating: number
    review_count: number
    is_verified: boolean
    is_featured: boolean
    description: string | null
    logo_url: string | null
    cover_image_url: string | null
    phone: string | null
    contractor_categories?: Array<{
      categories: { id: string; name: string; slug: string }
    }>
  }> = []

  if (categoryData) {
    const { data } = await supabase
      .from('contractors')
      .select(`
        *,
        contractor_categories!inner (
          category_id,
          categories (id, name, slug)
        )
      `)
      .eq('contractor_categories.category_id', categoryData.id)
      .order('is_featured', { ascending: false })
      .order('avg_rating', { ascending: false })

    contractors = data || []
  }

  // Transform data to include categories array
  const contractorsWithCategories = contractors.map((contractor) => ({
    ...contractor,
    categories: contractor.contractor_categories?.map(
      (cc) => cc.categories
    ) || [],
  }))

  // Get trade-specific copy or fallback to generic
  const tradeCopy = CATEGORY_COPY[categorySlug] || {
    headline: `${category.name} in Houston, TX`,
    intro: `Find licensed ${category.name.toLowerCase()} contractors across Greater Houston. Verified, responsive, and ready to help with your project.`,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header with Background Image */}
      <div className="relative min-h-[40vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${categoryImages[categorySlug] || ''}')` }}
        />
        {/* Dark Overlay - stronger for emergency */}
        <div className={`absolute inset-0 ${isEmergency ? 'bg-red-900/70' : 'bg-black/60'}`} />

        {/* Content */}
        <div className="relative z-10 w-full py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/categories" className="hover:text-white transition-colors">
                Services
              </Link>
              <span>/</span>
              <span className="text-white/80">{category.name}</span>
            </div>

            {isEmergency && (
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                  Emergency Mode
                </Badge>
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {isEmergency ? `Emergency ${category.name} in Houston` : tradeCopy.headline}
            </h1>
            <p className="text-white/70 mb-8 max-w-2xl text-lg">
              {isEmergency && tradeCopy.emergency
                ? tradeCopy.emergency
                : tradeCopy.intro}
            </p>

            <SearchBar variant="hero" initialCategory={categorySlug} />

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>{contractorsWithCategories.length} {category.name.toLowerCase()} pros available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>Fast response times</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-yellow-400" />
                <span>Licensed & insured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            {/* Emergency toggle */}
            {!isEmergency && tradeCopy.emergency && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">{category.name} Emergency?</h3>
                      <p className="text-sm text-red-700 mb-3">
                        Get routed to contractors who handle urgent calls.
                      </p>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                        <Link href={`/categories/${categorySlug}?emergency=true`}>
                          Switch to Emergency
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isEmergency && (
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 mb-3">
                    Looking for scheduled service?
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/categories/${categorySlug}`}>
                      Browse All {category.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Related categories */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-4">Other Services</h2>
              <div className="space-y-1">
                {CONTRACTOR_CATEGORIES.filter((c) => c.slug !== categorySlug)
                  .slice(0, 10)
                  .map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="block text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                <Link
                  href="/categories"
                  className="block text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2"
                >
                  View All Services →
                </Link>
              </div>
            </div>

            {/* Can't find help */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Can&apos;t find the right {category.name.toLowerCase()}?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Tell us what you need. We&apos;ll route your request to available contractors.
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href="/contractors#request-form">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Submit a Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {contractorsWithCategories.length > 0
                    ? `${contractorsWithCategories.length} ${category.name} Contractors Ready`
                    : `No ${category.name} Contractors Yet`}
                </h2>
                <p className="text-sm text-slate-500">
                  Sorted by response time and rating
                </p>
              </div>
            </div>

            {contractorsWithCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contractorsWithCategories.map((contractor) => (
                  <ContractorCard key={contractor.id} contractor={contractor as any} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <Card className="border-slate-200">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No {category.name.toLowerCase()} contractors listed yet
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    We&apos;re growing our {category.name.toLowerCase()} network in Houston. Submit your request—we&apos;ll reach out when a qualified pro joins.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="/contractors#request-form">
                        Submit Your Request
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/register/contractor">
                        Are You a {category.name}? Get Listed
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
