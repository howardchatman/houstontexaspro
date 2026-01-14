'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CONTRACTOR_CATEGORIES, HOUSTON_AREAS } from '@/types'

interface SearchBarProps {
  variant?: 'hero' | 'compact'
  initialQuery?: string
  initialCategory?: string
  initialArea?: string
}

export function SearchBar({
  variant = 'hero',
  initialQuery = '',
  initialCategory = '',
  initialArea = '',
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [area, setArea] = useState(initialArea)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (area) params.set('area', area)
    router.push(`/search?${params.toString()}`)
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search contractors..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Query */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What do you need?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="e.g., plumber, electrician, roofing..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CONTRACTOR_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="All Houston" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Houston</SelectItem>
                {HOUSTON_AREAS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Search Contractors
          </Button>
        </div>
      </div>
    </form>
  )
}
