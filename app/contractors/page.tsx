import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/contractors/SearchBar'
import { ContractorCard } from '@/components/contractors/ContractorCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CONTRACTOR_CATEGORIES } from '@/types'

export const metadata = {
  title: 'Browse Contractors',
  description: 'Find trusted contractors in Houston, Texas for all your home improvement and commercial construction needs.',
}

export default async function ContractorsPage() {
  const supabase = await createClient()

  // Fetch contractors with their categories
  const { data: contractors } = await supabase
    .from('contractors')
    .select(`
      *,
      contractor_categories (
        category_id,
        categories (
          id,
          name,
          slug
        )
      )
    `)
    .order('is_featured', { ascending: false })
    .order('avg_rating', { ascending: false })
    .limit(20)

  // Transform data to include categories array
  const contractorsWithCategories = contractors?.map((contractor) => ({
    ...contractor,
    categories: contractor.contractor_categories?.map(
      (cc: { categories: { id: string; name: string; slug: string } }) => cc.categories
    ) || [],
  })) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Browse Houston Contractors
          </h1>
          <p className="text-blue-100 mb-8 max-w-2xl">
            Find verified professionals for all your residential and commercial
            construction needs.
          </p>
          <SearchBar variant="hero" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Categories</h2>
              <div className="space-y-2">
                {CONTRACTOR_CATEGORIES.slice(0, 15).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="block text-sm text-gray-600 hover:text-blue-900 hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  href="/categories"
                  className="block text-sm font-medium text-blue-600 hover:underline px-2 py-1"
                >
                  View All Categories
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {contractorsWithCategories.length} Contractors Found
                </h2>
                <p className="text-sm text-gray-500">
                  Sorted by rating and featured status
                </p>
              </div>
            </div>

            {contractorsWithCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contractorsWithCategories.map((contractor) => (
                  <ContractorCard key={contractor.id} contractor={contractor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Contractors Found
                </h3>
                <p className="text-gray-500 mb-4">
                  Be the first contractor to list on Houston Texas Pro!
                </p>
                <Button asChild>
                  <Link href="/register/contractor">Register Your Business</Link>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
