import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContractorBySlug, contractors } from '@/lib/contractors'

interface ContractorPageProps {
  params: Promise<{ slug: string }>
}

function buildMetaDescription(companyName: string): string {
  return `${companyName} serves Houston, TX with cameras, access control, alarm systems, and low-voltage security services.`
}

function buildAboutText(companyName: string): string {
  return `${companyName} is a Houston-based low voltage and security contractor serving local homeowners and businesses. The company provides support for camera systems, access control, alarm systems, and structured low-voltage wiring projects across Houston, Texas.`
}

export function generateStaticParams() {
  return contractors.map((contractor) => ({ slug: contractor.slug }))
}

export async function generateMetadata({ params }: ContractorPageProps): Promise<Metadata> {
  const { slug } = await params
  const contractor = getContractorBySlug(slug)

  if (!contractor) {
    return {
      title: 'Contractor Not Found',
    }
  }

  return {
    title: `${contractor.name} | Houston Low Voltage & Security Contractor`,
    description: buildMetaDescription(contractor.name),
    alternates: {
      canonical: `/contractors/${contractor.slug}`,
    },
  }
}

export default async function ContractorPage({ params }: ContractorPageProps) {
  const { slug } = await params
  const contractor = getContractorBySlug(slug)

  if (!contractor) {
    notFound()
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contractor.name,
    areaServed: 'Houston, TX',
    ...(contractor.phone ? { telephone: contractor.phone } : {}),
    ...(contractor.website ? { url: contractor.website } : {}),
    ...(contractor.primaryEmail ? { email: contractor.primaryEmail } : {}),
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <h1 className="text-3xl font-bold text-[#111827]">{contractor.name}</h1>
      <p className="mt-2 text-[#4B5563]">Low Voltage &amp; Security Contractor — Houston, TX</p>

      <section className="mt-8 rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#111827]">Contact</h2>
        <div className="mt-4 space-y-2 text-[#374151]">
          <p>
            <strong>Phone:</strong>{' '}
            {contractor.phone && contractor.phoneDigits ? (
              <a href={`tel:${contractor.phoneDigits}`} className="text-[#1D4ED8] hover:underline">
                {contractor.phone}
              </a>
            ) : (
              <span>Not listed</span>
            )}
          </p>
          <p>
            <strong>Website:</strong>{' '}
            {contractor.website ? (
              <a
                href={contractor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1D4ED8] hover:underline"
              >
                {contractor.website}
              </a>
            ) : (
              <span>Not listed</span>
            )}
          </p>
          <p>
            <strong>Email:</strong>{' '}
            {contractor.primaryEmail ? (
              <a href={`mailto:${contractor.primaryEmail}`} className="text-[#1D4ED8] hover:underline">
                {contractor.primaryEmail}
              </a>
            ) : (
              <span>Not listed</span>
            )}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#111827]">Services</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-[#374151]">
          <li>Security camera installation</li>
          <li>Access control</li>
          <li>Alarm systems</li>
          <li>Low-voltage wiring</li>
          <li>Commercial security systems</li>
        </ul>
      </section>

      <section className="mt-8 rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#111827]">About</h2>
        <p className="mt-4 text-[#374151]">{buildAboutText(contractor.name)}</p>
      </section>

      <p className="mt-8 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Listing Status: Unverified
      </p>
    </div>
  )
}
