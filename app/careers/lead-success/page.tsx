import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Request Received | HoustonTexasPro',
  robots: { index: false },
}

export default function LeadSuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#0B0B0B]">You're all set!</h1>
        <p className="text-[#6B7280] text-lg">
          We've received your request. A school representative will reach out within
          1 business day with program details and next steps.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/careers">Explore More Careers</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/schools">Browse Schools</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
