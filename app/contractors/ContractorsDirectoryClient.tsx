'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ContractorRecord } from '@/lib/contractors'

interface ContractorsDirectoryClientProps {
  contractors: ContractorRecord[]
}

export function ContractorsDirectoryClient({ contractors }: ContractorsDirectoryClientProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return contractors

    return contractors.filter((contractor) => {
      return (
        contractor.name.toLowerCase().includes(normalizedQuery)
        || contractor.slug.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [contractors, query])

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#111827]">Houston Low Voltage &amp; Security Contractors</h1>
      <p className="mt-2 text-[#4B5563]">
        Browse Houston contractor listings for cameras, access control, alarm systems, and low-voltage wiring.
      </p>

      <div className="mt-6">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by company name..."
          className="w-full rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      <p className="mt-4 text-sm text-[#6B7280]">
        Showing {filtered.length} of {contractors.length} contractors
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((contractor) => (
          <article key={contractor.slug} className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#111827]">{contractor.name}</h2>
            <p className="mt-1 text-sm text-[#4B5563]">Low Voltage &amp; Security Contractor — Houston, TX</p>

            <div className="mt-4 space-y-1 text-sm text-[#374151]">
              <p>{contractor.phone || 'Phone not listed'}</p>
              <p>{contractor.primaryEmail || 'Email not listed'}</p>
              <p>{contractor.website ? contractor.website.replace(/^https?:\/\//, '') : 'Website not listed'}</p>
            </div>

            <div className="mt-4">
              <Link
                href={`/contractors/${contractor.slug}`}
                className="inline-flex rounded-md bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E40AF]"
              >
                View Profile
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-[#6B7280]">No contractors matched your search.</p>
      )}
    </div>
  )
}
