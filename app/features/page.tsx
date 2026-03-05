import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Check,
  X,
  Shield,
  Phone,
  Globe,
  Star,
  Zap,
  Users,
  Clock,
  BarChart3,
  Palette,
  BadgeCheck,
  PhoneCall,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features | Houston Texas Pro',
  description: 'Everything Houston contractors need: routed requests, booking support, call coverage, and priority placement.',
}

const features = [
  {
    icon: Globe,
    title: 'Directory Presence',
    description: 'Your professional profile page with business info, service areas, gallery, and customer reviews — visible to all Houston homeowners searching for contractors.',
  },
  {
    icon: PhoneCall,
    title: 'Routed Requests',
    description: 'Homeowner requests are intelligently routed to contractors who can respond. No missed calls, no wasted leads — only qualified requests delivered to your dashboard.',
  },
  {
    icon: Shield,
    title: 'Booking Support',
    description: 'Request handling and booking support ensures every inquiry gets a response, even when you\'re on the job. Never lose a customer to a missed message.',
  },
  {
    icon: Phone,
    title: 'Call Coverage',
    description: 'Intelligent call coverage handles incoming calls when you\'re unavailable. After-hours and overflow coverage available on Elite.',
  },
  {
    icon: Zap,
    title: 'Priority Routing',
    description: 'Elite contractors appear first in emergency searches and receive requests before standard listings. Be the first contractor homeowners see.',
  },
  {
    icon: Star,
    title: 'Reviews & Responses',
    description: 'Collect verified customer reviews and respond directly. Build credibility that wins more jobs.',
  },
  {
    icon: Palette,
    title: 'Template Customization',
    description: 'Customize your contractor profile with your brand colors, layouts, fonts, and taglines. Make your page stand out from the competition.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Badge',
    description: 'Pro and Elite contractors receive a verified badge, signaling to homeowners that you\'re a trusted, active professional.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard & Analytics',
    description: 'Track your requests, manage leads, monitor reviews, and measure your performance from a single contractor dashboard.',
  },
  {
    icon: Clock,
    title: 'After-Hours Coverage',
    description: 'Elite contractors get after-hours and overflow coverage. Emergencies don\'t wait — and neither should your availability.',
  },
  {
    icon: Users,
    title: 'Emergency-First Placement',
    description: 'Elite contractors appear at the top of emergency search results. When homeowners need help now, they find you first.',
  },
  {
    icon: Globe,
    title: 'Photo Gallery',
    description: 'Showcase your work with a professional photo gallery. Starter gets 5 photos, Pro gets 25, and Elite gets unlimited.',
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[#0B0B0B] text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Everything You Need to
            <br />
            Respond & Grow
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            From directory presence to priority routing and call coverage.
            For emergencies, scheduled service, and everything in between.
          </p>
          <Button size="lg" className="bg-white text-[#0B0B0B] hover:bg-white/90 px-8 py-6 rounded-full text-base" asChild>
            <Link href="/register/contractor">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="p-6">
              <feature.icon className="h-8 w-8 text-[#1F3C58] mb-4" />
              <h3 className="font-semibold text-[#0B0B0B] text-lg mb-2">{feature.title}</h3>
              <p className="text-[#374151] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#F5F5F5] py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B] text-center mb-12">Compare Plans</h2>

          <div className="bg-white rounded-2xl overflow-hidden border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-[#0B0B0B] font-semibold">Feature</th>
                  <th className="text-center p-4 text-[#0B0B0B] font-semibold">
                    Starter
                    <span className="block text-sm font-normal text-[#6B7280]">$0/mo</span>
                  </th>
                  <th className="text-center p-4 text-[#0B0B0B] font-semibold bg-[#F5F5F5]">
                    Pro
                    <span className="block text-sm font-normal text-[#6B7280]">$149/mo</span>
                  </th>
                  <th className="text-center p-4 text-[#0B0B0B] font-semibold">
                    Elite
                    <span className="block text-sm font-normal text-[#6B7280]">$299/mo</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Directory presence', starter: true, responding: true, priority: true },
                  { feature: 'Routed requests', starter: false, responding: true, priority: true },
                  { feature: 'Booking support', starter: false, responding: true, priority: true },
                  { feature: 'Call coverage', starter: false, responding: 'Standard', priority: 'After-hours + overflow' },
                  { feature: 'Gallery photos', starter: '5', responding: '25', priority: 'Unlimited' },
                  { feature: 'Template customization', starter: false, responding: true, priority: true },
                  { feature: 'Respond to reviews', starter: false, responding: true, priority: true },
                  { feature: 'Verified badge', starter: false, responding: true, priority: true },
                  { feature: 'Featured badge', starter: false, responding: false, priority: true },
                  { feature: 'Search placement', starter: 'Standard', responding: 'Priority', priority: 'Emergency-first' },
                  { feature: 'Emergency routing', starter: false, responding: 'Standard', priority: 'Priority' },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                    <td className="p-4 text-sm text-[#374151]">{row.feature}</td>
                    <td className="p-4 text-center">
                      {renderCell(row.starter)}
                    </td>
                    <td className="p-4 text-center bg-[#F5F5F5]/50">
                      {renderCell(row.responding)}
                    </td>
                    <td className="p-4 text-center">
                      {renderCell(row.priority)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Free listings can be discovered. Only responding contractors receive routed requests.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#0B0B0B] mb-4">Ready to Start Responding?</h2>
          <p className="text-[#374151] mb-8">
            Join Houston&apos;s contractor network. Cancel anytime. No contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/register/contractor">
                Start Receiving Requests <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/for-contractors">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderCell(value: boolean | string) {
  if (value === true) {
    return <Check className="h-5 w-5 text-green-600 mx-auto" />
  }
  if (value === false) {
    return <X className="h-5 w-5 text-[#9CA3AF] mx-auto" />
  }
  return <span className="text-sm text-[#374151]">{value}</span>
}
