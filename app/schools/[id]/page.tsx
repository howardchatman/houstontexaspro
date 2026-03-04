import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getSchoolById, getSchoolsStatic } from '@/lib/careers'
import { LeadForm } from '@/components/careers/LeadForm'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Globe, Mail, Clock, DollarSign, Calendar, Star } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const schools = await getSchoolsStatic()
  return schools.map((s) => ({ id: s.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const school = await getSchoolById(id)
  if (!school) return {}

  const city = school.city || 'Houston'
  const title = `${school.name} — Programs & Tuition in ${city}, TX`
  const description =
    school.description ||
    `Learn about programs, tuition, and schedules at ${school.name} in ${city}, TX.`

  return {
    title: `${title} | HoustonTexasPro`,
    description,
    alternates: { canonical: `https://houstontexaspro.com/schools/${id}` },
    openGraph: { title, description, url: `https://houstontexaspro.com/schools/${id}` },
  }
}

export default async function SchoolDetailPage({ params }: Props) {
  const { id } = await params
  const school = await getSchoolById(id)
  if (!school) notFound()

  const location = [school.city, school.state].filter(Boolean).join(', ')

  return (
    <>
      {/* Hero */}
      <div className="bg-[#0B0B0B] text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            {school.is_featured && (
              <Badge className="bg-[#1F3C58]">
                <Star className="h-3 w-3 mr-1 fill-white" />
                Featured School
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">{school.name}</h1>
          {location && (
            <p className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-4 w-4" />
              {location}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            {school.description && (
              <section>
                <h2 className="text-2xl font-bold text-[#0B0B0B] mb-4">About {school.name}</h2>
                <p className="text-[#374151] leading-relaxed">{school.description}</p>
              </section>
            )}

            {/* Contact info */}
            <section>
              <h2 className="text-2xl font-bold text-[#0B0B0B] mb-4">Contact & Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {school.address && (
                  <div className="flex items-start gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                    <MapPin className="h-5 w-5 text-[#1F3C58] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1">Address</p>
                      <p className="text-sm text-[#374151]">{school.address}</p>
                    </div>
                  </div>
                )}
                {school.phone && (
                  <div className="flex items-start gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                    <Phone className="h-5 w-5 text-[#1F3C58] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1">Phone</p>
                      <a href={`tel:${school.phone}`} className="text-sm text-[#1F3C58] hover:underline">
                        {school.phone}
                      </a>
                    </div>
                  </div>
                )}
                {school.email && (
                  <div className="flex items-start gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                    <Mail className="h-5 w-5 text-[#1F3C58] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1">Email</p>
                      <a href={`mailto:${school.email}`} className="text-sm text-[#1F3C58] hover:underline">
                        {school.email}
                      </a>
                    </div>
                  </div>
                )}
                {school.website && (
                  <div className="flex items-start gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                    <Globe className="h-5 w-5 text-[#1F3C58] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1">Website</p>
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#1F3C58] hover:underline truncate block"
                      >
                        {school.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Programs */}
            {school.programs && school.programs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0B0B0B] mb-6">Programs Offered</h2>
                <div className="space-y-4">
                  {school.programs.map((program) => (
                    <div
                      key={program.id}
                      className="border border-gray-200 rounded-xl p-5 bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#0B0B0B]">{program.program_name}</h3>
                          {program.careers && (
                            <Link
                              href={`/careers/${program.careers.slug}`}
                              className="text-sm text-[#1F3C58] hover:underline"
                            >
                              {program.careers.title} career path →
                            </Link>
                          )}
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
          </div>

          {/* Sidebar — Lead form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadForm
                schoolId={school.id}
                sourceUrl={`/schools/${school.id}`}
                heading={`Get Info from ${school.name}`}
                subheading="Fill out the form and a school rep will reach out with program details."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
