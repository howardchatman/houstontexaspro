import { NextRequest, NextResponse } from 'next/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import { resend, FROM_EMAIL } from '@/lib/resend'

interface ClaimPayload {
  fullName: string
  roleTitle?: string | null
  email: string
  phone?: string | null
  proofOrNotes: string
  contractorName: string
  contractorSlug: string
  listingUrl: string
  honeypot?: string
}

interface StoredClaim extends ClaimPayload {
  submittedAt: string
  sourceIp: string
}

const CLAIMS_FILE = path.join(process.cwd(), 'data', 'claims.json')
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const rateLimitStore = new Map<string, number[]>()

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

function enforceRateLimit(ip: string): boolean {
  const now = Date.now()
  const existing = rateLimitStore.get(ip) || []
  const active = existing.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
  if (active.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, active)
    return false
  }
  active.push(now)
  rateLimitStore.set(ip, active)
  return true
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePayload(payload: ClaimPayload): string | null {
  if (!payload.fullName?.trim()) return 'fullName is required'
  if (!payload.email?.trim()) return 'email is required'
  if (!isValidEmail(payload.email.trim())) return 'email is invalid'
  if (!payload.proofOrNotes?.trim()) return 'proofOrNotes is required'
  if (!payload.contractorName?.trim()) return 'contractorName is required'
  if (!payload.contractorSlug?.trim()) return 'contractorSlug is required'
  if (!payload.listingUrl?.trim()) return 'listingUrl is required'
  return null
}

function normalizePayload(payload: ClaimPayload): ClaimPayload {
  return {
    fullName: payload.fullName.trim(),
    roleTitle: payload.roleTitle?.trim() || null,
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() || null,
    proofOrNotes: payload.proofOrNotes.trim(),
    contractorName: payload.contractorName.trim(),
    contractorSlug: payload.contractorSlug.trim(),
    listingUrl: payload.listingUrl.trim(),
    honeypot: payload.honeypot || '',
  }
}

async function saveClaimLocally(claim: StoredClaim) {
  await mkdir(path.dirname(CLAIMS_FILE), { recursive: true })

  let claims: StoredClaim[] = []
  try {
    const raw = await readFile(CLAIMS_FILE, 'utf8')
    claims = JSON.parse(raw) as StoredClaim[]
  } catch {
    claims = []
  }

  claims.push(claim)
  await writeFile(CLAIMS_FILE, `${JSON.stringify(claims, null, 2)}\n`, 'utf8')
}

async function saveClaimToSupabaseIfConfigured(claim: StoredClaim): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return false

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const { error } = await supabase.from('listing_claim_requests').insert({
    full_name: claim.fullName,
    role_title: claim.roleTitle,
    email: claim.email,
    phone: claim.phone,
    proof_or_notes: claim.proofOrNotes,
    contractor_name: claim.contractorName,
    contractor_slug: claim.contractorSlug,
    listing_url: claim.listingUrl,
    source_ip: claim.sourceIp,
    submitted_at: claim.submittedAt,
  })

  if (error) {
    console.error('Failed to save claim to Supabase:', error.message)
    return false
  }

  return true
}

function buildClaimEmailBody(claim: StoredClaim): { subject: string; text: string; html: string } {
  const subject = `Claim Listing Request: ${claim.contractorName}`
  const lines = [
    `Contractor: ${claim.contractorName}`,
    `Slug: ${claim.contractorSlug}`,
    `Listing URL: ${claim.listingUrl}`,
    '',
    `Full Name: ${claim.fullName}`,
    `Role Title: ${claim.roleTitle || 'N/A'}`,
    `Email: ${claim.email}`,
    `Phone: ${claim.phone || 'N/A'}`,
    '',
    'Proof or Notes:',
    claim.proofOrNotes,
    '',
    `Source IP: ${claim.sourceIp}`,
    `Submitted At: ${claim.submittedAt}`,
  ]
  const text = lines.join('\n')
  const html = `
    <h2>Claim Listing Request: ${claim.contractorName}</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:6px 12px;color:#6B7280;width:140px">Contractor</td><td style="padding:6px 12px;font-weight:600">${claim.contractorName}</td></tr>
      <tr><td style="padding:6px 12px;color:#6B7280">Listing URL</td><td style="padding:6px 12px"><a href="${claim.listingUrl}">${claim.listingUrl}</a></td></tr>
      <tr><td style="padding:6px 12px;color:#6B7280">Full Name</td><td style="padding:6px 12px">${claim.fullName}</td></tr>
      <tr><td style="padding:6px 12px;color:#6B7280">Role</td><td style="padding:6px 12px">${claim.roleTitle || '—'}</td></tr>
      <tr><td style="padding:6px 12px;color:#6B7280">Email</td><td style="padding:6px 12px"><a href="mailto:${claim.email}">${claim.email}</a></td></tr>
      <tr><td style="padding:6px 12px;color:#6B7280">Phone</td><td style="padding:6px 12px">${claim.phone || '—'}</td></tr>
      <tr><td style="padding:6px 12px;color:#6B7280;vertical-align:top">Proof / Notes</td><td style="padding:6px 12px;white-space:pre-wrap">${claim.proofOrNotes}</td></tr>
      <tr><td style="padding:6px 12px;color:#6B7280">Submitted At</td><td style="padding:6px 12px">${claim.submittedAt}</td></tr>
    </table>
  `
  return { subject, text, html }
}

async function sendClaimEmailIfConfigured(claim: StoredClaim) {
  const to = process.env.CLAIM_LISTING_TO || 'support@houstontexaspro.com'
  const { subject, text, html } = buildClaimEmailBody(claim)

  // Primary: M365 SMTP (if configured)
  const smtpHost = process.env.M365_SMTP_HOST
  const smtpUser = process.env.M365_SMTP_USER
  const smtpPass = process.env.M365_SMTP_PASS
  const smtpFrom = process.env.M365_SMTP_FROM

  if (smtpHost && smtpUser && smtpPass && smtpFrom) {
    const smtpPort = Number(process.env.M365_SMTP_PORT || '587')
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    })
    await transporter.sendMail({ from: smtpFrom, to, subject, text })
    return
  }

  // Fallback: Resend
  if (resend) {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html })
    return
  }

  console.log('Claim listing payload (no email provider configured):', claim)
}

export async function POST(request: NextRequest) {
  const sourceIp = getClientIp(request)
  if (!enforceRateLimit(sourceIp)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  let body: ClaimPayload
  try {
    body = (await request.json()) as ClaimPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const normalized = normalizePayload(body)
  const validationError = validatePayload(normalized)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  // Honeypot populated => silently accept to avoid signaling bots.
  if (normalized.honeypot && normalized.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  const claim: StoredClaim = {
    ...normalized,
    submittedAt: new Date().toISOString(),
    sourceIp,
  }

  const savedToSupabase = await saveClaimToSupabaseIfConfigured(claim)
  if (!savedToSupabase) {
    await saveClaimLocally(claim)
  }

  await sendClaimEmailIfConfigured(claim)

  return NextResponse.json({ ok: true })
}
