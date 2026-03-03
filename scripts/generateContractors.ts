/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs')
const path = require('node:path')

type CsvRow = Record<string, string>

interface ContractorRecord {
  name: string
  slug: string
  city: string
  state: string
  phone: string | null
  phoneDigits: string | null
  website: string | null
  primaryEmail: string | null
}

const ROOT = process.cwd()
const DEFAULT_CSV_CANDIDATES = [
  path.join(ROOT, 'data', 'import', 'houston_security_outreach_ready.csv'),
  path.join(ROOT, 'data', 'import', 'houston_security_emails_fixed.csv'),
  'C:\\Users\\howar\\scrapers\\houston_security_outreach_ready.csv',
  'C:\\Users\\howar\\scrapers\\houston_security_emails_fixed.csv',
]

const OUTPUT_PATH = path.join(ROOT, 'data', 'contractors.json')

function cleanValue(value: string | undefined): string {
  return (value || '').replace(/\uFEFF/g, '').trim()
}

function parseCsv(csvText: string): CsvRow[] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i]
    const nextChar = csvText[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1
      }
      row.push(field)
      field = ''
      if (row.some((value) => value.length > 0)) {
        rows.push(row)
      }
      row = []
      continue
    }

    field += char
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    if (row.some((value) => value.length > 0)) {
      rows.push(row)
    }
  }

  if (rows.length === 0) {
    return []
  }

  const headers = rows[0].map((header) => cleanValue(header))
  return rows.slice(1).map((values) => {
    const mapped: CsvRow = {}
    headers.forEach((header, index) => {
      mapped[header] = cleanValue(values[index])
    })
    return mapped
  })
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function normalizeWebsite(input: string): string | null {
  const value = cleanValue(input)
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function extractPrimaryEmail(...values: string[]): string | null {
  const combined = values
    .map((value) => cleanValue(value))
    .filter(Boolean)
    .join(', ')

  if (!combined) return null

  const matches = combined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)
  if (!matches || matches.length === 0) return null

  const valid = matches
    .map((match) => match.toLowerCase())
    .find((match) => {
      const domain = match.split('@')[1] || ''
      if (!domain) return false
      if (/%/.test(match)) return false
      if (/\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$/i.test(domain)) return false
      return true
    })

  return valid || null
}

function formatPhone(phoneRaw: string): { display: string | null; digits: string | null; last4: string | null } {
  const cleaned = cleanValue(phoneRaw)
  if (!cleaned) {
    return { display: null, digits: null, last4: null }
  }

  const digitsOnly = cleaned.replace(/\D/g, '')
  if (!digitsOnly) {
    return { display: null, digits: null, last4: null }
  }

  let normalizedDigits = digitsOnly
  if (normalizedDigits.length === 11 && normalizedDigits.startsWith('1')) {
    normalizedDigits = normalizedDigits.slice(1)
  }

  let display = cleaned
  if (normalizedDigits.length === 10) {
    display = `(${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(3, 6)}-${normalizedDigits.slice(6)}`
  }

  return {
    display,
    digits: normalizedDigits,
    last4: normalizedDigits.length >= 4 ? normalizedDigits.slice(-4) : null,
  }
}

function isHoustonRow(row: CsvRow): boolean {
  const value = cleanValue(row.in_houston).toLowerCase()
  return value === 'true' || value === '1' || value === 'yes'
}

function generateSlug(name: string, last4: string | null, usedSlugs: Set<string>): string {
  const base = slugify(name) || 'contractor'
  let candidate = last4 ? `${base}-${last4}` : base
  let counter = 2

  while (usedSlugs.has(candidate)) {
    candidate = `${last4 ? `${base}-${last4}` : base}-${counter}`
    counter += 1
  }

  usedSlugs.add(candidate)
  return candidate
}

function resolveInputPath(argPath: string | undefined): string {
  if (argPath) {
    const absolute = path.isAbsolute(argPath) ? argPath : path.join(ROOT, argPath)
    if (!fs.existsSync(absolute)) {
      throw new Error(`Input CSV does not exist: ${absolute}`)
    }
    return absolute
  }

  const found = DEFAULT_CSV_CANDIDATES.find((candidate) => fs.existsSync(candidate))
  if (!found) {
    throw new Error(
      `No CSV file found. Checked:\n${DEFAULT_CSV_CANDIDATES.map((candidate) => `- ${candidate}`).join('\n')}`
    )
  }

  return found
}

function buildContractors(rows: CsvRow[]): ContractorRecord[] {
  const usedSlugs = new Set<string>()

  const contractors = rows
    .filter(isHoustonRow)
    .map((row) => {
      const name = cleanValue(row.name || row.company || row.business_name)
      if (!name) {
        return null
      }

      const phone = formatPhone(row.phone)
      const slug = generateSlug(name, phone.last4, usedSlugs)
      const website = normalizeWebsite(row.website || row.url)
      const primaryEmail = extractPrimaryEmail(row.email, row.primary_email)

      return {
        name,
        slug,
        city: 'Houston',
        state: 'TX',
        phone: phone.display,
        phoneDigits: phone.digits,
        website,
        primaryEmail,
      } satisfies ContractorRecord
    })
    .filter(Boolean) as ContractorRecord[]

  contractors.sort((a, b) => a.name.localeCompare(b.name))
  return contractors
}

function writeOutput(contractors: ContractorRecord[]) {
  const outputDir = path.dirname(OUTPUT_PATH)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(contractors, null, 2)}\n`, 'utf8')
}

function main() {
  const inputPath = resolveInputPath(process.argv[2])
  const csvText = fs.readFileSync(inputPath, 'utf8')
  const rows = parseCsv(csvText)
  const contractors = buildContractors(rows)

  writeOutput(contractors)

  console.log(`Generated ${contractors.length} Houston contractors from ${inputPath}`)
  console.log(`Output: ${OUTPUT_PATH}`)
}

main()
