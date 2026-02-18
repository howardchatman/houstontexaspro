'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle, CreditCard, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ContractorTier } from '@/types'
import { TIER_LIMITS } from '@/types'

interface BillingClientProps {
  tier: ContractorTier
  tierDisplayName: string
  tierDescription: string
  subscriptionStatus: string
  subscriptionPeriodEnd: string | null
  hasStripeCustomer: boolean
  isPaid: boolean
  photoCount: number
  leadsThisMonth: number
}

export function BillingClient({
  tier,
  tierDisplayName,
  tierDescription,
  subscriptionStatus,
  subscriptionPeriodEnd,
  hasStripeCustomer,
  isPaid,
  photoCount,
  leadsThisMonth,
}: BillingClientProps) {
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'
  const [portalLoading, setPortalLoading] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null)

  const handleManageSubscription = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setPortalLoading(false)
    }
  }

  const handleUpgrade = async (targetTier: 'responding_pro' | 'priority_pro') => {
    setUpgradeLoading(targetTier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: targetTier }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setUpgradeLoading(null)
    }
  }

  const galleryLimit = TIER_LIMITS[tier].gallery
  const statusLabel = subscriptionStatus === 'active' ? 'Active'
    : subscriptionStatus === 'past_due' ? 'Past Due'
    : subscriptionStatus === 'canceled' ? 'Canceled'
    : subscriptionStatus === 'trialing' ? 'Trial'
    : 'None'

  const statusColor = subscriptionStatus === 'active' ? 'bg-green-100 text-green-800'
    : subscriptionStatus === 'past_due' ? 'bg-yellow-100 text-yellow-800'
    : 'bg-gray-100 text-[#374151]'

  return (
    <div className="space-y-6">
      {isSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Subscription activated</p>
            <p className="text-sm text-green-700">Your plan is now active. You can start receiving routed requests.</p>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            <Badge className={statusColor}>{statusLabel}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-[#0B0B0B]">{tierDisplayName}</h3>
            <p className="text-[#374151] text-sm mt-1">{tierDescription}</p>
          </div>

          {isPaid && subscriptionPeriodEnd && (
            <p className="text-sm text-[#6B7280] mb-4">
              Next billing date: {new Date(subscriptionPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}

          <div className="flex gap-3">
            {hasStripeCustomer && isPaid && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={portalLoading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {portalLoading ? 'Loading...' : 'Manage Subscription'}
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Routed Requests */}
            <div className="p-4 bg-[#F5F5F5] rounded-lg">
              <p className="text-sm text-[#6B7280] mb-1">Routed Requests</p>
              {isPaid ? (
                <>
                  <p className="text-2xl font-bold text-[#0B0B0B]">{leadsThisMonth}</p>
                  <p className="text-xs text-[#6B7280] mt-1">Requests handled this month</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-[#9CA3AF]">Not included</p>
                  <p className="text-xs text-[#6B7280] mt-1">Upgrade to receive routed requests</p>
                </>
              )}
            </div>

            {/* Gallery Photos */}
            <div className="p-4 bg-[#F5F5F5] rounded-lg">
              <p className="text-sm text-[#6B7280] mb-1">Gallery Photos</p>
              <p className="text-2xl font-bold text-[#0B0B0B]">
                {photoCount}
                {galleryLimit !== Infinity && (
                  <span className="text-base font-normal text-[#6B7280]"> / {galleryLimit}</span>
                )}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                {galleryLimit === Infinity ? 'Unlimited' : `${galleryLimit - photoCount} remaining`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {tier !== 'priority_pro' && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tier === 'starter' && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-[#0B0B0B]">Responding Pro</h4>
                    <p className="text-sm text-[#374151]">
                      Receive routed requests with booking support. $149/mo.
                    </p>
                  </div>
                  <Button
                    onClick={() => handleUpgrade('responding_pro')}
                    disabled={upgradeLoading !== null}
                  >
                    {upgradeLoading === 'responding_pro' ? 'Loading...' : (
                      <>
                        Start Receiving Requests
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-[#0B0B0B]">Priority Pro</h4>
                  <p className="text-sm text-[#374151]">
                    Priority routing, emergency-first placement, after-hours coverage. $299/mo.
                  </p>
                </div>
                <Button
                  onClick={() => handleUpgrade('priority_pro')}
                  disabled={upgradeLoading !== null}
                  variant={tier === 'starter' ? 'outline' : 'default'}
                >
                  {upgradeLoading === 'priority_pro' ? 'Loading...' : (
                    <>
                      Get Priority Routing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
