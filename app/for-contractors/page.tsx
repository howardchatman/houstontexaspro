import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Users, TrendingUp, Globe, Star, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Contractors | Houston Texas Pro',
  description: 'Grow your contracting business with Houston Texas Pro. Get verified leads, a professional profile, and more.',
}

export default function ForContractorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Grow Your Houston
            <br />
            Contracting Business
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Get listed on Houston&apos;s fastest-growing contractor marketplace.
            Receive qualified leads from homeowners who need your services.
          </p>
          <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 px-8 py-6 rounded-full text-base" asChild>
            <Link href="/register/contractor">
              Get Listed Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
              <h3 className="font-semibold text-slate-900 mb-2">Create Your Profile</h3>
              <p className="text-slate-600 text-sm">Sign up, add your business info, select your service categories and areas.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h3 className="font-semibold text-slate-900 mb-2">Receive Leads</h3>
              <p className="text-slate-600 text-sm">Homeowners find you through search, categories, or request routing.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h3 className="font-semibold text-slate-900 mb-2">Grow Your Business</h3>
              <p className="text-slate-600 text-sm">Build reviews, showcase your work, and win more Houston projects.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What You Get</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Globe, title: 'Professional Profile', desc: 'Your own contractor page with business info, photos, and reviews.' },
              { icon: Users, title: 'Qualified Leads', desc: 'Receive requests from homeowners actively looking for your services.' },
              { icon: Star, title: 'Reviews & Ratings', desc: 'Build credibility with verified customer reviews.' },
              { icon: TrendingUp, title: 'Dashboard & Analytics', desc: 'Track leads, manage your profile, and monitor performance.' },
              { icon: Zap, title: 'Emergency Routing', desc: 'Get priority leads from homeowners with urgent needs.' },
              { icon: CheckCircle, title: 'Verified Badge', desc: 'Stand out with a verified license and insurance badge.' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 bg-white rounded-lg p-6 border">
                <feature.icon className="h-5 w-5 text-slate-700 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Pricing</h2>
          <p className="text-slate-600 mb-10">Start free. Upgrade when you&apos;re ready.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border rounded-xl p-6 text-left">
              <h3 className="font-bold text-slate-900 text-lg mb-1">Free</h3>
              <p className="text-slate-500 text-sm mb-4">Get started</p>
              <p className="text-3xl font-bold text-slate-900 mb-6">$0<span className="text-base font-normal text-slate-500">/mo</span></p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Business profile</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Receive leads</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Customer reviews</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Photo gallery</li>
              </ul>
            </div>
            <div className="border-2 border-slate-900 rounded-xl p-6 text-left relative">
              <div className="absolute -top-3 left-6 bg-slate-900 text-white text-xs px-3 py-1 rounded-full">Popular</div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Premium</h3>
              <p className="text-slate-500 text-sm mb-4">Grow faster</p>
              <p className="text-3xl font-bold text-slate-900 mb-6">$29<span className="text-base font-normal text-slate-500">/mo</span></p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Everything in Free</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Priority placement</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Custom website template</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Featured badge</li>
              </ul>
            </div>
          </div>
          <Button size="lg" className="mt-10 px-8 py-6 rounded-full text-base" asChild>
            <Link href="/register/contractor">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
