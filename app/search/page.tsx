import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/contractors/SearchBar'
import { ContractorCard } from '@/components/contractors/ContractorCard'
import { Button } from '@/components/ui/button'
import { CONTRACTOR_CATEGORIES } from '@/types'

interface PageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    area?: string
    rating?: string
  }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const query = params.q

  return {
    title: query ? `Search: ${query}` : 'Search Contractors',
    description: `Search for contractors in Houston, Texas. ${query ? `Results for "${query}"` : 'Find trusted professionals for your project.'}`,
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q || ''
  const categorySlug = params.category || ''
  const area = params.area || ''
  const minRating = params.rating ? parseFloat(params.rating) : 0

  const supabase = await createClient()

  // Build the query
  let dbQuery = supabase
    .from('contractors')
    .select(`
      *,
      contractor_categories (
        category_id,
        categories (id, name, slug)
      )
    `)

  // Apply search filter using text search
  if (query) {
    dbQuery = dbQuery.or(`business_name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  // Apply rating filter
  if (minRating > 0) {
    dbQuery = dbQuery.gte('avg_rating', minRating)
  }

  // Apply area filter
  if (area && area !== 'all') {
    dbQuery = dbQuery.contains('service_area', [area])
  }

  // Order results
  dbQuery = dbQuery
    .order('is_featured', { ascending: false })
    .order('avg_rating', { ascending: false })
    .limit(50)

  const { data: contractors } = await dbQuery

  // Filter by category if specified (need to do this client-side due to join complexity)
  let filteredContractors = contractors || []

  if (categorySlug && categorySlug !== 'all') {
    filteredContractors = filteredContractors.filter((contractor) =>
      contractor.contractor_categories?.some(
        (cc: { categories: { slug: string } }) => cc.categories?.slug === categorySlug
      )
    )
  }

  // Transform data to include categories array
  const contractorsWithCategories = filteredContractors.map((contractor) => ({
    ...contractor,
    categories: contractor.contractor_categories?.map(
      (cc: { categories: { id: string; name: string; slug: string } }) => cc.categories
    ) || [],
  }))

  const selectedCategory = categorySlug
    ? CONTRACTOR_CATEGORIES.find((c) => c.slug === categorySlug)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {query
              ? `Search Results for "${query}"`
              : selectedCategory
              ? `${selectedCategory.name} Contractors`
              : 'Search Contractors'}
          </h1>
          <p className="text-blue-100 mb-8">
            {contractorsWithCategories.length} contractor
            {contractorsWithCategories.length !== 1 ? 's' : ''} found
            {area && area !== 'all' ? ` in ${area}` : ' in Houston'}
          </p>
          <SearchBar
            variant="hero"
            initialQuery={query}
            initialCategory={categorySlug}
            initialArea={area}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Filter by Category</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <Link
                  href={`/search?q=${query}${area ? `&area=${area}` : ''}`}
                  className={`block text-sm px-2 py-1 rounded ${
                    !categorySlug || categorySlug === 'all'
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'text-gray-600 hover:text-blue-900 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </Link>
                {CONTRACTOR_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/search?q=${query}&category=${cat.slug}${area ? `&area=${area}` : ''}`}
                    className={`block text-sm px-2 py-1 rounded ${
                      categorySlug === cat.slug
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-600 hover:text-blue-900 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <h2 className="font-semibold text-lg mb-4">Minimum Rating</h2>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <Link
                      key={rating}
                      href={`/search?q=${query}${categorySlug ? `&category=${categorySlug}` : ''}${area ? `&area=${area}` : ''}${rating > 0 ? `&rating=${rating}` : ''}`}
                      className={`block text-sm px-2 py-1 rounded ${
                        minRating === rating
                          ? 'bg-blue-100 text-blue-900 font-medium'
                          : 'text-gray-600 hover:text-blue-900 hover:bg-gray-50'
                      }`}
                    >
                      {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {contractorsWithCategories.length} Contractor
                  {contractorsWithCategories.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-sm text-gray-500">
                  Sorted by rating and featured status
                </p>
              </div>
            </div>

            {contractorsWithCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contractorsWithCategories.map((contractor) => (
                  <ContractorCard key={contractor.id} contractor={contractor as any} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Contractors Found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or browse all contractors.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/contractors">Browse All</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register/contractor">List Your Business</Link>
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
