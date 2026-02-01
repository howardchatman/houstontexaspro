import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building, MessageSquare, Users, DollarSign } from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = createAdminClient()

  const [
    { count: totalContractors },
    { count: totalLeads },
    { count: totalUsers },
    { count: newLeads },
    { data: recentLeads },
    { data: recentContractors },
  ] = await Promise.all([
    supabase.from('contractors').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    supabase
      .from('leads')
      .select('*, contractors(business_name)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('contractors')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      label: 'Total Contractors',
      value: totalContractors ?? 0,
      icon: Building,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Total Leads',
      value: totalLeads ?? 0,
      icon: MessageSquare,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Total Users',
      value: totalUsers ?? 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Revenue',
      value: '$--',
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-700',
      badge: 'Coming Soon',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of Houston Texas Pro platform.
          {newLeads ? ` ${newLeads} new leads this week.` : ''}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              {stat.badge && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {stat.badge}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h2>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-500">
                        → {lead.contractors?.business_name || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={lead.status === 'new' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {lead.status}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No leads yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Contractors */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Contractors</h2>
            {recentContractors && recentContractors.length > 0 ? (
              <div className="space-y-3">
                {recentContractors.map((contractor: any) => (
                  <div key={contractor.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{contractor.business_name}</p>
                      <p className="text-xs text-gray-500">{contractor.profiles?.email}</p>
                    </div>
                    <div className="flex gap-1">
                      {contractor.is_verified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Verified</Badge>
                      )}
                      {contractor.is_featured && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">Featured</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No contractors yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
