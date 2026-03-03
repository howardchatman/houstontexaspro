'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { qaData, qaCategories } from '@/lib/qa'

export default function QAPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return qaData.filter((entry) => {
      const matchesCategory = category === 'all' || entry.category === category
      const matchesQuery = !normalizedQuery
        || entry.question.toLowerCase().includes(normalizedQuery)
        || entry.answer.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1F2937]">Houston Contractor Q&A</h1>
      <p className="mt-2 text-[#6B7280]">
        Browse practical answers for hiring and comparing contractors in Houston.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions..."
          className="w-full rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="all">All categories</option>
          {qaCategories.map((slug) => (
            <option key={slug} value={slug}>
              {slug}
            </option>
          ))}
        </select>
      </div>

      <ul className="mt-8 space-y-3">
        {filtered.map((entry) => (
          <li key={entry.slug} className="rounded-lg border border-[#E5E7EB] bg-white p-4">
            <Link href={`/qa/${entry.slug}`} className="font-semibold text-[#1D4ED8] hover:underline">
              {entry.question}
            </Link>
            <p className="mt-2 text-sm text-[#4B5563]">{entry.city} • {entry.category}</p>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-6 text-sm text-[#6B7280]">No matching questions found.</p>
      )}
    </div>
  )
}
