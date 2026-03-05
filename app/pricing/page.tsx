import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X, ArrowRight, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pricing | HoustonTexasPro — Replace 5 Tools for $199/mo',
  description:
    'Stop paying $700/mo across 5 different tools. HoustonTexasPro gives Houston contractors their website, leads, CRM, and directory listing in one place.',
  alternates: { canonical: 'https://houstontexaspro.com/pricing' },
}

const scattered = [
  { tool: 'Website hosting / builder', price: '$30/mo' },
  { tool: 'QuickBooks / invoicing', price: '$50/mo' },
  { tool: 'Angie / Thumbtack leads', price: '$150–300/mo' },
  { tool: 'Google / Facebook ads', price: '$500+/mo' },
  { tool: 'Review management tool', price: '$50/mo' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-[#0B0B0B] text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">Simple Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Stop Paying $700/mo<br />Across 5 Different Tools
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Houston contractors are juggling a website, lead gen, invoicing, ads, and reviews — all on separate platforms. HoustonTexasPro replaces them all.
          </p>
        </div>
      </div>

      {/* The math */}
      <div className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#0B0B0B] text-center mb-3">What You&apos;re Paying Right Now</h2>
          <p className="text-[#6B7280] text-center mb-10">Scattered across tools that don&apos;t talk to each other</p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Scattered tools */}
            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <h3 className="font-semibold text-[#0B0B0B]">The Old Way</h3>
              </div>
              <ul className="space-y-3">
                {scattered.map((item) => (
                  <li key={item.tool} className="flex items-center justify-between text-sm">
                    <span className="text-[#374151]">{item.tool}</span>
                    <span className="font-semibold text-red-600">{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                <span className="text-sm font-bold text-[#0B0B0B]">Total</span>
                <span className="text-lg font-bold text-red-600">$780–$930/mo</span>
              </div>
              <p className="mt-3 text-xs text-[#9CA3AF]">Plus 5 logins, 5 invoices, and hours of admin</p>
            </div>

            {/* HTP */}
            <div className="bg-white rounded-2xl border-2 border-[#0B0B0B] p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                <h3 className="font-semibold text-[#0B0B0B]">HoustonTexasPro</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Your website + subdomain',
                  'Directory listing & leads',
                  'CRM + job tracking',
                  'Customer invoicing',
                  'Review management',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-[#374151]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                <span className="text-sm font-bold text-[#0B0B0B]">Total</span>
                <span className="text-lg font-bold text-green-600">$199/mo</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-green-700 font-medium">
                <TrendingDown className="h-3.5 w-3.5" />
                Save $580–$730/mo. One login.
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-[#6B7280] mt-8">
            One job from a single lead typically pays for 2–3 months of the platform.
          </p>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B] text-center mb-3">Choose Your Plan</h2>
          <p className="text-[#6B7280] text-center mb-12">Start free. Upgrade when you&apos;re ready to grow.</p>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Free */}
            <div className="border rounded-2xl p-6 flex flex-col">
              <h3 className="font-bold text-[#0B0B0B] text-lg mb-1">Free</h3>
              <p className="text-[#6B7280] text-sm mb-4">Get discovered</p>
              <p className="text-4xl font-bold text-[#0B0B0B] mb-1">$0<span className="text-base font-normal text-[#6B7280]">/mo</span></p>
              <p className="text-sm text-[#374151] mb-6">Show up in Houston searches. No credit card.</p>
              <ul className="space-y-3 text-sm flex-1 mb-8">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Directory listing with contact info</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Public profile page</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Up to 5 photos</span></li>
                <li className="flex items-start gap-2"><X className="h-4 w-4 text-[#D1D5DB] shrink-0 mt-0.5" /><span className="text-[#9CA3AF]">Receive leads</span></li>
                <li className="flex items-start gap-2"><X className="h-4 w-4 text-[#D1D5DB] shrink-0 mt-0.5" /><span className="text-[#9CA3AF]">Mini website</span></li>
                <li className="flex items-start gap-2"><X className="h-4 w-4 text-[#D1D5DB] shrink-0 mt-0.5" /><span className="text-[#9CA3AF]">CRM & invoicing</span></li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register/contractor">Claim Free Listing</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="border-2 border-[#0B0B0B] rounded-2xl p-6 flex flex-col relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0B0B0B] text-white text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
                Most Popular
              </div>
              <h3 className="font-bold text-[#0B0B0B] text-lg mb-1">Pro</h3>
              <p className="text-[#6B7280] text-sm mb-4">Look professional + get leads</p>
              <p className="text-4xl font-bold text-[#0B0B0B] mb-1">$79<span className="text-base font-normal text-[#6B7280]">/mo</span></p>
              <p className="text-sm text-[#374151] mb-6">Your own mini-site + real project leads.</p>
              <ul className="space-y-3 text-sm flex-1 mb-8">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Everything in Free</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Mini website at <span className="font-mono text-xs bg-[#F3F4F6] px-1 py-0.5 rounded">yourco.houstontexaspro.com</span></span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Receive & respond to leads</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Up to 25 photos</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Respond to reviews</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[#374151]">Verified badge</span></li>
                <li className="flex items-start gap-2"><X className="h-4 w-4 text-[#D1D5DB] shrink-0 mt-0.5" /><span className="text-[#9CA3AF]">CRM & invoicing</span></li>
                <li className="flex items-start gap-2"><X className="h-4 w-4 text-[#D1D5DB] shrink-0 mt-0.5" /><span className="text-[#9CA3AF]">Priority placement</span></li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register/contractor">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {/* Priority */}
            <div className="border rounded-2xl p-6 flex flex-col relative bg-[#0B0B0B] text-white">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C8A951] text-[#0B0B0B] text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                Best Value
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Priority</h3>
              <p className="text-gray-400 text-sm mb-4">Replace every tool you pay for</p>
              <p className="text-4xl font-bold text-white mb-1">$199<span className="text-base font-normal text-gray-400">/mo</span></p>
              <p className="text-sm text-gray-300 mb-6">Full site + CRM. Replaces $700+/mo in tools.</p>
              <ul className="space-y-3 text-sm flex-1 mb-8">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /><span className="text-gray-200">Everything in Pro</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /><span className="text-gray-200">Full multi-page website</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /><span className="text-gray-200">CRM — jobs, customers, notes</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /><span className="text-gray-200">Invoicing & estimates</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /><span className="text-gray-200">Priority placement in search</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /><span className="text-gray-200">Unlimited photos</span></li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /><span className="text-gray-200">Featured on category pages</span></li>
              </ul>
              <Button className="w-full bg-white text-[#0B0B0B] hover:bg-white/90" asChild>
                <Link href="/register/contractor">Get Priority Access <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

          </div>

          <p className="text-center text-sm text-[#6B7280] mt-8">
            No contracts. Cancel anytime. Upgrade or downgrade whenever you need.
          </p>
        </div>
      </div>

      {/* ROI callout */}
      <div className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[#0B0B0B] mb-4">The Math Is Simple</h2>
          <p className="text-[#374151] text-lg mb-8">
            The average Houston contractor job is worth <strong>$800–$2,500</strong>. One lead from HoustonTexasPro
            pays for the entire platform for 4–12 months. Every job after that is pure margin.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { stat: '1 job', label: 'pays for ~4 months at $199/mo' },
              { stat: 'One login', label: 'instead of 5 separate tools' },
              { stat: '$580+', label: 'average monthly savings vs. scattered tools' },
            ].map((item) => (
              <div key={item.stat} className="bg-white rounded-xl border p-5">
                <p className="text-2xl font-bold text-[#0B0B0B] mb-1">{item.stat}</p>
                <p className="text-sm text-[#6B7280]">{item.label}</p>
              </div>
            ))}
          </div>
          <Button size="lg" asChild>
            <Link href="/register/contractor">
              Claim Your Free Listing <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

    </div>
  )
}
