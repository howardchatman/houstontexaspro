'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-[#0B0B0B] hover:bg-[#F5F5F5] transition-colors"
          >
            <span>{faq.q}</span>
            <ChevronDown
              className={`h-4 w-4 text-[#6B7280] shrink-0 ml-4 transition-transform duration-200 ${
                open === i ? 'rotate-180' : ''
              }`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-[#374151] text-sm leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
