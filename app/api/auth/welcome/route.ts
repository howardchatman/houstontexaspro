import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { welcomeContractorEmail } from '@/lib/emails/welcome-contractor'

export async function POST(request: NextRequest) {
  try {
    const { email, businessName } = await request.json()

    if (!email || !businessName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (resend) {
      const welcome = welcomeContractorEmail({ businessName })

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: welcome.subject,
        html: welcome.html,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Welcome email error:', err)
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
  }
}
