import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Houston Texas Pro',
  description: 'Terms of Service for Houston Texas Pro contractor marketplace.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          <p className="text-slate-400 mt-2">Last updated: January 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-slate">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Houston Texas Pro (&quot;the Platform&quot;), you agree to be bound by these Terms of Service.
          If you do not agree to these terms, please do not use the Platform.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Houston Texas Pro is a marketplace that connects homeowners and property managers in the Greater Houston area
          with licensed contractors. We facilitate introductions but do not perform contracting work ourselves.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. You agree to provide
          accurate and complete information when creating an account. You must notify us immediately of any unauthorized
          use of your account.
        </p>

        <h2>4. Contractor Listings</h2>
        <p>
          Contractors listed on the Platform are independent businesses. Houston Texas Pro does not employ, endorse,
          or guarantee the work of any contractor. We encourage users to verify licenses, insurance, and references
          independently.
        </p>

        <h2>5. Lead Generation</h2>
        <p>
          When a homeowner submits a request through the Platform, their information may be shared with relevant
          contractors. By submitting a request, you consent to being contacted by contractors regarding your project.
        </p>

        <h2>6. Reviews and Content</h2>
        <p>
          Users may submit reviews and ratings of contractors. Reviews must be honest, accurate, and based on genuine
          experiences. We reserve the right to remove reviews that violate these guidelines.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          Houston Texas Pro is not liable for any damages arising from interactions between homeowners and contractors,
          including but not limited to property damage, financial loss, or personal injury. Users engage contractors
          at their own risk.
        </p>

        <h2>8. Privacy</h2>
        <p>
          Your use of the Platform is also governed by our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>

        <h2>9. Modifications</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the Platform after changes
          constitutes acceptance of the updated terms.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these terms? Contact us at <a href="mailto:support@houstontexaspro.com" className="text-blue-600 hover:underline">support@houstontexaspro.com</a>.
        </p>
      </div>
    </div>
  )
}
