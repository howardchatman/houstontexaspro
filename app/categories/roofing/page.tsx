import type { Metadata } from 'next'
import Link from 'next/link'
import { roofingContractors } from '@/lib/roofing-contractors'
import { Star, Phone, Globe, MapPin, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Houston Roofing Contractors | HoustonTexasPro',
  description:
    'Find licensed roofing contractors in Houston, TX. Roof repair, replacement, and storm damage experts. Free inspections from verified Houston roofers.',
  alternates: { canonical: 'https://houstontexaspro.com/categories/roofing' },
}

export default function RoofingCategoryPage() {
  const sorted = [...roofingContractors].sort((a, b) => {
    if (a.rating === null && b.rating === null) return 0
    if (a.rating === null) return 1
    if (b.rating === null) return -1
    return b.rating - a.rating
  })

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero */}
      <div
        className="relative bg-[#0B0B0B] text-white py-16"
        style={{
          backgroundImage: 'url(/images/categories/roofing.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-300 mb-2">
            <Link href="/categories" className="hover:text-white">Services</Link>
            {' / '}
            <span>Roofing</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Houston Roofing Contractors
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Roof repair, replacement, and storm damage experts. Free inspections from verified Houston roofers.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {sorted.length} roofing pros listed
            </span>
            <span>Fast response times</span>
            <span>Licensed &amp; insured</span>
          </div>
        </div>
      </div>

      {/* Storm damage CTA */}
      <div className="bg-red-600 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>Storm damage?</strong> Get connected to roofers who respond fast and handle insurance claims.
          </span>
          <Link href="/emergency" className="ml-auto shrink-0 underline font-semibold hover:no-underline">
            Emergency Help
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#0B0B0B]">
            {sorted.length} Roofing Contractors in Houston, TX
          </h2>
          <p className="text-sm text-[#6B7280]">Sorted by rating</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((contractor) => (
            <Link
              key={contractor.slug}
              href={`/roofing/${contractor.slug}`}
              className="block bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md hover:border-[#D1D5DB] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0B0B0B] leading-tight truncate pr-2">
                    {contractor.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{contractor.trade}</p>
                </div>
                {contractor.rating && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-[#374151]">{contractor.rating}</span>
                  </div>
                )}
              </div>

              {contractor.address && (
                <p className="flex items-start gap-1.5 text-xs text-[#6B7280] mb-3 line-clamp-1">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                  {contractor.address}
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
            Find Roofing Contractors in Houston, TX
          </h2>
          <p>
            HoustonTexasPro lists {sorted.length} roofing contractors serving the greater Houston area including
            roof repair, full replacement, storm damage restoration, and insurance claim assistance. Whether you
            need a shingle repair after a hailstorm or a full commercial flat roof replacement, these Houston
            roofers serve all neighborhoods including Katy, Sugar Land, The Woodlands, Pearland, and Pasadena.
          </p>
          <p>
            All listings include contact information and Google ratings. Contractors marked "Unverified" have not
            yet claimed their HoustonTexasPro listing. Own one of these businesses?{' '}
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
