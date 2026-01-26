import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/contractors/SearchBar'
import { ContractorCard } from '@/components/contractors/ContractorCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CONTRACTOR_CATEGORIES } from '@/types'
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  MapPin,
  ArrowRight,
  Phone,
  MessageSquare,
} from 'lucide-react'

export const metadata = {
  title: 'Find Houston Contractors | HoustonTexasPro',
  description: 'Connect with verified Houston contractors who respond fast. Emergency and scheduled service for residential and commercial projects.',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ContractorsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const isEmergency = params.emergency === 'true'

  const supabase = await createClient()

  // Fetch contractors with their categories
  const { data: contractors } = await supabase
    .from('contractors')
    .select(`
      *,
      contractor_categories (
        category_id,
        categories (
          id,
          name,
          slug
        )
      )
    `)
    .order('is_featured', { ascending: false })
    .order('avg_rating', { ascending: false })
    .limit(20)

  // Transform data to include categories array
  const contractorsWithCategories = contractors?.map((contractor) => ({
    ...contractor,
    categories: contractor.contractor_categories?.map(
      (cc: { categories: { id: string; name: string; slug: string } }) => cc.categories
    ) || [],
  })) || []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className={`${isEmergency ? 'bg-red-900' : 'bg-slate-900'} text-white py-12`}>
        <div className="container mx-auto px-4">
          {isEmergency && (
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                Emergency Mode
              </Badge>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isEmergency
              ? 'Emergency Contractors Available Now'
              : 'Houston Contractors Ready to Respond'}
          </h1>
          <p className="text-slate-300 mb-8 max-w-2xl">
            {isEmergency
              ? 'These contractors handle urgent calls. Describe your emergency and we\'ll route you to someone available right now.'
              : 'Verified professionals for residential and commercial projects. Submit a request—get a real response.'}
          </p>

          <SearchBar variant="hero" />

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>{contractorsWithCategories.length} contractors available</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>15-min average response</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-yellow-400" />
              <span>Serving Greater Houston</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            {/* Emergency toggle */}
            {!isEmergency && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">Need Help Now?</h3>
                      <p className="text-sm text-red-700 mb-3">
                        Get routed to contractors who handle emergencies.
                      </p>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                        <Link href="/contractors?emergency=true">
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
                    Looking for scheduled service instead?
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contractors">
                      Browse All Contractors
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-4">Filter by Service</h2>
              <div className="space-y-1">
                {CONTRACTOR_CATEGORIES.slice(0, 12).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}${isEmergency ? '?emergency=true' : ''}`}
                    className="block text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded transition-colors"
                  >
                    {category.name}
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

            {/* Can't find help module */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Can&apos;t find the right fit?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Tell us what you need. We&apos;ll route your request to available contractors who match your job.
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href="#request-form">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Submit a Request
                  </Link>
                </Button>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  We don&apos;t sell your info.
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {contractorsWithCategories.length > 0
                    ? `${contractorsWithCategories.length} Contractors Ready`
                    : 'No Contractors Listed Yet'}
                </h2>
                <p className="text-sm text-slate-500">
                  {isEmergency
                    ? 'Showing contractors who handle emergency calls'
                    : 'Sorted by response time and rating'}
                </p>
              </div>
            </div>

            {contractorsWithCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contractorsWithCategories.map((contractor) => (
                  <ContractorCard key={contractor.id} contractor={contractor} />
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
                    No contractors listed yet
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    We&apos;re growing fast. Submit your request anyway—we&apos;ll reach out if a qualified contractor becomes available in your area.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="#request-form">
                        Submit Your Request
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/register/contractor">
                        Are You a Contractor? Get Listed
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Request Form Section */}
            <div id="request-form" className="mt-12">
              <Card className="border-slate-200">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Tell Us What You Need
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Describe your project or emergency. We&apos;ll route it to contractors who can help.
                  </p>

                  {/* Simple request capture - this would be a real form component */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        What do you need done?
                      </label>
                      <select className="w-full px-3 py-2 border rounded-lg text-slate-900">
                        <option>Select a service</option>
                        {CONTRACTOR_CATEGORIES.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        When do you need help?
                      </label>
                      <select className="w-full px-3 py-2 border rounded-lg text-slate-900">
                        <option value="emergency">Emergency — I need help now</option>
                        <option value="today">Today</option>
                        <option value="this-week">This week</option>
                        <option value="flexible">Flexible — I can schedule</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Your ZIP code
                      </label>
                      <input
                        type="text"
                        placeholder="77001"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Describe the job
                      </label>
                      <textarea
                        rows={3}
                        placeholder="What's happening? The more detail, the better..."
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <Button size="lg">
                      Send Request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-sm text-slate-500">
                      Your info goes only to matching contractors. We don&apos;t sell leads.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
