'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X, Search, User, ChevronDown, AlertTriangle, Phone } from 'lucide-react'
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
      {/* Top bar - Emergency focused */}
      <div className="bg-[#0B0B0B] text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[#9CA3AF]">Houston&apos;s Contractor Command Center</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/contractors?emergency=true"
              className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Emergency? Get Help Now</span>
            </Link>
            <span className="hidden md:inline text-gray-700">|</span>
            <span className="hidden md:inline text-[#9CA3AF]">Serving Greater Houston 24/7</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/htp_logos/htp_logo_white_background.png"
              alt="Houston Texas Pro"
              width={160}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <Input
                type="search"
                placeholder="What do you need done?"
                className="pl-10 pr-4 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-[#374151]">
                  Services <ChevronDown className="h-4 w-4" />
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
                    View All Services
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/contractors" className="text-[#374151] hover:text-[#0B0B0B]">
              Find Contractors
            </Link>
            <Link href="/qa" className="text-[#374151] hover:text-[#0B0B0B]">
              Q&A
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
                  <Link href="/register/contractor">Get Listed</Link>
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
                {/* Emergency Button - Mobile */}
                <Link
                  href="/contractors?emergency=true"
                  className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <AlertTriangle className="h-5 w-5" />
                  Emergency? Get Help Now
                </Link>

                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                      type="search"
                      placeholder="What do you need done?"
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 text-[#0B0B0B]">Popular Services</h3>
                  <div className="space-y-2">
                    {topCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="block text-[#374151] hover:text-[#0B0B0B] py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      href="/categories"
                      className="block font-medium text-[#1F3C58] pt-2"
                      onClick={() => setIsOpen(false)}
                    >
                      View All Services →
                    </Link>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Link
                    href="/contractors"
                    className="block text-[#374151] font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Find Contractors
                  </Link>
                  <Link
                    href="/qa"
                    className="block text-[#374151] py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Q&A
                  </Link>
                  <Link
                    href="/for-contractors"
                    className="block text-[#374151] py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    For Contractors
                  </Link>
                </div>

                <div className="border-t pt-4">
                  {user ? (
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        className="block text-[#374151] hover:text-[#0B0B0B] py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="block text-[#374151] hover:text-[#0B0B0B] py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block text-[#374151] hover:text-[#0B0B0B] py-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/register/contractor" onClick={() => setIsOpen(false)}>
                          Get Listed — Free
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Bottom info */}
                <div className="mt-auto pt-4 border-t text-center text-sm text-[#6B7280]">
                  <p>Serving Greater Houston 24/7</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
