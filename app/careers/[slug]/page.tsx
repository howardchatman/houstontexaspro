import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCareerBySlug, getProgramsForCareer, getSchools, getCareers } from '@/lib/careers'
import { LeadForm } from '@/components/careers/LeadForm'
import { FAQAccordion } from '@/components/careers/FAQAccordion'
import { SchoolCard } from '@/components/careers/SchoolCard'
import { Badge } from '@/components/ui/badge'
import { Clock, DollarSign, Calendar } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const careers = await getCareers()
  return careers.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const career = await getCareerBySlug(slug)
  if (!career) return {}

  const title = career.hero_headline || `How to Become a ${career.title} in Texas`
  const description =
    career.hero_subheadline ||
    career.short_description ||
    `Find accredited ${career.title} schools in Houston, TX. Compare programs, tuition, and get free info today.`

  return {
    title: `${title} | HoustonTexasPro`,
    description,
    alternates: { canonical: `https://houstontexaspro.com/careers/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://houstontexaspro.com/careers/${slug}`,
    },
  }
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params
  const [career, schools] = await Promise.all([
    getCareerBySlug(slug),
    getSchools(slug),
  ])

  if (!career) notFound()

  const programs = await getProgramsForCareer(career.id)

  const hero_headline = career.hero_headline || `How to Become a ${career.title} in Texas`
  const hero_subheadline =
    career.hero_subheadline ||
    `Find accredited ${career.title} schools in Houston and get free program info sent to you.`

  return (
    <>
      {/* Hero */}
      <div className="bg-[#0B0B0B] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#1F3C58]">{career.title}</Badge>
            <h1 className="text-4xl font-bold mb-4">{hero_headline}</h1>
            <p className="text-xl text-gray-300">{hero_subheadline}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Body markdown (rendered as prose) */}
            {career.body_markdown && (
              <div className="prose prose-gray max-w-none">
                {career.body_markdown.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[#374151] leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Schools / Programs */}
            {programs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0B0B0B] mb-6">
                  Houston Schools Offering {career.title} Programs
                </h2>
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className="border border-gray-200 rounded-xl p-5 bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#0B0B0B]">
                            {program.schools.name}
                          </h3>
                          <p className="text-sm text-[#6B7280]">{program.program_name}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-[#374151]">
                        {program.duration_text && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-[#6B7280]" />
                            {program.duration_text}
                          </span>
                        )}
                        {program.tuition_text && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-[#6B7280]" />
                            {program.tuition_text}
                          </span>
                        )}
                        {program.schedule_text && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-[#6B7280]" />
                            {program.schedule_text}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {career.faqs && career.faqs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0B0B0B] mb-6">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion faqs={career.faqs} />
              </section>
            )}

            {/* Schools grid */}
            {schools.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0B0B0B] mb-6">
                  Schools Near You
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {schools.map((school) => (
                    <SchoolCard key={school.id} school={school} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar — Lead form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadForm
                careerId={career.id}
                sourceUrl={`/careers/${career.slug}`}
                heading={`Get ${career.title} Program Info`}
                subheading={`We'll connect you with ${career.title} schools in Houston — free, no commitment.`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
