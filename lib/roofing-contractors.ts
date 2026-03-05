import data from '@/data/roofing-contractors.json'

export interface RoofingContractor {
  name: string
  slug: string
  phone: string | null
  phoneDigits: string | null
  website: string | null
  address: string | null
  rating: number | null
  googleProfileUrl: string | null
  trade: string
  city: string
  state: string
}

export const roofingContractors = data as RoofingContractor[]

export function getRoofingContractorBySlug(slug: string): RoofingContractor | undefined {
  return roofingContractors.find((c) => c.slug === slug)
}
