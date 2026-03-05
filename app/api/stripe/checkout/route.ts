import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  try {
    const { tier } = await request.json()

    if (tier !== 'pro' && tier !== 'elite') {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Get contractor record
    const { data: contractor } = await admin
      .from('contractors')
      .select('id, stripe_customer_id, business_name')
      .eq('user_id', user.id)
      .single()

    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 })
    }

    // Get or create Stripe customer
    let customerId = contractor.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          contractor_id: contractor.id,
          user_id: user.id,
        },
      })
      customerId = customer.id

      await admin
        .from('contractors')
        .update({ stripe_customer_id: customerId })
        .eq('id', contractor.id)
    }

    // Create checkout session
    const priceId = STRIPE_CONFIG.prices[tier as keyof typeof STRIPE_CONFIG.prices]
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: STRIPE_CONFIG.checkoutSuccessUrl,
      cancel_url: STRIPE_CONFIG.checkoutCancelUrl,
      metadata: {
        contractor_id: contractor.id,
        tier,
      },
      subscription_data: {
        metadata: {
          contractor_id: contractor.id,
          tier,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
