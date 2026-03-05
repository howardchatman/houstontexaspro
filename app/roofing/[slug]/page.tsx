import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRoofingContractorBySlug, roofingContractors } from '@/lib/roofing-contractors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Phone, Globe, MapPin, ExternalLink } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return roofingContractors.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = getRoofingContractorBySlug(slug)
  if (!c) return { title: 'Contractor Not Found' }

  return {
    title: `${c.name} | Houston Roofing Contractor`,
    description: `${c.name} is a roofing contractor serving Houston, TX. Roof repair, replacement, and storm damage restoration. Contact ${c.name} for a free inspection.`,
    alternates: { canonical: `/roofing/${c.slug}` },
  }
}

export default async function RoofingContractorPage({ params }: Props) {
  const { slug } = await params
  const c = getRoofingContractorBySlug(slug)
  if (!c) notFound()

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: c.name,
    areaServed: 'Houston, TX',
    ...(c.phone ? { telephone: c.phoneDigits } : {}),
    ...(c.website ? { url: c.website } : {}),
    ...(c.address ? { address: { '@type': 'PostalAddress', streetAddress: c.address, addressLocality: 'Houston', addressRegion: 'TX' } } : {}),
    ...(c.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: c.rating, bestRating: 5 } } : {}),
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Breadcrumb */}
      <p className="text-sm text-[#6B7280] mb-4">
        <Link href="/categories/roofing" className="hover:underline">Houston Roofing</Link>
        {' / '}
        <span className="text-[#374151]">{c.name}</span>
      </p>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">{c.name}</h1>
          <p className="mt-1 text-[#4B5563]">
            {c.trade} — Houston, TX
          </p>
          {c.rating && (
            <div className="flex items-center gap-1.5 mt-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[#374151]">{c.rating}</span>
              <span className="text-sm text-[#9CA3AF]">Google rating</span>
              {c.googleProfileUrl && (
                <a
                  href={c.googleProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1D4ED8] hover:underline flex items-center gap-0.5 ml-1"
                >
                  View on Google <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Claim Banner */}
      <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
            Listing Status:
          </span>
          <Badge variant="outline" className="border-amber-500 text-amber-900 text-xs">
            Unverified
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold text-[#0B0B0B] text-sm mb-1">Own this business? Claim your free listing.</p>
            <p className="text-sm text-[#374151] mb-3">
              Join Houston contractors on HoustonTexasPro — update your info, respond to leads, and grow your business.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center rounded-full border border-green-300 bg-green-50 px-2.5 py-1 text-green-800 font-medium">
                Free · List your business
              </span>
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-800 font-medium">
                $149/mo · Respond to leads
              </span>
              <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-purple-800 font-medium">
                $299/mo · Priority placement
              </span>
            </div>
          </div>
          <Button asChild className="shrink-0 sm:mt-1">
            <Link href={`/register/contractor?claim=${c.slug}&company=${encodeURIComponent(c.name)}`}>
              Claim Your Free Listing
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-8 rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#111827]">Contact</h2>
        <div className="mt-4 space-y-2 text-[#374151]">
          {c.address && (
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#9CA3AF]" />
              {c.address}, Houston, TX
            </p>
          )}
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <strong>Phone:</strong>{' '}
            {c.phone && c.phoneDigits ? (
              <a href={`tel:${c.phoneDigits}`} className="text-[#1D4ED8] hover:underline">
                {c.phone}
              </a>
            ) : (
              <span className="text-[#9CA3AF]">Not listed</span>
            )}
          </p>
          <p className="flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <strong>Website:</strong>{' '}
            {c.website ? (
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1D4ED8] hover:underline"
              >
                {c.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            ) : (
              <span className="text-[#9CA3AF]">Not listed</span>
            )}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mt-8 rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#111827]">Services</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-[#374151]">
          <li>Roof repair &amp; leak detection</li>
          <li>Full roof replacement</li>
          <li>Storm &amp; hail damage restoration</li>
          <li>Insurance claim assistance</li>
          <li>Free roof inspections</li>
          <li>Residential &amp; commercial roofing</li>
        </ul>
      </section>

      {/* About */}
      <section className="mt-8 rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#111827]">About</h2>
        <p className="mt-4 text-[#374151]">
          {c.name} is a roofing contractor serving Houston, TX and the surrounding area. The company
          provides roof repair, replacement, storm damage restoration, and insurance claim assistance
          for residential and commercial properties across the greater Houston metropolitan area.
        </p>
      </section>

      {/* Back link */}
      <div className="mt-8">
        <Link href="/categories/roofing" className="text-sm text-[#1D4ED8] hover:underline">
          ← Back to Houston Roofing Contractors
        </Link>
      </div>
    </div>
  )
}
