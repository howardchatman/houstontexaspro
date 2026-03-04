import { createClient, createStaticClient } from '@/lib/supabase/server'

export interface Career {
  id: string
  slug: string
  title: string
  short_description: string | null
  hero_headline: string | null
  hero_subheadline: string | null
  body_markdown: string | null
  faqs: Array<{ q: string; a: string }>
  created_at: string
}

export interface School {
  id: string
  name: string
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  description: string | null
  is_featured: boolean
  created_at: string
}

export interface Program {
  id: string
  school_id: string
  career_id: string
  program_name: string
  duration_text: string | null
  tuition_text: string | null
  schedule_text: string | null
  created_at: string
}

export interface ProgramWithSchool extends Program {
  schools: School
}

export interface SchoolWithPrograms extends School {
  programs: Array<Program & { careers: Pick<Career, 'id' | 'slug' | 'title'> | null }>
}

export async function getCareers(): Promise<Career[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('careers')
    .select('*')
    .order('title', { ascending: true })
  return (data || []) as Career[]
}

/** Cookie-free version safe to call from generateStaticParams at build time. */
export async function getCareersStatic(): Promise<Career[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('careers')
    .select('id, slug, title')
    .order('title', { ascending: true })
  return (data || []) as Career[]
}

export async function getCareerBySlug(slug: string): Promise<Career | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('careers')
    .select('*')
    .eq('slug', slug)
    .single()
  return (data as Career) || null
}

export async function getProgramsForCareer(careerId: string): Promise<ProgramWithSchool[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('programs')
    .select('*, schools(*)')
    .eq('career_id', careerId)
    .order('created_at', { ascending: false })
  return (data || []) as ProgramWithSchool[]
}

export async function getSchools(careerSlug?: string): Promise<SchoolWithPrograms[]> {
  const supabase = await createClient()

  const schoolQuery = supabase
    .from('schools')
    .select(`
      *,
      programs (
        *,
        careers (id, slug, title)
      )
    `)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true })

  const { data } = await schoolQuery
  let schools = (data || []) as SchoolWithPrograms[]

  if (careerSlug) {
    schools = schools.filter((school) =>
      school.programs?.some((program) => program.careers?.slug === careerSlug)
    )
  }

  return schools
}

/** Cookie-free version safe to call from generateStaticParams at build time. */
export async function getSchoolsStatic(): Promise<Pick<School, 'id'>[]> {
  const supabase = createStaticClient()
  const { data } = await supabase.from('schools').select('id')
  return (data || []) as Pick<School, 'id'>[]
}

export async function getSchoolById(id: string): Promise<SchoolWithPrograms | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('schools')
    .select(`
      *,
      programs (
        *,
        careers (id, slug, title)
      )
    `)
    .eq('id', id)
    .single()
  return (data as SchoolWithPrograms) || null
}
