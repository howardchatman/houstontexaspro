import type { Metadata } from 'next'
import { getContractorBySlug } from '@/lib/contractors'
import { ClaimForm } from './ClaimForm'

export const metadata: Metadata = {
  title: 'Claim Your HoustonTexasPro Listing',
  robots: { index: false },
}

interface Props {
  searchParams: Promise<{ company?: string }>
}

export default async function ClaimPage({ searchParams }: Props) {
  const { company } = await searchParams

  const contractor = company ? getContractorBySlug(company) : null
  const displayName = contractor?.name ?? company ?? null

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-[#0B0B0B] mb-2">
        Claim Your HoustonTexasPro Listing
      </h1>

      {displayName && (
        <p className="text-[#6B7280] mb-8">
          Submitting a claim for{' '}
          <span className="font-medium text-[#0B0B0B]">{displayName}</span>.
        </p>
      )}

      {!displayName && (
        <p className="text-[#6B7280] mb-8">
          Fill out the form below and we&apos;ll reach out within 1 business day.
        </p>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <ClaimForm companySlug={company ?? ''} companyName={displayName ?? ''} />
      </div>
    </div>
  )
}
