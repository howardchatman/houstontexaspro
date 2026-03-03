import qaEntries from '@/content/qa.json'

export interface QAFAQ {
  q: string
  a: string
}

export interface QAEntry {
  slug: string
  question: string
  answer: string
  bullets: string[]
  faqs: QAFAQ[]
  category: string
  city: string
}

export const qaData = qaEntries as QAEntry[]

export const qaBySlug = new Map(qaData.map((entry) => [entry.slug, entry]))

export const qaCategories = Array.from(new Set(qaData.map((entry) => entry.category))).sort()
