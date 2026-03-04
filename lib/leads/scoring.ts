const COMMUNICATION_KEYWORDS = [
  'never called',
  'no response',
  'hard to contact',
  "didn't call",
  'did not call',
  'voicemail',
  'unreachable',
  'no answer',
  'not respond',
  'call back',
  'reach',
  'respond',
  'call',
  'text',
]

export function computeCombinedReview(
  review1?: string,
  keyword?: string,
  review2?: string
): string {
  return [review1, keyword, review2]
    .filter((s): s is string => Boolean(s?.trim()))
    .join(' ')
    .trim()
}

export function computeCommunicationIssue(combined: string): boolean {
  const lower = combined.toLowerCase()
  return COMMUNICATION_KEYWORDS.some((kw) => lower.includes(kw))
}

export function computePriorityScore(
  commIssue: boolean,
  rating?: number | null
): number {
  if (commIssue) return 3
  if (typeof rating === 'number' && rating < 4.5) return 2
  return 1
}

/** Matches the unique index formula in the DB migration. */
export function computeDedupeKey(
  companyName: string,
  phone?: string | null,
  address?: string | null
): string {
  const name = (companyName || '').toLowerCase()
  const phoneDigits = (phone || '').replace(/[^0-9]/g, '')
  const addr = (address || '').toLowerCase()
  return `${name}|${phoneDigits}|${addr}`
}
