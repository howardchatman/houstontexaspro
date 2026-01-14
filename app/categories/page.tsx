import { Metadata } from 'next'
import { CategoryGrid } from '@/components/contractors/CategoryGrid'

export const metadata: Metadata = {
  title: 'All Categories',
  description: 'Browse all contractor categories available on Houston Texas Pro. Find electricians, plumbers, roofers, and more.',
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            All Contractor Categories
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Browse all service categories to find the right contractor for your
            project. From general contractors to specialized trades, we have you
            covered.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <CategoryGrid showAll />
      </div>
    </div>
  )
}
