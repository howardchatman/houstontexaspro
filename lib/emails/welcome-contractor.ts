export function welcomeContractorEmail({
  businessName,
}: {
  businessName: string
}) {
  return {
    subject: `Welcome to Houston Texas Pro, ${businessName}!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Houston Texas Pro</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Welcome aboard!</h2>
          <p style="color: #475569;">
            ${businessName} is now listed on Houston Texas Pro. Homeowners across Greater Houston
            can find your business and submit service requests directly to you.
          </p>

          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 12px; color: #0f172a; font-weight: 600;">Get the most out of your profile:</p>
            <ul style="color: #475569; margin: 0; padding-left: 20px;">
              <li>Add photos of your work to your gallery</li>
              <li>Complete your business description</li>
              <li>Set your service areas for better lead matching</li>
              <li>Respond quickly to leads to build your reputation</li>
            </ul>
          </div>

          <a href="https://houstontexaspro.com/dashboard"
             style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Go to Dashboard
          </a>
        </div>
        <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>Houston Texas Pro &middot; Houston, TX</p>
        </div>
      </div>
    `,
  }
}
