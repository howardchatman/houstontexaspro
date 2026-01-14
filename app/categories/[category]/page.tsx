import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/contractors/SearchBar'
import { ContractorCard } from '@/components/contractors/ContractorCard'
import { Button } from '@/components/ui/button'
import { CONTRACTOR_CATEGORIES } from '@/types'

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = CONTRACTOR_CATEGORIES.find((c) => c.slug === categorySlug)

  if (!category) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${category.name} in Houston, TX`,
    description: `Find trusted ${category.name.toLowerCase()} contractors in Houston, Texas. Read reviews and get free quotes.`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params
  const category = CONTRACTOR_CATEGORIES.find((c) => c.slug === categorySlug)

  if (!category) {
    notFound()
  }

  const supabase = await createClient()

  // Fetch contractors in this category
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  let contractors: Array<{
    id: string
    business_name: string
    slug: string
    city: string
    avg_rating: number
    review_count: number
    is_verified: boolean
    is_featured: boolean
    description: string | null
    logo_url: string | null
    cover_image_url: string | null
    phone: string | null
    contractor_categories?: Array<{
      categories: { id: string; name: string; slug: string }
    }>
  }> = []

  if (categoryData) {
    const { data } = await supabase
      .from('contractors')
      .select(`
        *,
        contractor_categories!inner (
          category_id,
          categories (id, name, slug)
        )
      `)
      .eq('contractor_categories.category_id', categoryData.id)
      .order('is_featured', { ascending: false })
      .order('avg_rating', { ascending: false })

    contractors = data || []
  }

  // Transform data to include categories array
  const contractorsWithCategories = contractors.map((contractor) => ({
    ...contractor,
    categories: contractor.contractor_categories?.map(
      (cc) => cc.categories
    ) || [],
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/categories" className="hover:text-white">
              Categories
            </Link>
            <span>/</span>
            <span>{category.name}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {category.name} in Houston, TX
          </h1>
          <p className="text-blue-100 mb-8 max-w-2xl">
            Find verified {category.name.toLowerCase()} contractors serving the
            Houston area. Compare ratings, read reviews, and get free quotes.
          </p>
          <SearchBar
            variant="hero"
            initialCategory={categorySlug}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Related Categories</h2>
              <div className="space-y-2">
                {CONTRACTOR_CATEGORIES.filter((c) => c.slug !== categorySlug)
                  .slice(0, 10)
                  .map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="block text-sm text-gray-600 hover:text-blue-900 hover:bg-gray-50 px-2 py-1 rounded"
                    >
                      {cat.name}
                    </Link>
                  ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {contractorsWithCategories.length} {category.name} Contractors
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
                  No {category.name} Contractors Yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Be the first {category.name.toLowerCase()} contractor on Houston
                  Texas Pro!
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
