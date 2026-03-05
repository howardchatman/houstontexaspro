const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const STRIPE_CONFIG = {
  prices: {
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      annual: process.env.STRIPE_PRICE_PRO_ANNUAL!,
    },
    elite: {
      monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY!,
      annual: process.env.STRIPE_PRICE_ELITE_ANNUAL!,
    },
  },
  portalReturnUrl: `${appUrl}/dashboard/billing`,
  checkoutSuccessUrl: `${appUrl}/dashboard/billing?success=true`,
  checkoutCancelUrl: `${appUrl}/onboarding/plan`,
}
