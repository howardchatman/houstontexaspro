import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, X, Shield, Phone, Globe, Star, Zap, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Contractors | Houston Texas Pro',
  description: 'Join Houston\'s contractor network. Get routed requests, booking support, and priority placement.',
}

export default function ForContractorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[#0B0B0B] text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Houston Contractors
            <br />
            Who Answer
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            When it actually matters. For emergencies, scheduled service, and everything in between.
          </p>
          <p className="text-[#9CA3AF] text-base max-w-xl mx-auto mb-10">
            Get listed in Houston&apos;s contractor directory. Upgrade to receive intelligently routed requests from homeowners who need your services now.
          </p>
          <Button size="lg" className="bg-white text-[#0B0B0B] hover:bg-white/90 px-8 py-6 rounded-full text-base" asChild>
            <Link href="/register/contractor">
              Join the Network <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0B0B0B] text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0B0B0B] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
              <h3 className="font-semibold text-[#0B0B0B] mb-2">Create Your Profile</h3>
              <p className="text-[#374151] text-sm">Sign up, add your business info, select your service categories and areas.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0B0B0B] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h3 className="font-semibold text-[#0B0B0B] mb-2">Choose Your Plan</h3>
              <p className="text-[#374151] text-sm">Start free for directory presence, or upgrade to receive routed requests with booking support.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0B0B0B] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h3 className="font-semibold text-[#0B0B0B] mb-2">Respond & Grow</h3>
              <p className="text-[#374151] text-sm">Receive requests, respond quickly, build reviews, and win more Houston projects.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="bg-[#F5F5F5] py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B] text-center mb-12">What You Get</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Globe, title: 'Directory Presence', desc: 'Your own contractor page with business info, photos, and customer reviews.' },
              { icon: Phone, title: 'Routed Requests', desc: 'Intelligently routed requests from homeowners actively looking for your services.' },
              { icon: Shield, title: 'Booking Support', desc: 'Request handling and booking support so you never miss a job.' },
              { icon: Star, title: 'Reviews & Credibility', desc: 'Build trust with verified customer reviews and respond directly.' },
              { icon: Zap, title: 'Priority Routing', desc: 'Get placed first for emergency requests and after-hours coverage.' },
              { icon: Users, title: 'Call Coverage', desc: 'Intelligent call coverage when you can\'t answer — no missed opportunities.' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 bg-white rounded-lg p-6 border">
                <feature.icon className="h-5 w-5 text-[#374151] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#0B0B0B] mb-1">{feature.title}</h3>
                  <p className="text-[#374151] text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B0B0B] mb-4">Pricing</h2>
            <p className="text-[#374151]">
              Free listings can be discovered. Only responding contractors receive routed requests.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="border rounded-2xl p-6 flex flex-col">
              <h3 className="font-bold text-[#0B0B0B] text-lg mb-1">Starter</h3>
              <p className="text-[#6B7280] text-sm mb-4">Directory Presence</p>
              <p className="text-3xl font-bold text-[#0B0B0B] mb-2">$0<span className="text-base font-normal text-[#6B7280]">/mo</span></p>
              <p className="text-sm text-[#374151] mb-6">Visibility only. No routed requests.</p>
              <ul className="space-y-3 text-sm flex-1 mb-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Business profile listing</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Up to 5 gallery photos</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Customer reviews visible</span></li>
                <li className="flex items-center gap-2"><X className="h-4 w-4 text-[#9CA3AF] shrink-0" /> <span className="text-[#9CA3AF]">Routed requests</span></li>
                <li className="flex items-center gap-2"><X className="h-4 w-4 text-[#9CA3AF] shrink-0" /> <span className="text-[#9CA3AF]">Booking support</span></li>
                <li className="flex items-center gap-2"><X className="h-4 w-4 text-[#9CA3AF] shrink-0" /> <span className="text-[#9CA3AF]">Verified badge</span></li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register/contractor">
                  Join Free
                </Link>
              </Button>
            </div>

            {/* Responding Pro */}
            <div className="border-2 border-[#0B0B0B] rounded-2xl p-6 flex flex-col relative">
              <div className="absolute -top-3 left-6 bg-[#0B0B0B] text-white text-xs px-3 py-1 rounded-full">Most Contractors Choose This</div>
              <h3 className="font-bold text-[#0B0B0B] text-lg mb-1">Responding Pro</h3>
              <p className="text-[#6B7280] text-sm mb-4">Request Handling</p>
              <p className="text-3xl font-bold text-[#0B0B0B] mb-2">$149<span className="text-base font-normal text-[#6B7280]">/mo</span></p>
              <p className="text-sm text-[#374151] mb-6">Minimum tier to receive routed requests.</p>
              <ul className="space-y-3 text-sm flex-1 mb-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Everything in Starter</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Routed requests & leads</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Booking support</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Standard call coverage</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Up to 25 gallery photos</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Template customization</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Verified badge</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Respond to reviews</span></li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register/contractor">
                  Start Receiving Requests <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Priority Pro */}
            <div className="border rounded-2xl p-6 flex flex-col relative">
              <div className="absolute -top-3 left-6 bg-[#1F3C58] text-white text-xs px-3 py-1 rounded-full">Maximum Visibility</div>
              <h3 className="font-bold text-[#0B0B0B] text-lg mb-1">Priority Pro</h3>
              <p className="text-[#6B7280] text-sm mb-4">Priority Routing</p>
              <p className="text-3xl font-bold text-[#0B0B0B] mb-2">$299<span className="text-base font-normal text-[#6B7280]">/mo</span></p>
              <p className="text-sm text-[#374151] mb-6">Emergency & commercial priority.</p>
              <ul className="space-y-3 text-sm flex-1 mb-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Everything in Responding Pro</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Priority routing for all requests</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Emergency-first placement</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">After-hours & overflow coverage</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Unlimited gallery photos</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> <span className="text-[#374151]">Featured badge & top of results</span></li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register/contractor">
                  Get Priority Routing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Cancel anytime. No contracts. Upgrade or downgrade whenever you need.
          </p>
        </div>
      </div>
    </div>
  )
}
