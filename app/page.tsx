import Link from 'next/link'
import {
  CheckCircle,
  Shield,
  Clock,
  ThumbsUp,
  ArrowRight,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchBar } from '@/components/contractors/SearchBar'
import { CategoryGrid } from '@/components/contractors/CategoryGrid'

// Mock featured contractors for demo (replace with Supabase query)
const featuredContractors = [
  {
    id: '1',
    business_name: 'Houston Premier Electric',
    slug: 'houston-premier-electric',
    city: 'Houston',
    avg_rating: 4.9,
    review_count: 127,
    categories: ['Electrical'],
    is_verified: true,
    description: 'Licensed electricians serving Houston for over 20 years.',
  },
  {
    id: '2',
    business_name: 'Lone Star Plumbing',
    slug: 'lone-star-plumbing',
    city: 'Katy',
    avg_rating: 4.8,
    review_count: 89,
    categories: ['Plumbing'],
    is_verified: true,
    description: '24/7 emergency plumbing services for residential and commercial.',
  },
  {
    id: '3',
    business_name: 'Texas Roof Masters',
    slug: 'texas-roof-masters',
    city: 'Sugar Land',
    avg_rating: 4.7,
    review_count: 156,
    categories: ['Roofing'],
    is_verified: true,
    description: 'Expert roofing installation, repair, and inspection services.',
  },
]

// Mock recent reviews
const recentReviews = [
  {
    id: '1',
    contractor_name: 'Houston Premier Electric',
    contractor_slug: 'houston-premier-electric',
    author: 'Sarah M.',
    rating: 5,
    content: 'Excellent work! They rewired our entire house and were professional throughout.',
    date: '2 days ago',
  },
  {
    id: '2',
    contractor_name: 'Lone Star Plumbing',
    contractor_slug: 'lone-star-plumbing',
    author: 'John D.',
    rating: 5,
    content: 'Fast response to our emergency. Fixed the leak in no time. Highly recommend!',
    date: '3 days ago',
  },
  {
    id: '3',
    contractor_name: 'Texas Roof Masters',
    contractor_slug: 'texas-roof-masters',
    author: 'Mike R.',
    rating: 4,
    content: 'Great job on our roof replacement. Clean work and fair pricing.',
    date: '1 week ago',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Trusted Contractors in Houston
            </h1>
            <p className="text-xl text-blue-100">
              Connect with verified professionals for all your home improvement
              and commercial construction needs
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar variant="hero" />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>500+ Verified Contractors</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>10,000+ Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-300" />
              <span>Licensed & Insured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <p className="text-gray-600 mt-2">
              Find the right contractor for your project
            </p>
          </div>
          <CategoryGrid limit={9} />
        </div>
      </section>

      {/* Featured Contractors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Contractors
              </h2>
              <p className="text-gray-600 mt-2">
                Top-rated professionals in Houston
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/contractors">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContractors.map((contractor) => (
              <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link href={`/contractors/${contractor.slug}`}>
                        <h3 className="font-semibold text-lg hover:text-blue-900">
                          {contractor.business_name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">{contractor.city}, TX</p>
                    </div>
                    {contractor.is_verified && (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(contractor.avg_rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {contractor.avg_rating} ({contractor.review_count} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {contractor.categories.map((cat) => (
                      <Badge key={cat} variant="secondary">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {contractor.description}
                  </p>

                  <Button asChild className="w-full">
                    <Link href={`/contractors/${contractor.slug}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose Houston Texas Pro?</h2>
            <p className="text-blue-200 mt-2">
              We make finding the right contractor easy and safe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Pros</h3>
              <p className="text-blue-200 text-sm">
                All contractors are licensed, insured, and background-checked
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real Reviews</h3>
              <p className="text-blue-200 text-sm">
                Read honest reviews from verified customers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quick Response</h3>
              <p className="text-blue-200 text-sm">
                Get quotes fast with our AI-powered lead system
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free to Use</h3>
              <p className="text-blue-200 text-sm">
                No cost to search and contact contractors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Recent Reviews
            </h2>
            <p className="text-gray-600 mt-2">
              See what Houston homeowners are saying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {recentReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">&quot;{review.content}&quot;</p>
                  <div className="border-t pt-4">
                    <p className="font-medium">{review.author}</p>
                    <Link
                      href={`/contractors/${review.contractor_slug}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {review.contractor_name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Are You a Contractor?
            </h2>
            <p className="text-gray-600 mb-8">
              Join Houston Texas Pro and connect with thousands of potential
              customers looking for your services. Get your free listing today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register/contractor">
                  List Your Business - It&apos;s Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
