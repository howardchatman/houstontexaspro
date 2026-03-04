import type { Metadata } from 'next'
import { CareerCard } from '@/components/careers/CareerCard'
import { getCareers } from '@/lib/careers'

export const metadata: Metadata = {
  title: 'Trade & Beauty Career Paths in Houston | HoustonTexasPro',
  description:
    'Explore trade and beauty careers in Houston, TX. Find accredited schools for barber, cosmetology, HVAC, electrician, CDL, and more. Start your career today.',
  alternates: { canonical: 'https://houstontexaspro.com/careers' },
  openGraph: {
    title: 'Trade & Beauty Career Paths in Houston',
    description:
      'Find accredited Houston schools for barber, cosmetology, HVAC, electrician, CDL, and more.',
    url: 'https://houstontexaspro.com/careers',
  },
}

export default async function CareersPage() {
  const careers = await getCareers()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#0B0B0B] mb-4">
          Start Your Trade or Beauty Career in Houston
        </h1>
        <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
          Find accredited schools, explore programs, and get free info sent directly
          to your inbox — no commitment required.
        </p>
      </div>

      {/* Career grid */}
      {careers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[#6B7280]">
          <p className="text-lg">Career paths coming soon.</p>
          <p className="text-sm mt-2">Check back shortly as we add more programs.</p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 bg-[#1F3C58] text-white rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Not sure where to start?</h2>
        <p className="text-blue-200 mb-6">
          Browse Houston schools across all trades and beauty programs in one place.
        </p>
        <a
          href="/schools"
          className="inline-block bg-white text-[#1F3C58] font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Browse All Schools
        </a>
      </div>
    </div>
  )
}
