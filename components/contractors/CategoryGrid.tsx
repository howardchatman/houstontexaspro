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

        return (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <Card className="hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <IconComponent className="h-6 w-6 text-blue-900" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        )
      })}

      {!showAll && limit && CONTRACTOR_CATEGORIES.length > limit && (
        <Link href="/categories">
          <Card className="hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full bg-blue-50">
            <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mb-3">
                <LayoutGrid className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-blue-900">
                View All Categories
              </h3>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  )
}
