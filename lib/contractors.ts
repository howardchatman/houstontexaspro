import contractorData from '@/data/contractors.json'

export interface ContractorRecord {
  name: string
  slug: string
  city: string
  state: string
  phone: string | null
  phoneDigits: string | null
  website: string | null
  primaryEmail: string | null
}

export const contractors = contractorData as ContractorRecord[]

export function getContractorBySlug(slug: string): ContractorRecord | undefined {
  return contractors.find((contractor) => contractor.slug === slug)
}
