import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  ArrowRight,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getTierDisplayName, isPaidTier } from '@/lib/tier'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get contractor profile
  const { data: contractor } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get recent leads
  const { data: recentLeads } = contractor
    ? await supabase
        .from('leads')
        .select('*')
        .eq('contractor_id', contractor.id)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] }

  // Get lead counts
  const { count: totalLeads } = contractor
    ? await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('contractor_id', contractor.id)
    : { count: 0 }

  const { count: newLeads } = contractor
    ? await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('contractor_id', contractor.id)
        .eq('status', 'new')
    : { count: 0 }

  // Get recent reviews
  const { data: recentReviews } = contractor
    ? await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('contractor_id', contractor.id)
        .order('created_at', { ascending: false })
        .limit(3)
    : { data: [] }

  // If no contractor profile, show setup prompt
  if (!contractor) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Complete Your Profile
            </CardTitle>
            <CardDescription>
              You need to create a contractor profile to start receiving leads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/register/contractor">Create Contractor Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-[#0B0B0B]">
            Welcome back, {contractor.business_name}!
          </h1>
          <Badge variant="secondary" className="text-sm">
            {getTierDisplayName(contractor.tier)}
          </Badge>
        </div>
        <p className="text-[#6B7280]">
          Here&apos;s what&apos;s happening with your business
        </p>
      </div>

      {/* Starter tier upgrade banner */}
      {!isPaidTier(contractor.tier) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">
                    You&apos;re on the Starter plan
                  </p>
                  <p className="text-sm text-blue-700">
                    Upgrade to start receiving routed requests.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="default" asChild>
                <Link href="/dashboard/billing">Upgrade Plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile completion warning */}
      {(!contractor.description || !contractor.phone) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Complete your profile
                  </p>
                  <p className="text-sm text-yellow-700">
                    Add a description and contact info to attract more customers
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard/profile">Complete Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Total Leads</p>
                <p className="text-3xl font-bold">{totalLeads || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-[#1F3C58]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">New Leads</p>
                <p className="text-3xl font-bold">{newLeads || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            {(newLeads ?? 0) > 0 && (
              <Badge className="mt-2 bg-green-500">Action Required</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Reviews</p>
                <p className="text-3xl font-bold">{contractor.review_count}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Rating</p>
                <p className="text-3xl font-bold">
                  {contractor.avg_rating > 0
                    ? contractor.avg_rating.toFixed(1)
                    : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600 fill-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Your latest customer inquiries</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/leads">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-start justify-between p-3 bg-[#F5F5F5] rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <div className="flex items-center gap-3 text-sm text-[#6B7280] mt-1">
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                        )}
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                      {lead.message && (
                        <p className="text-sm text-[#374151] mt-2 line-clamp-2">
                          {lead.message}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={lead.status === 'new' ? 'default' : 'secondary'}
                    >
                      {lead.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#6B7280]">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No leads yet</p>
                <p className="text-sm">
                  Complete your profile to start receiving leads
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>What customers are saying</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/reviews">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentReviews && recentReviews.length > 0 ? (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="p-3 bg-[#F5F5F5] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">
                        {review.profiles?.full_name || 'Anonymous'}
                      </p>
                      <div className="flex">
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
                    </div>
                    <p className="text-sm text-[#374151] line-clamp-2">
                      {review.content}
                    </p>
                    {!review.contractor_response && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto mt-2"
                        asChild
                      >
                        <Link href="/dashboard/reviews">Respond</Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#6B7280]">
                <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No reviews yet</p>
                <p className="text-sm">
                  Reviews will appear here once customers leave feedback
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
