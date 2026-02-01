import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Shield, Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Houston Texas Pro',
  description: 'About Houston Texas Pro - connecting Houston homeowners with licensed, responsive contractors.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0B0B0B] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Houston Texas Pro</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Houston&apos;s contractor marketplace built for homeowners who are tired of chasing voicemails.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-gray mb-16">
            <p>
              Houston Texas Pro was built to solve a simple problem: finding a contractor in Houston who
              actually picks up the phone. Whether it&apos;s a burst pipe at 2 AM or a kitchen remodel
              you&apos;ve been planning for months, you deserve a contractor who responds.
            </p>
            <p>
              We verify licenses, display real reviews, and route your requests to contractors who are
              ready to work. No more cold-calling down a list. No more waiting days for a callback.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-16">
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <Shield className="h-6 w-6 text-[#374151]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0B0B0B] mb-1">Verified Contractors</h3>
                <p className="text-[#374151] text-sm">We verify licenses and insurance so you don&apos;t have to.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <Clock className="h-6 w-6 text-[#374151]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0B0B0B] mb-1">Fast Response</h3>
                <p className="text-[#374151] text-sm">We prioritize contractors who respond quickly to your requests.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-[#374151]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0B0B0B] mb-1">Real Reviews</h3>
                <p className="text-[#374151] text-sm">Honest ratings from real Houston homeowners.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <MapPin className="h-6 w-6 text-[#374151]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0B0B0B] mb-1">Houston Focused</h3>
                <p className="text-[#374151] text-sm">Built specifically for the Greater Houston area.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0B0B0B] rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-white/60 mb-8">Find a contractor or get your business listed today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#0B0B0B] hover:bg-white/90" asChild>
                <Link href="/contractors">
                  Find a Contractor <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/register/contractor">Get Listed</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
