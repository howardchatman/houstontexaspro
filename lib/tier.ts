import { ContractorTier, TIER_LIMITS, PRICING_TIERS } from '@/types'

export function isPaidTier(tier: ContractorTier): boolean {
  return tier === 'responding_pro' || tier === 'priority_pro'
}

export function isPriorityPro(tier: ContractorTier): boolean {
  return tier === 'priority_pro'
}

export function canReceiveLeads(tier: ContractorTier): boolean {
  return TIER_LIMITS[tier].canReceiveLeads
}

export function canRespondToReviews(tier: ContractorTier): boolean {
  return TIER_LIMITS[tier].canRespondReviews
}

export function canCustomizeTemplate(tier: ContractorTier): boolean {
  return TIER_LIMITS[tier].templateCustomization
}

export function getGalleryLimit(tier: ContractorTier): number {
  return TIER_LIMITS[tier].gallery
}

export function getTierDisplayName(tier: ContractorTier): string {
  return PRICING_TIERS[tier].displayName
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
