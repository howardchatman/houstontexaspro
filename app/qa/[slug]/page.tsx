import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CONTRACTOR_CATEGORIES } from '@/types'
import { qaBySlug, qaData } from '@/lib/qa'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export function generateStaticParams() {
  return qaData.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = qaBySlug.get(slug)

  if (!entry) {
    return {
      title: 'Q&A Not Found',
    }
  }

  return {
    title: `${entry.question} | Houston Contractor Q&A`,
    description: entry.answer.slice(0, 160),
    alternates: {
      canonical: `/qa/${entry.slug}`,
    },
  }
}

export default async function QADetailPage({ params }: PageProps) {
  const { slug } = await params
  const entry = qaBySlug.get(slug)

  if (!entry) {
    notFound()
  }

  const hasCategoryPage = CONTRACTOR_CATEGORIES.some((category) => category.slug === entry.category)
  const categoryHref = hasCategoryPage ? `/categories/${entry.category}` : `/contractors/${entry.category}`

  const faqSchema = entry.faqs.length > 0
    ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entry.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }
    : null

  return (
    <div className="container mx-auto px-4 py-10">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Link href="/qa" className="text-sm text-[#2563EB] hover:underline">← Back to all Q&A</Link>

      <h1 className="mt-4 text-3xl font-bold text-[#111827]">{entry.question}</h1>
      <p className="mt-3 text-[#374151]">{entry.answer}</p>

      <ul className="mt-6 list-disc space-y-2 pl-6 text-[#374151]">
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      {entry.links && entry.links.length > 0 && (
        <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-lg font-semibold text-[#111827]">Recommended links</h2>
          <ul className="mt-3 space-y-2">
            {entry.links.map((link) => (
              <li key={link.url}>
                {link.url.startsWith('/') ? (
                  <Link href={link.url} className="text-[#1D4ED8] hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.url}
                    className="text-[#1D4ED8] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-5">
        <h2 className="text-lg font-semibold text-[#1E3A8A]">Browse contractors</h2>
        <p className="mt-2 text-sm text-[#1F2937]">
          Compare verified Houston pros in <strong>{entry.category}</strong> and request quotes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={categoryHref} className="rounded-md bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E40AF]">
            View {entry.category} contractors
          </Link>
          <Link href="/contractors" className="rounded-md border border-[#93C5FD] px-4 py-2 text-sm font-medium text-[#1D4ED8] hover:bg-[#DBEAFE]">
            Browse all contractors
          </Link>
        </div>
      </div>

      {entry.faqs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[#111827]">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {entry.faqs.map((faq) => (
              <article key={faq.q} className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                <h3 className="font-semibold text-[#111827]">{faq.q}</h3>
                <p className="mt-2 text-[#374151]">{faq.a}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
