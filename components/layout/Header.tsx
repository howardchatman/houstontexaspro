'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { CONTRACTOR_CATEGORIES } from '@/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Only initialize Supabase if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return
    }

    const supabase = createClient()

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Auth error:', error)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const topCategories = CONTRACTOR_CATEGORIES.slice(0, 8)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <span>Houston&apos;s #1 Contractor Directory</span>
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+18001234567" className="hover:underline">1-800-123-4567</a>
            <span>|</span>
            <a href="mailto:info@houstontexaspro.com" className="hover:underline">info@houstontexaspro.com</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-900 text-white font-bold px-3 py-1 rounded">
              HTP
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl text-blue-900">Houston Texas Pro</div>
              <div className="text-xs text-gray-500">Find Trusted Contractors</div>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search contractors, services..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {topCategories.map((category) => (
                  <DropdownMenuItem key={category.slug} asChild>
                    <Link href={`/categories/${category.slug}`}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/categories" className="font-medium">
                    View All Categories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/contractors" className="text-gray-600 hover:text-blue-900">
              Browse Contractors
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Account
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/leads">Leads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register/contractor">List Your Business</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <div className="space-y-2">
                    {topCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="block text-gray-600 hover:text-blue-900"
                        onClick={() => setIsOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      href="/categories"
                      className="block font-medium text-blue-900"
                      onClick={() => setIsOpen(false)}
                    >
                      View All Categories
                    </Link>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Link
                    href="/contractors"
                    className="block text-gray-600 hover:text-blue-900 mb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse Contractors
                  </Link>
                </div>

                <div className="border-t pt-4">
                  {user ? (
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        className="block text-gray-600 hover:text-blue-900"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="block text-gray-600 hover:text-blue-900"
                        onClick={() => setIsOpen(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block text-gray-600 hover:text-blue-900"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/register/contractor" onClick={() => setIsOpen(false)}>
                          List Your Business
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
