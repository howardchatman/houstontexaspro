'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, X, ArrowRight, Shield, Phone, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OnboardingPlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly')

  const handleSelectStarter = async () => {
    setLoading('starter')
    try {
      await fetch('/api/onboarding/complete', { method: 'POST' })
      router.push('/dashboard')
    } catch {
      setLoading(null)
    }
  }

  const handleSelectPaid = async (tier: 'pro' | 'elite') => {
    setLoading(tier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, interval }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoading(null)
      }
    } catch {
      setLoading(null)
    }
  }

  const tiers = [
    {
      id: 'starter' as const,
      name: 'Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      period: '/mo',
      description: 'Directory Presence',
      subtitle: 'Visibility only. No routed requests.',
      cta: 'Join Free',
      highlight: false,
      features: [
        { text: 'Business profile listing', included: true },
        { text: 'Up to 5 gallery photos', included: true },
        { text: 'Customer reviews visible', included: true },
        { text: 'Routed requests & leads', included: false },
        { text: 'Booking support', included: false },
        { text: 'Call coverage', included: false },
        { text: 'Template customization', included: false },
        { text: 'Verified badge', included: false },
        { text: 'Review responses', included: false },
      ],
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      monthlyPrice: 79,
      annualPrice: 79,
      period: '/mo',
      description: 'Mini website + leads',
      subtitle: 'Your own mini-site + receive routed requests.',
      cta: 'Start Receiving Requests',
      highlight: true,
      badge: 'Most Contractors Choose This',
      features: [
        { text: 'Everything in Starter', included: true },
        { text: 'Mini website at yourco.houstontexaspro.com', included: true },
        { text: 'Routed requests & leads', included: true },
        { text: 'Booking support', included: true },
        { text: 'Standard call coverage', included: true },
        { text: 'Up to 25 gallery photos', included: true },
        { text: 'Verified badge', included: true },
        { text: 'Respond to reviews', included: true },
        { text: 'Priority search placement', included: false },
      ],
    },
    {
      id: 'elite' as const,
      name: 'Elite',
      monthlyPrice: 199,
      annualPrice: 199,
      period: '/mo',
      description: 'Full site + CRM',
      subtitle: 'Replace $700+/mo in tools. One platform.',
      cta: 'Get Priority Routing',
      highlight: false,
      badge: 'Best Value',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Full multi-page website', included: true },
        { text: 'CRM — jobs, customers, notes', included: true },
        { text: 'Invoicing & estimates', included: true },
        { text: 'Priority routing for all requests', included: true },
        { text: 'Emergency-first placement', included: true },
        { text: 'After-hours & overflow coverage', included: true },
        { text: 'Unlimited gallery photos', included: true },
        { text: 'Featured badge & top of results', included: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Image
            src="/htp_logos/htp_logo_white_background.png"
            alt="Houston Texas Pro"
            width={160}
            height={48}
            className="h-10 w-auto"
          />
          <button
            onClick={handleSelectStarter}
            className="text-sm text-[#6B7280] hover:text-[#374151]"
          >
            Skip for now
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-4">
            Choose Your Plan
          </h1>
          <p className="text-[#374151] text-lg max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready to grow.
          </p>
        </div>

        {/* Billing interval toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setInterval('monthly')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              interval === 'monthly'
                ? 'bg-[#0B0B0B] text-white'
                : 'bg-white text-[#374151] border hover:border-[#0B0B0B]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('annual')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              interval === 'annual'
                ? 'bg-[#0B0B0B] text-white'
                : 'bg-white text-[#374151] border hover:border-[#0B0B0B]'
            }`}
          >
            Annual
            <span className="ml-1.5 text-xs text-green-600 font-semibold">2 months free</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl p-6 flex flex-col ${
                tier.highlight
                  ? 'border-2 border-[#0B0B0B] shadow-lg'
                  : 'border border-gray-200'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-6 bg-[#0B0B0B] text-white text-xs px-3 py-1 rounded-full">
                  {tier.badge}
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#0B0B0B] mb-1">{tier.name}</h2>
                <p className="text-sm text-[#6B7280] mb-4">{tier.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#0B0B0B]">
                    {tier.monthlyPrice === 0 ? '$0' : `$${interval === 'monthly' ? tier.monthlyPrice : tier.annualPrice}`}
                  </span>
                  <span className="text-[#6B7280]">{tier.period}</span>
                </div>
                {interval === 'annual' && tier.monthlyPrice > 0 && (
                  <p className="text-xs text-green-600 font-medium mt-1">Billed annually</p>
                )}
                <p className="text-sm text-[#374151] mt-2">{tier.subtitle}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-[#9CA3AF] mt-0.5 shrink-0" />
                    )}
                    <span className={feature.included ? 'text-[#374151]' : 'text-[#9CA3AF]'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() =>
                  tier.id === 'starter'
                    ? handleSelectStarter()
                    : handleSelectPaid(tier.id)
                }
                variant={tier.highlight ? 'default' : 'outline'}
                className="w-full"
                disabled={loading !== null}
              >
                {loading === tier.id ? 'Please wait...' : (
                  <>
                    {tier.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Access model explanation */}
        <div className="text-center mb-12">
          <p className="text-sm text-[#6B7280]">
            Free listings can be discovered. Only responding contractors receive routed requests.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 text-sm text-[#374151]">
            <Shield className="h-5 w-5 text-[#6B7280] shrink-0" />
            <span>Cancel anytime. No contracts.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#374151]">
            <Phone className="h-5 w-5 text-[#6B7280] shrink-0" />
            <span>Intelligent routing to your line.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#374151]">
            <Zap className="h-5 w-5 text-[#6B7280] shrink-0" />
            <span>Upgrade or downgrade anytime.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
