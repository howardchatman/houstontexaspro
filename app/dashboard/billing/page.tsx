import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTierDisplayName, getTierDescription, isPaidTier } from '@/lib/tier'
import { BillingClient } from './BillingClient'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard/billing')
  }

  const { data: contractor } = await supabase
    .from('contractors')
    .select('id, tier, subscription_status, subscription_period_end, monthly_lead_count, stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!contractor) {
    redirect('/register/contractor')
  }

  // Count gallery photos
  const { count: photoCount } = await supabase
    .from('gallery_images')
    .select('*', { count: 'exact', head: true })
    .eq('contractor_id', contractor.id)

  // Count leads this month
  const { count: leadsThisMonth } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('contractor_id', contractor.id)
    .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B0B0B]">Billing & Plan</h1>
        <p className="text-[#374151] mt-2">
          Manage your subscription and view usage
        </p>
      </div>

      <BillingClient
        tier={contractor.tier}
        tierDisplayName={getTierDisplayName(contractor.tier)}
        tierDescription={getTierDescription(contractor.tier)}
        subscriptionStatus={contractor.subscription_status}
        subscriptionPeriodEnd={contractor.subscription_period_end}
        hasStripeCustomer={!!contractor.stripe_customer_id}
        isPaid={isPaidTier(contractor.tier)}
        photoCount={photoCount || 0}
        leadsThisMonth={leadsThisMonth || 0}
      />
    </div>
  )
}
