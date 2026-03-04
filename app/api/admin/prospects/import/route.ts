export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  computeCombinedReview,
  computeCommunicationIssue,
  computePriorityScore,
  computeDedupeKey,
} from '@/lib/leads/scoring'

// Header aliases → canonical field names
const HEADER_MAP: Record<string, string> = {
  'google profile': 'google_profile_url',
  'company name': 'company_name',
  rating: 'rating',
  trade: 'trade',
  address: 'address',
  'address 2': 'address2',
  phone: 'phone',
  website: 'website',
  'reviews_1': 'review_1',
  'review 1': 'review_1',
  'review keyword': 'review_keyword',
  'reviews_2': 'review_2',
  'review 2': 'review_2',
  'combined reviews': 'combined_review_raw',
  city: 'city',
  trade_name: 'trade',
}

function normalizeHeader(h: string): string {
  return (HEADER_MAP[h.toLowerCase().trim()] ?? h.toLowerCase().trim().replace(/\s+/g, '_'))
}

async function verifyAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    return profile?.role === 'admin'
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const csvText = await file.text()

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  })

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    return NextResponse.json(
      { error: 'CSV parse failed', details: parsed.errors.slice(0, 5) },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()
  const errors: string[] = []
  const rows: Record<string, unknown>[] = []

  for (const row of parsed.data) {
    const companyName = (row.company_name ?? '').trim()
    if (!companyName) continue

    const phone = (row.phone ?? '').trim()
    const address = (row.address ?? row.address2 ?? '').trim()
    const ratingRaw = parseFloat(row.rating ?? '')
    const rating = isNaN(ratingRaw) ? null : ratingRaw

    const review1 = (row.review_1 ?? '').trim()
    const keyword = (row.review_keyword ?? '').trim()
    const review2 = (row.review_2 ?? '').trim()

    const combined = computeCombinedReview(review1, keyword, review2)
    const commIssue = computeCommunicationIssue(combined)
    const priorityScore = computePriorityScore(commIssue, rating)
    const dedupeKey = computeDedupeKey(companyName, phone, address)

    rows.push({
      source: 'google_maps',
      city: (row.city ?? 'Houston').trim() || 'Houston',
      trade: (row.trade ?? '').trim() || null,
      company_name: companyName,
      phone: phone || null,
      website: (row.website ?? '').trim() || null,
      address: address || null,
      rating,
      google_profile_url: (row.google_profile_url ?? '').trim() || null,
      review_1: review1 || null,
      review_keyword: keyword || null,
      review_2: review2 || null,
      combined_review: combined || null,
      communication_issue: commIssue,
      priority_score: priorityScore,
      dedupe_key: dedupeKey,
      raw_row: row,
    })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No valid rows found in CSV' }, { status: 400 })
  }

  // Upsert in batches of 200
  let inserted = 0
  let updated = 0

  for (let i = 0; i < rows.length; i += 200) {
    const batch = rows.slice(i, i + 200)
    const dedupeKeys = batch.map((r) => r.dedupe_key as string)

    // Check which already exist
    const { data: existing } = await supabase
      .from('prospect_leads')
      .select('dedupe_key')
      .in('dedupe_key', dedupeKeys)

    const existingKeys = new Set((existing ?? []).map((r) => r.dedupe_key))

    const { error } = await supabase.from('prospect_leads').upsert(batch as never[], {
      onConflict: 'dedupe_key',
      ignoreDuplicates: false,
    })

    if (error) {
      errors.push(`Batch ${i / 200 + 1}: ${error.message}`)
    } else {
      batch.forEach((r) => {
        if (existingKeys.has(r.dedupe_key as string)) updated++
        else inserted++
      })
    }
  }

  return NextResponse.json({ inserted, updated, errors })
}
