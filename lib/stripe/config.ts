const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const STRIPE_CONFIG = {
  prices: {
    responding_pro: process.env.STRIPE_PRICE_RESPONDING_PRO!,
    priority_pro: process.env.STRIPE_PRICE_PRIORITY_PRO!,
  },
  portalReturnUrl: `${appUrl}/dashboard/billing`,
  checkoutSuccessUrl: `${appUrl}/dashboard/billing?success=true`,
  checkoutCancelUrl: `${appUrl}/onboarding/plan`,
}
