/**
 * Parses roofing.csv → data/roofing-contractors.json
 * Run: npx tsx scripts/generateRoofingContractors.ts
 */
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

interface RawRow {
  'Company Name'?: string
  'company_name'?: string
  Rating?: string
  rating?: string
  Trade?: string
  trade?: string
  Address?: string
  address?: string
  'Address 2'?: string
  Phone?: string
  phone?: string
  website?: string
  Website?: string
  'Google Profile'?: string
  'google_profile_url'?: string
  'Reviews_1'?: string
  'Review Keyword'?: string
  'Reviews_2'?: string
  'Combined Reviews'?: string
}

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

function slugify(name: string, suffix?: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
  return suffix ? `${base}-${suffix}` : base
}

function normalizePhone(raw: string): { display: string; digits: string } | null {
  if (!raw?.trim()) return null
  const digits = raw.replace(/[^0-9]/g, '')
  if (digits.length < 10) return null
  const d = digits.slice(-10)
  return {
    display: `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`,
    digits: d,
  }
}

function normalizeWebsite(raw: string): string | null {
  if (!raw?.trim()) return null
  // Skip Google ad URLs
  if (raw.includes('google.com/aclk') || raw.includes('facebook.com')) return null
  const trimmed = raw.trim()
  if (!trimmed.startsWith('http')) return `https://${trimmed}`
  return trimmed
}

function get(row: RawRow, ...keys: string[]): string {
  for (const key of keys) {
    const val = (row as Record<string, string>)[key]
    if (val?.trim()) return val.trim()
  }
  return ''
}

const CSV_PATH = path.resolve(process.cwd(), 'roofing.csv')
const OUT_PATH = path.resolve(process.cwd(), 'data', 'roofing-contractors.json')

const raw = fs.readFileSync(CSV_PATH, 'utf8')
const { data: rows } = Papa.parse<RawRow>(raw, { header: true, skipEmptyLines: true })

const seen = new Set<string>()
const contractors: RoofingContractor[] = []

for (const row of rows) {
  const name = get(row, 'Company Name', 'company_name')
  if (!name || name.toLowerCase() === 'null') continue

  const phoneRaw = get(row, 'Phone', 'phone')
  const phone = normalizePhone(phoneRaw)
  const website = normalizeWebsite(get(row, 'website', 'Website'))
  const address = get(row, 'Address', 'address') || null
  const ratingStr = get(row, 'Rating', 'rating')
  const rating = ratingStr ? parseFloat(ratingStr) : null
  const googleProfileUrl = get(row, 'Google Profile', 'google_profile_url') || null
  const trade = get(row, 'Trade', 'trade') || 'Roofing contractor'

  // Generate unique slug
  const suffix = phone?.digits.slice(-4)
  let slug = slugify(name, suffix)
  let attempt = 0
  while (seen.has(slug)) {
    attempt++
    slug = slugify(name, suffix ? `${suffix}-${attempt}` : String(attempt))
  }
  seen.add(slug)

  contractors.push({
    name,
    slug,
    phone: phone?.display ?? null,
    phoneDigits: phone?.digits ?? null,
    website,
    address,
    rating: rating && !isNaN(rating) ? rating : null,
    googleProfileUrl,
    trade,
    city: 'Houston',
    state: 'TX',
  })
}

fs.writeFileSync(OUT_PATH, JSON.stringify(contractors, null, 2) + '\n', 'utf8')
console.log(`✓ Wrote ${contractors.length} roofing contractors to data/roofing-contractors.json`)
