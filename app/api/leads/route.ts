import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { leadNotificationEmail } from '@/lib/emails/lead-notification'
import { leadConfirmationEmail } from '@/lib/emails/lead-confirmation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractor_id, name, email, phone, message, source } = body

    if (!contractor_id || !name || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Insert lead
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert({
        contractor_id,
        name,
        email: email || null,
        phone: phone || null,
        message,
        source: source || 'form',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Lead insert error:', insertError)
      return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
    }

    // Get contractor info for email
    const { data: contractor } = await supabase
      .from('contractors')
      .select('business_name, profiles(email)')
      .eq('id', contractor_id)
      .single()

    // Send emails (non-blocking - don't fail the request if email fails)
    if (resend && contractor) {
      const contractorEmail = (contractor.profiles as any)?.email

      // Email to contractor
      if (contractorEmail) {
        const notification = leadNotificationEmail({
          contractorName: contractor.business_name,
          leadName: name,
          leadEmail: email || '',
          leadPhone: phone || '',
          message,
        })

        resend.emails.send({
          from: FROM_EMAIL,
          to: contractorEmail,
          subject: notification.subject,
          html: notification.html,
        }).catch((err) => console.error('Contractor email failed:', err))
      }

      // Confirmation to homeowner
      if (email) {
        const confirmation = leadConfirmationEmail({
          leadName: name,
          contractorName: contractor.business_name,
        })

        resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: confirmation.subject,
          html: confirmation.html,
        }).catch((err) => console.error('Confirmation email failed:', err))
      }
    }

    return NextResponse.json({ success: true, lead })
  } catch (err) {
    console.error('Lead API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
