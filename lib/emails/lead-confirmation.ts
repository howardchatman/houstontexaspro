export function leadConfirmationEmail({
  leadName,
  contractorName,
}: {
  leadName: string
  contractorName: string
}) {
  return {
    subject: `Your request to ${contractorName} has been sent`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Houston Texas Pro</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Request Submitted</h2>
          <p style="color: #475569;">Hi ${leadName},</p>
          <p style="color: #475569;">
            Your service request has been sent to <strong>${contractorName}</strong>.
            They will review your request and contact you directly.
          </p>

          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0; color: #166534; font-weight: 600;">What happens next?</p>
            <ul style="color: #475569; margin: 12px 0 0; padding-left: 20px;">
              <li>The contractor will review your request</li>
              <li>They&apos;ll reach out via phone or email</li>
              <li>Discuss your project details and get a quote</li>
            </ul>
          </div>

          <p style="color: #475569;">
            Need to find more contractors?
          </p>
          <a href="https://houstontexaspro.com/contractors"
             style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Browse Contractors
          </a>
        </div>
        <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>Houston Texas Pro &middot; Houston, TX</p>
        </div>
      </div>
    `,
  }
}
