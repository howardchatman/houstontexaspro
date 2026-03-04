import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getContractorBySlug } from '@/lib/contractors'
import { ClaimForm } from './ClaimForm'

export const metadata = {
  title: 'Claim Your Listing | HoustonTexasPro',
  robots: { index: false },
}

interface Props {
  searchParams: Promise<{ company?: string }>
}

export default async function ClaimPage({ searchParams }: Props) {
  const { company } = await searchParams

  if (!company) notFound()

  const contractor = getContractorBySlug(company)
  if (!contractor) notFound()

  const listingUrl = `https://houstontexaspro.com/contractors/${contractor.slug}`

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link
        href={`/contractors/${contractor.slug}`}
        className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0B0B0B] mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {contractor.name}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B0B0B] mb-2">Claim This Listing</h1>
        <p className="text-[#6B7280]">
          Claiming <span className="font-medium text-[#0B0B0B]">{contractor.name}</span> on HoustonTexasPro.
          Submit your details and we&apos;ll verify ownership and reach out within 1 business day.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <ClaimForm
          contractorName={contractor.name}
          contractorSlug={contractor.slug}
          listingUrl={listingUrl}
        />
      </div>
    </div>
  )
}
