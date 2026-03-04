import type { Metadata } from 'next'
import { getCareers, getSchools } from '@/lib/careers'
import { SchoolCard } from '@/components/careers/SchoolCard'

export const metadata: Metadata = {
  title: 'Trade & Beauty Schools in Houston, TX | HoustonTexasPro',
  description:
    'Compare accredited trade and beauty schools in Houston. Find programs for barber, cosmetology, HVAC, electrician, CDL and more. Get free info today.',
  alternates: { canonical: 'https://houstontexaspro.com/schools' },
}

interface Props {
  searchParams: Promise<{ career?: string }>
}

export default async function SchoolsPage({ searchParams }: Props) {
  const { career: careerSlug } = await searchParams
  const [schools, careers] = await Promise.all([
    getSchools(careerSlug),
    getCareers(),
  ])

  const activeCareer = careers.find((c) => c.slug === careerSlug)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#0B0B0B] mb-3">
          {activeCareer
            ? `${activeCareer.title} Schools in Houston`
            : 'Trade & Beauty Schools in Houston'}
        </h1>
        <p className="text-xl text-[#6B7280]">
          {activeCareer
            ? `Find accredited schools offering ${activeCareer.title} programs in the Greater Houston area.`
            : 'Compare programs, tuition, and schedules at accredited Houston schools.'}
        </p>
      </div>

      {/* Career filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/schools"
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !careerSlug
              ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
              : 'bg-white text-[#374151] border-gray-200 hover:border-gray-400'
          }`}
        >
          All Programs
        </a>
        {careers.map((c) => (
          <a
            key={c.slug}
            href={`/schools?career=${c.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              careerSlug === c.slug
                ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                : 'bg-white text-[#374151] border-gray-200 hover:border-gray-400'
            }`}
          >
            {c.title}
          </a>
        ))}
      </div>

      {/* Schools grid */}
      {schools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[#6B7280]">
          <p className="text-lg">No schools found for this filter.</p>
          <a href="/schools" className="text-[#1F3C58] hover:underline text-sm mt-2 inline-block">
            View all schools
          </a>
        </div>
      )}
    </div>
  )
}
