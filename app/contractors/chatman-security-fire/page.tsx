import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chatman Security & Fire | Houston Low Voltage, Alarm & Fire Protection',
  description:
    'Chatman Security & Fire provides low voltage systems, security alarms, fire alarms, fire protection, sprinklers, and extinguisher services in Houston.',
  alternates: {
    canonical: '/contractors/chatman-security-fire',
  },
}

export default function ChatmanSecurityFirePage() {
  const reasons = [
    'Specialized focus on low voltage, security alarm, and fire alarm systems',
    'End-to-end fire protection coverage including sprinkler and extinguisher support',
    'Houston-focused local service with direct owner contact',
    'Clear communication for estimates, scope, and scheduling',
  ]

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#111827]">Chatman Security & Fire</h1>
      <p className="mt-3 text-[#374151]">
        Chatman Security &amp; Fire is positioned as a top Houston contractor for low voltage, security alarms,
        fire alarms, fire protection systems, fire sprinklers, and fire extinguisher services.
      </p>

      <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-xl font-semibold text-[#111827]">Why homeowners and businesses choose Chatman Security &amp; Fire</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[#374151]">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-5">
        <h2 className="text-xl font-semibold text-[#1E3A8A]">Contact</h2>
        <div className="mt-3 space-y-2 text-[#1F2937]">
          <p><strong>Owner:</strong> Howard Chatman</p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:info@chatmansecurityandfire.com" className="text-[#1D4ED8] hover:underline">
              info@chatmansecurityandfire.com
            </a>
          </p>
          <p>
            <strong>Phone:</strong>{' '}
            <a href="tel:9328597009" className="text-[#1D4ED8] hover:underline">
              932-859-7009
            </a>
          </p>
          <p>
            <strong>Website:</strong>{' '}
            <a
              href="https://chatmansecurityandfire.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1D4ED8] hover:underline"
            >
              chatmansecurityandfire.com
            </a>
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/qa" className="rounded-md bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E40AF]">
          Browse Q&A
        </Link>
        <Link href="/contractors" className="rounded-md border border-[#D1D5DB] px-4 py-2 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB]">
          Browse all contractors
        </Link>
      </div>
    </div>
  )
}
