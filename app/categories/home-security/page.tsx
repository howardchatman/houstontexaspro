import type { Metadata } from 'next'
import Link from 'next/link'
import { contractors } from '@/lib/contractors'
import { Phone, Globe, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Houston Home Security Contractors | HoustonTexasPro',
  description:
    'Find licensed home security and low voltage contractors in Houston, TX. Security cameras, access control, alarm systems, and commercial security services.',
  alternates: { canonical: 'https://houstontexaspro.com/categories/home-security' },
}

export default function HomeSecurityCategoryPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero */}
      <div
        className="relative bg-[#0B0B0B] text-white py-16"
        style={{
          backgroundImage: 'url(/images/categories/home-security.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-300 mb-2">
            <Link href="/categories" className="hover:text-white">Services</Link>
            {' / '}
            <span>Home Security</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Houston Home Security Contractors
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Security cameras, access control, alarm systems, and low voltage installations from Houston pros.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {contractors.length} security pros listed
            </span>
            <span>Licensed &amp; insured</span>
            <span>Commercial &amp; residential</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#0B0B0B]">
            {contractors.length} Home Security Contractors in Houston, TX
          </h2>
          <p className="text-sm text-[#6B7280]">Low voltage &amp; security</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractors.map((contractor) => (
            <Link
              key={contractor.slug}
              href={`/contractors/${contractor.slug}`}
              className="block bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md hover:border-[#D1D5DB] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0B0B0B] leading-tight truncate pr-2">
                    {contractor.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">Low Voltage &amp; Security</p>
                </div>
              </div>

              {contractor.city && (
                <p className="flex items-start gap-1.5 text-xs text-[#6B7280] mb-3 line-clamp-1">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                  {contractor.city}, {contractor.state}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs">
                {contractor.phone && (
                  <span className="flex items-center gap-1 text-[#374151]">
                    <Phone className="h-3 w-3" />
                    {contractor.phone}
                  </span>
                )}
                {contractor.website && (
                  <span className="flex items-center gap-1 text-[#1D4ED8]">
                    <Globe className="h-3 w-3" />
                    Website
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-end">
                <span className="text-xs text-[#1D4ED8] font-medium">View Profile →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO footer text */}
        <div className="mt-12 prose prose-sm max-w-none text-[#6B7280]">
          <h2 className="text-[#374151] text-lg font-semibold">
            Find Home Security Contractors in Houston, TX
          </h2>
          <p>
            HoustonTexasPro lists {contractors.length} home security and low voltage contractors serving the greater
            Houston area including security camera installation, access control systems, alarm monitoring, and commercial
            security integrations. These Houston security pros serve all neighborhoods including Katy, Sugar Land,
            The Woodlands, Pearland, and Pasadena.
          </p>
          <p>
            All listings include contact information. Contractors marked &quot;Unverified&quot; have not yet claimed
            their HoustonTexasPro listing. Own one of these businesses?{' '}
            <Link href="/register/contractor" className="text-[#1D4ED8] hover:underline">
              Claim your free listing
            </Link>{' '}
            to update your information and receive project inquiries.
          </p>
        </div>
      </div>
    </div>
  )
}
