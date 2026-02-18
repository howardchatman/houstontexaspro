import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ContractorTier } from '@/types'

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as Record<string, unknown>
        const contractorId = (session.metadata as Record<string, string>)?.contractor_id
        const tier = (session.metadata as Record<string, string>)?.tier as ContractorTier

        if (contractorId && tier) {
          const subscriptionId = session.subscription as string

          // Fetch subscription to get period end
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as Record<string, unknown>

          await admin
            .from('contractors')
            .update({
              tier,
              stripe_subscription_id: subscriptionId,
              subscription_status: 'active',
              subscription_period_end: new Date((subscription.current_period_end as number) * 1000).toISOString(),
              onboarding_completed: true,
              is_verified: tier === 'responding_pro' || tier === 'priority_pro',
              is_featured: tier === 'priority_pro',
            })
            .eq('id', contractorId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as Record<string, unknown>
        const contractorId = (subscription.metadata as Record<string, string>)?.contractor_id
        const tier = (subscription.metadata as Record<string, string>)?.tier as ContractorTier

        if (contractorId) {
          const subStatus = subscription.status as string
          const status = subStatus === 'active' ? 'active'
            : subStatus === 'past_due' ? 'past_due'
            : subStatus === 'trialing' ? 'trialing'
            : 'canceled'

          const updateData: Record<string, unknown> = {
            subscription_status: status,
            subscription_period_end: new Date((subscription.current_period_end as number) * 1000).toISOString(),
          }

          if (tier) {
            updateData.tier = tier
            updateData.is_verified = tier === 'responding_pro' || tier === 'priority_pro'
            updateData.is_featured = tier === 'priority_pro'
          }

          await admin
            .from('contractors')
            .update(updateData)
            .eq('id', contractorId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as Record<string, unknown>
        const contractorId = (subscription.metadata as Record<string, string>)?.contractor_id

        if (contractorId) {
          await admin
            .from('contractors')
            .update({
              tier: 'starter',
              subscription_status: 'canceled',
              stripe_subscription_id: null,
              is_verified: false,
              is_featured: false,
            })
            .eq('id', contractorId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as Record<string, unknown>
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as Record<string, unknown>
          const contractorId = (subscription.metadata as Record<string, string>)?.contractor_id

          if (contractorId) {
            await admin
              .from('contractors')
              .update({ subscription_status: 'past_due' })
              .eq('id', contractorId)
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as unknown as Record<string, unknown>
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as Record<string, unknown>
          const contractorId = (subscription.metadata as Record<string, string>)?.contractor_id

          if (contractorId) {
            // Reset monthly lead count on successful payment
            await admin
              .from('contractors')
              .update({
                subscription_status: 'active',
                monthly_lead_count: 0,
                lead_count_reset_at: new Date().toISOString(),
              })
              .eq('id', contractorId)
          }
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
