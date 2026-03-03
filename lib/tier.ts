import { ContractorTier, TIER_LIMITS, PRICING_TIERS } from '@/types'

/** Normalize a potentially null/undefined tier value to a valid ContractorTier */
function normalizeTier(tier: ContractorTier | null | undefined): ContractorTier {
  if (!tier || !(tier in TIER_LIMITS)) return 'starter'
  return tier
}

export function isPaidTier(tier: ContractorTier | null | undefined): boolean {
  const t = normalizeTier(tier)
  return t === 'responding_pro' || t === 'priority_pro'
}

export function isPriorityPro(tier: ContractorTier | null | undefined): boolean {
  return normalizeTier(tier) === 'priority_pro'
}

export function canReceiveLeads(tier: ContractorTier | null | undefined): boolean {
  return TIER_LIMITS[normalizeTier(tier)].canReceiveLeads
}

export function canRespondToReviews(tier: ContractorTier | null | undefined): boolean {
  return TIER_LIMITS[normalizeTier(tier)].canRespondReviews
}

export function canCustomizeTemplate(tier: ContractorTier | null | undefined): boolean {
  return TIER_LIMITS[normalizeTier(tier)].templateCustomization
}

export function getGalleryLimit(tier: ContractorTier | null | undefined): number {
  return TIER_LIMITS[normalizeTier(tier)].gallery
}

export function getTierDisplayName(tier: ContractorTier | null | undefined): string {
  return PRICING_TIERS[normalizeTier(tier)].displayName
}

export function getTierDescription(tier: ContractorTier): string {
  switch (tier) {
    case 'starter':
      return 'Directory presence only. No routed requests.'
    case 'responding_pro':
      return 'Receive routed requests with booking support.'
    case 'priority_pro':
      return 'Priority routing, emergency-first placement, and after-hours coverage.'
  }
}

export function getTierPrice(tier: ContractorTier): number {
  return PRICING_TIERS[tier].price
}

export function getTierBadge(tier: ContractorTier): string | null {
  switch (tier) {
    case 'priority_pro':
      return 'Priority'
    case 'responding_pro':
      return 'Responding Pro'
    default:
      return null
  }
}
