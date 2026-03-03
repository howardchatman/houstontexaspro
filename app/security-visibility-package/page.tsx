import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Houston Security Visibility Package | Houston Texas Pro',
  description:
    'A dedicated $199/month visibility package for Houston low voltage and security contractors.',
  alternates: {
    canonical: '/security-visibility-package',
  },
}

export default function SecurityVisibilityPackagePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#0B0B0B] text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Get Seen by Houston Property Owners Searching for Security and Low Voltage Contractors
          </h1>
          <p className="mt-5 text-lg text-gray-300">
            The Houston Low Voltage &amp; Security Visibility Package helps qualified local contractors improve
            visibility where homeowners and businesses are already searching.
          </p>
          <p className="mt-4 text-2xl font-semibold">$199/month</p>
          <div className="mt-8">
            <Button size="lg" className="bg-white text-[#0B0B0B] hover:bg-white/90" asChild>
              <Link href="/contact?package=security-visibility">Request Visibility Check</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white">
            <Image
              src="/htpdeal.png"
              alt="Houston visibility package deal graphic for low voltage and security contractors"
              width={2048}
              height={1358}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B]">The Problem</h2>
          <p className="mt-4 text-[#374151]">
            Many Houston security and low-voltage contractors do solid work but are still hard to find online.
          </p>
          <ul className="mt-5 list-disc pl-6 space-y-2 text-[#374151]">
            <li>They rely mostly on referrals.</li>
            <li>They do not rank well for searches like &quot;Houston camera installation.&quot;</li>
            <li>They are effectively invisible in local search when buyers are ready to hire.</li>
          </ul>
        </div>
      </section>

      <section className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B]">The Solution</h2>
          <p className="mt-4 text-[#374151]">
            The Houston Low Voltage &amp; Security Visibility Package is built specifically for Houston contractors
            who install security cameras, access control, alarm systems, and structured cabling.
          </p>
          <p className="mt-3 text-[#374151]">
            It strengthens your local positioning with a credible presence on HoustonTexasPro, without locking you
            into a long-term contract.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B]">What&apos;s Included</h2>
          <ul className="mt-5 list-disc pl-6 space-y-2 text-[#374151]">
            <li>Featured listing on HoustonTexasPro</li>
            <li>SEO-optimized contractor profile</li>
            <li>Houston category placement</li>
            <li>Backlink to your contractor website</li>
            <li>&quot;Houston Verified Contractor&quot; badge</li>
            <li>Quarterly visibility review</li>
            <li>Month-to-month, no contract</li>
          </ul>
        </div>
      </section>

      <section className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B]">Why $199?</h2>
          <p className="mt-4 text-[#374151]">
            Many contractors spend $1,000 to $3,000 per month on Google Ads just to stay visible.
          </p>
          <p className="mt-3 text-[#374151]">
            This package is designed to improve long-term local positioning at a lower monthly cost, while still
            keeping your business in front of Houston buyers.
          </p>
          <p className="mt-3 text-[#374151]">
            Paid ads stop when budget stops. Local visibility assets keep working over time.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B]">Who This Is For</h2>
          <p className="mt-4 text-[#374151]">
            This offer is for Houston-based security and low-voltage contractors only.
          </p>
          <ul className="mt-5 list-disc pl-6 space-y-2 text-[#374151]">
            <li>Security camera installation companies</li>
            <li>Access control installers</li>
            <li>Security and alarm contractors</li>
            <li>Low-voltage wiring and integration teams</li>
          </ul>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="text-xl font-semibold text-[#0B0B0B]">What do you need done?</h3>
            <p className="mt-2 text-sm text-[#4B5563]">
              Select the category that best matches your security or low-voltage work. We use this to position your
              profile in the right Houston searches.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Security Cameras', 'Access Control', 'Alarm Systems', 'Low Voltage Wiring', 'Fire Alarm', 'Fire Protection'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-1 text-xs font-medium text-[#1F2937]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-[#0B0B0B]">FAQ</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[#111827]">Is this guaranteed leads?</h3>
              <p className="mt-2 text-[#374151]">
                No. This package is focused on visibility and positioning. It is designed to help qualified buyers
                find your company more easily, but it does not guarantee a specific lead volume.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#111827]">Is there a contract?</h3>
              <p className="mt-2 text-[#374151]">
                No long-term contract. It is month-to-month.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#111827]">How quickly do I see results?</h3>
              <p className="mt-2 text-[#374151]">
                Timelines vary by competition, current online presence, and category demand. Most contractors begin
                seeing movement after the profile is published and indexed.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#111827]">What happens after I sign up?</h3>
              <p className="mt-2 text-[#374151]">
                We review your current visibility, gather your company details, publish your profile and category
                placement, and schedule your first visibility review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#0B0B0B]">Ready to Strengthen Your Local Visibility in Houston?</h2>
          <p className="mt-4 text-[#374151]">
            If your company serves Houston and wants stronger local positioning, this package is built for you.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/contact?package=security-visibility">Get Featured on HoustonTexasPro</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
