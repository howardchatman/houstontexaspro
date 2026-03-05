const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const STRIPE_CONFIG = {
  prices: {
    pro: process.env.STRIPE_PRICE_PRO!,
    elite: process.env.STRIPE_PRICE_ELITE!,
  },
  portalReturnUrl: `${appUrl}/dashboard/billing`,
  checkoutSuccessUrl: `${appUrl}/dashboard/billing?success=true`,
  checkoutCancelUrl: `${appUrl}/onboarding/plan`,
}
