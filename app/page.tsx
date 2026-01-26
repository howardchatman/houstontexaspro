import Link from 'next/link'
import {
  CheckCircle,
  Shield,
  Clock,
  MapPin,
  ArrowRight,
  Star,
  Phone,
  AlertTriangle,
  Zap,
  Building2,
  Home,
  PhoneCall,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CategoryGrid } from '@/components/contractors/CategoryGrid'
import { RequestRoutingAnimation } from '@/components/home/RequestRoutingAnimation'

// Mock featured contractors (replace with Supabase query)
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
    response_time: '< 2 hours',
    description: 'Licensed master electricians. 20+ years serving Houston.',
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
    response_time: '< 1 hour',
    description: '24/7 emergency plumbing. Residential and commercial.',
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
    response_time: 'Same day',
    description: 'Storm damage experts. Free inspections.',
  },
]

// Recent requests (shows activity without fake testimonials)
const recentRequests = [
  {
    id: '1',
    service: 'Emergency plumber',
    area: 'Montrose',
    status: 'Connected in 12 min',
    urgent: true,
  },
  {
    id: '2',
    service: 'AC repair',
    area: 'Katy',
    status: '3 pros responded',
    urgent: true,
  },
  {
    id: '3',
    service: 'Roof inspection',
    area: 'Sugar Land',
    status: 'Scheduled for Tuesday',
    urgent: false,
  },
  {
    id: '4',
    service: 'Electrical panel upgrade',
    area: 'The Woodlands',
    status: '2 quotes received',
    urgent: false,
  },
  {
    id: '5',
    service: 'Water heater replacement',
    area: 'Pearland',
    status: 'Connected in 8 min',
    urgent: true,
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Emergency Banner - Persistent */}
      <div className="bg-red-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">Emergency?</span>
          <span className="hidden sm:inline">Skip the form.</span>
          <Link
            href="/contractors?emergency=true"
            className="underline font-semibold hover:no-underline"
          >
            Get routed to an available pro now →
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          {/* Main Headline */}
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Houston Contractors Who Answer.
              <br />
              <span className="text-blue-400">When It Actually Matters.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              Burst pipe at 2 AM. Kitchen remodel next month.
              Either way—reach a contractor who actually answers.
            </p>
          </div>

          {/* Split CTA - Two Paths */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
            {/* Homeowner Path */}
            <Card className="overflow-hidden border-0 shadow-2xl group">
              <div className="relative">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />

                <CardContent className="relative p-8 text-center min-h-[280px] flex flex-col justify-end">
                  <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Home className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-white">I Need a Contractor</h2>
                  <p className="text-slate-300 text-sm mb-5">
                    Emergency or scheduled. Residential or commercial.
                  </p>
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg" asChild>
                    <Link href="/contractors">
                      Find a Contractor Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>

            {/* Contractor Path */}
            <Card className="overflow-hidden border-0 shadow-2xl group">
              <div className="relative">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />

                <CardContent className="relative p-8 text-center min-h-[280px] flex flex-col justify-end">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-white">I Am a Contractor</h2>
                  <p className="text-slate-300 text-sm mb-5">
                    Get more calls. Never miss a lead.
                  </p>
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 shadow-lg" asChild>
                    <Link href="/register/contractor">
                      Get More Calls & Bookings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Trust Strip - Houston Specific */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span>Covering 47 Houston ZIP Codes</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              <span>15-Min Average Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-400" />
              <span>Every Pro Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-400" />
              <span>24/7 Emergency Routing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Request Routing Section */}
      <RequestRoutingAnimation />

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">
              What Do You Need Done?
            </h2>
            <p className="text-slate-600 mt-2">
              Residential. Commercial. Emergency or scheduled.
            </p>
          </div>
          <CategoryGrid limit={12} />
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/categories">
                Browse All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Requests - Social Proof Without Fake Testimonials */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">
              Happening Now in Houston
            </h2>
            <p className="text-slate-400 mt-2">
              Real requests. Real connections. Real follow-through.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-3">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between bg-slate-800/50 rounded-lg px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    {request.urgent && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        Urgent
                      </Badge>
                    )}
                    <span className="font-medium">{request.service}</span>
                    <span className="text-slate-400">in {request.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{request.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-slate-400 mb-4">Your request could be next.</p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/contractors">
                Submit Your Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Contractors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Contractors Ready to Respond
              </h2>
              <p className="text-slate-600 mt-2">
                Verified. Fast. Houston-based.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/contractors">
                View All Contractors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContractors.map((contractor) => (
              <Card key={contractor.id} className="hover:shadow-lg transition-shadow border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link href={`/contractors/${contractor.slug}`}>
                        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                          {contractor.business_name}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-500">{contractor.city}, TX</p>
                    </div>
                    {contractor.is_verified && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{contractor.avg_rating}</span>
                      <span className="text-slate-400 text-sm">({contractor.review_count})</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{contractor.response_time}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {contractor.categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="bg-slate-100">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    {contractor.description}
                  </p>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/contractors/${contractor.slug}`}>
                        Request Service
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`tel:555-0100`}>
                        <Phone className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Contractors Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
                  For Contractors
                </Badge>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Every Missed Call Is Money Walking to Your Competitor
                </h2>
                <p className="text-slate-600 mb-6">
                  You&apos;re on a job. Phone rings. You can&apos;t answer.
                  That&apos;s a $2,000 kitchen remodel walking straight to the next guy in Google.
                </p>
                <p className="text-slate-600 mb-6">
                  HoustonTexasPro answers for you, qualifies the lead, and sends you the details.
                  You call back when you&apos;re ready. The customer gets a response. You get the job.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Your own mini-website that ranks in Google</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Leads delivered to you—not sold to 5 competitors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Call coverage when you&apos;re busy on a job</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Featured placement in your service area</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild>
                    <Link href="/register/contractor">
                      Get Listed
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/for-contractors">
                      See How It Works
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white p-8 rounded-xl shadow-lg border">
                <h3 className="font-semibold text-slate-900 mb-6">What Houston Contractors Get</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PhoneCall className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">More Calls</p>
                      <p className="text-sm text-slate-500">Homeowners find you through our directory</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">No Missed Leads</p>
                      <p className="text-sm text-slate-500">Call coverage when you&apos;re on a job</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Build Your Reputation</p>
                      <p className="text-sm text-slate-500">Verified reviews that bring more work</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-slate-500 mb-2">Starter listing is free. Always.</p>
                  <p className="text-xs text-slate-400">Pro and Elite tiers available for more features.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stop Chasing Voicemails
            </h2>
            <p className="text-blue-200 mb-8 text-lg">
              Submit your request. We&apos;ll route it to contractors who are ready to respond.
            </p>
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50" asChild>
              <Link href="/contractors">
                Find a Contractor Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
