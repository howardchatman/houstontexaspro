export function leadNotificationEmail({
  contractorName,
  leadName,
  leadEmail,
  leadPhone,
  message,
}: {
  contractorName: string
  leadName: string
  leadEmail: string
  leadPhone: string
  message: string
}) {
  return {
    subject: `New Lead: ${leadName} is looking for your services`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Houston Texas Pro</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">New Lead Received</h2>
          <p style="color: #475569;">Hi ${contractorName},</p>
          <p style="color: #475569;">A homeowner has submitted a service request through your Houston Texas Pro profile.</p>

          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; color: #0f172a;"><strong>Name:</strong> ${leadName}</p>
            <p style="margin: 0 0 8px; color: #0f172a;"><strong>Email:</strong> ${leadEmail}</p>
            <p style="margin: 0 0 8px; color: #0f172a;"><strong>Phone:</strong> ${leadPhone || 'Not provided'}</p>
            <p style="margin: 0; color: #0f172a;"><strong>Message:</strong> ${message}</p>
          </div>

          <p style="color: #475569;">Respond quickly to increase your chances of winning this project.</p>

          <a href="https://houstontexaspro.com/dashboard/leads"
             style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            View in Dashboard
          </a>
        </div>
        <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>Houston Texas Pro &middot; Houston, TX</p>
        </div>
      </div>
    `,
  }
}
