import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Houston Texas Pro',
  description: 'Get in touch with Houston Texas Pro. We connect Houston homeowners with licensed, responsive contractors.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#0B0B0B] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Have a question about our platform? Want to get listed as a contractor? We&apos;re here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-[#0B0B0B] mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-[#6B7280] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#0B0B0B]">Email</h3>
                  <a href="mailto:support@houstontexaspro.com" className="text-[#1F3C58] hover:underline">
                    support@houstontexaspro.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-[#6B7280] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#0B0B0B]">Phone</h3>
                  <a href="tel:+17135551234" className="text-[#1F3C58] hover:underline">
                    (713) 555-1234
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-[#6B7280] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#0B0B0B]">Location</h3>
                  <p className="text-[#374151]">Serving the Greater Houston Area</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-[#6B7280] mt-1" />
                <div>
                  <h3 className="font-semibold text-[#0B0B0B]">Hours</h3>
                  <p className="text-[#374151]">24/7 Emergency Routing Available</p>
                  <p className="text-[#6B7280] text-sm">Office: Mon-Fri 8AM-6PM CST</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-[#0B0B0B]">Quick Links</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/contractors">Find a Contractor</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/register/contractor">Get Listed as a Contractor</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/faq">Frequently Asked Questions</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/for-contractors">How It Works for Contractors</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
