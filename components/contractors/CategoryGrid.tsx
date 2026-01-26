import Link from 'next/link'
import {
  Hammer,
  Zap,
  Droplets,
  Wind,
  Home,
  Paintbrush,
  LayoutGrid,
  TreeDeciduous,
  Layers,
  Fence,
  DoorOpen,
  ChefHat,
  Bath,
  Waves,
  Building,
  Bug,
  Shield,
  Sun,
  Warehouse,
  Square,
  ThermometerSnowflake,
  PanelLeft,
  ArrowDownToLine,
  Trash2,
  Wrench,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CONTRACTOR_CATEGORIES } from '@/types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hammer,
  Zap,
  Droplets,
  Wind,
  Home,
  Paintbrush,
  LayoutGrid,
  TreeDeciduous,
  Layers,
  Fence,
  DoorOpen,
  ChefHat,
  Bath,
  Waves,
  Building,
  Bug,
  Shield,
  Sun,
  Warehouse,
  Square,
  ThermometerSnowflake,
  PanelLeft,
  ArrowDownToLine,
  Trash2,
  Wrench,
}

// Category images from Unsplash - trade-specific photography
const categoryImages: Record<string, string> = {
  'general-contractors': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  'electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
  'plumbing': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80',
  'hvac': 'https://images.unsplash.com/photo-1631545806609-48a180657247?w=400&q=80',
  'roofing': 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&q=80',
  'painting': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80',
  'flooring': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&q=80',
  'landscaping': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&q=80',
  'concrete-masonry': 'https://images.unsplash.com/photo-1590496793907-51d60c2372f0?w=400&q=80',
  'fencing': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'windows-doors': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
  'kitchen-remodeling': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  'bathroom-remodeling': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80',
  'pool-contractors': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&q=80',
  'foundation-repair': 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400&q=80',
  'pest-control': 'https://images.unsplash.com/photo-1632935190824-520ec1e54985?w=400&q=80',
  'home-security': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80',
  'solar-installation': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',
  'garage-doors': 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&q=80',
  'drywall': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
  'insulation': 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=400&q=80',
  'siding': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
  'gutters': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80',
  'demolition': 'https://images.unsplash.com/photo-1590496793907-51d60c2372f0?w=400&q=80',
  'handyman-services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
}

interface CategoryGridProps {
  limit?: number
  showAll?: boolean
}

export function CategoryGrid({ limit, showAll = false }: CategoryGridProps) {
  const categories = limit
    ? CONTRACTOR_CATEGORIES.slice(0, limit)
    : CONTRACTOR_CATEGORIES

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon] || Hammer
        const imageUrl = categoryImages[category.slug]

        return (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer h-full overflow-hidden group border-0">
              <div className="relative">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url('${imageUrl}')` }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />

                <CardContent className="relative flex flex-col items-center justify-center p-5 text-center min-h-[140px]">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/30">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-white drop-shadow-lg">
                    {category.name}
                  </h3>
                </CardContent>
              </div>
            </Card>
          </Link>
        )
      })}

      {!showAll && limit && CONTRACTOR_CATEGORIES.length > limit && (
        <Link href="/categories">
          <Card className="hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer h-full overflow-hidden group bg-blue-900 border-0">
            <CardContent className="flex flex-col items-center justify-center p-5 text-center min-h-[140px]">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/30">
                <LayoutGrid className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                View All Categories
              </h3>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  )
}
