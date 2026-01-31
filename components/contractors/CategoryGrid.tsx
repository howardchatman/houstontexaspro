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
  Trash2,
  Wrench,
  Sparkles,
  HomeIcon,
  ShieldCheck,
  Truck,
  Refrigerator,
  KeyRound,
  TreePine,
} from 'lucide-react'
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
  Trash2,
  Wrench,
  Sparkles,
  HomeIcon,
  ShieldCheck,
  Truck,
  Refrigerator,
  KeyRound,
  TreePine,
}

// Category images - local images where available, Unsplash fallbacks for the rest
export const categoryImages: Record<string, string> = {
  'general-contractors': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  'electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
  'plumbing': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80',
  'hvac': '/hvac_image.png',
  'roofing': 'https://images.unsplash.com/photo-1635424710928-0544e8512eae?w=800&q=80',
  'painting': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80',
  'flooring': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80',
  'landscaping': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
  'concrete-masonry': '/masonry_image.png',
  'fencing': '/fence_image.png',
  'windows-doors': 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80',
  'kitchen-remodeling': 'https://images.unsplash.com/photo-1556185781-a47769abb7ee?w=800&q=80',
  'bathroom-remodeling': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
  'pool-contractors': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80',
  'foundation-repair': '/foundation_image.png',
  'pest-control': 'https://images.unsplash.com/photo-1611689342806-0863700ce8e4?w=800&q=80',
  'home-security': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
  'solar-installation': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  'garage-doors': '/garage_image.png',
  'drywall': '/drywall_image.png',
  'insulation': 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&q=80',
  'siding': '/siding_image.png',
  'moving-services': 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=80',
  'appliance-repair': '/appliance_image.png',
  'locksmith-services': '/locksmith_image.png',
  'pressure-washing': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'tree-services': '/tree_image.png',
  'demolition': 'https://images.unsplash.com/photo-1590496793907-51d60c2372f0?w=800&q=80',
  'handyman-services': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
  'cleaning-services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'real-estate-services': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  'insurance-services': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon] || Hammer
        const imageUrl = categoryImages[category.slug]

        return (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <div className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-4/3">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${imageUrl}')` }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-white/80" />
                  <h3 className="text-lg font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        )
      })}

      {!showAll && limit && CONTRACTOR_CATEGORIES.length > limit && (
        <Link href="/categories">
          <div className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-4/3 bg-slate-100">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 group-hover:bg-slate-200 transition-colors">
              <LayoutGrid className="h-8 w-8 text-slate-400 mb-3" />
              <h3 className="text-lg font-semibold text-slate-600">
                View All
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {CONTRACTOR_CATEGORIES.length - limit}+ more services
              </p>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
