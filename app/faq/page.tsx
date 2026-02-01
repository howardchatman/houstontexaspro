import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ | Houston Texas Pro',
  description: 'Frequently asked questions about Houston Texas Pro contractor marketplace.',
}

const faqs = [
  {
    question: 'How does Houston Texas Pro work?',
    answer: 'We connect Houston homeowners with licensed, responsive contractors. Browse by category, view profiles and reviews, then submit a request. Your request gets routed to contractors who are ready to respond.',
  },
  {
    question: 'Is it free to find a contractor?',
    answer: 'Yes. Browsing contractors, reading reviews, and submitting service requests is completely free for homeowners.',
  },
  {
    question: 'How do I know the contractors are legit?',
    answer: 'We verify contractor licenses and insurance. Look for the verified badge on contractor profiles. We also display real reviews from actual customers.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We serve the Greater Houston area, including Downtown Houston, The Heights, Katy, Sugar Land, The Woodlands, Pearland, Clear Lake, Cypress, Spring, and surrounding communities.',
  },
  {
    question: 'How quickly will a contractor respond?',
    answer: 'Response times vary, but our platform prioritizes contractors who respond fast. For emergencies, use the Emergency mode to get routed to contractors who handle urgent calls.',
  },
  {
    question: 'How do I get listed as a contractor?',
    answer: 'Click "Get Listed" and complete the registration process. You\'ll create an account, add your business information, and select your service categories. Once set up, you can start receiving leads.',
  },
  {
    question: 'How much does it cost for contractors?',
    answer: 'Basic listings are free. Premium listings with enhanced profiles, priority placement, and custom website templates are available for $29/month.',
  },
  {
    question: 'Can I leave a review for a contractor?',
    answer: 'Yes. After working with a contractor found through our platform, you can leave a rating and review on their profile to help other homeowners.',
  },
  {
    question: 'What if I have a problem with a contractor?',
    answer: 'Contact us and we\'ll help mediate. While contractors are independent businesses, we take complaints seriously and may remove contractors who don\'t meet our standards.',
  },
  {
    question: 'Do you handle payments between homeowners and contractors?',
    answer: 'No. Payment arrangements are made directly between you and the contractor. We recommend getting written estimates before any work begins.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-300 text-lg">Everything you need to know about Houston Texas Pro.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <Button asChild>
            <Link href="/contact">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
