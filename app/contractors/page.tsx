import type { Metadata } from 'next'
import { CategoryGrid } from '@/components/contractors/CategoryGrid'

export const metadata: Metadata = {
  title: 'Find Contractors in Houston, TX | HoustonTexasPro',
  description:
    'Browse Houston contractors by category. Find electricians, plumbers, roofers, home security, HVAC, and more licensed pros serving the greater Houston area.',
}

export default function ContractorsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#0B0B0B] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Contractors in Houston, TX
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Browse all service categories to find the right contractor for your project.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CategoryGrid showAll />
      </div>
    </div>
  )
}
