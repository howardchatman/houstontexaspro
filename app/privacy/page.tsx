import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Houston Texas Pro',
  description: 'Privacy Policy for Houston Texas Pro contractor marketplace.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-slate-400 mt-2">Last updated: January 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-slate">
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly, including your name, email address, phone number,
          and project details when you create an account or submit a service request.
        </p>

        <h3>For Homeowners</h3>
        <ul>
          <li>Name, email, and phone number</li>
          <li>Project descriptions and service requests</li>
          <li>Reviews and ratings you submit</li>
        </ul>

        <h3>For Contractors</h3>
        <ul>
          <li>Business name, contact information, and service areas</li>
          <li>License and insurance information</li>
          <li>Portfolio images and business descriptions</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To connect homeowners with relevant contractors</li>
          <li>To display contractor profiles and reviews</li>
          <li>To send service request notifications</li>
          <li>To improve our platform and services</li>
          <li>To communicate important updates about your account</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>
          When you submit a service request, your contact information and project details are shared with
          contractors who match your needs. We do not sell your personal information to third parties.
        </p>

        <h2>Data Security</h2>
        <p>
          We use industry-standard security measures to protect your data, including encrypted connections
          and secure data storage through our infrastructure providers.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies to maintain your session and improve your experience. You can disable cookies
          in your browser settings, though some features may not function properly.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any time
          by contacting us at <a href="mailto:support@houstontexaspro.com" className="text-blue-600 hover:underline">support@houstontexaspro.com</a>.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes
          through the Platform or via email.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Contact us at <a href="mailto:support@houstontexaspro.com" className="text-blue-600 hover:underline">support@houstontexaspro.com</a>.
        </p>
      </div>
    </div>
  )
}
