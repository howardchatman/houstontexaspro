'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Image,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Palette,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface DashboardSidebarProps {
  contractorSlug?: string
}

export function DashboardSidebar({ contractorSlug }: DashboardSidebarProps) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
    },
    {
      name: 'Gallery',
      href: '/dashboard/gallery',
      icon: Image,
    },
    {
      name: 'Leads',
      href: '/dashboard/leads',
      icon: MessageSquare,
    },
    {
      name: 'Reviews',
      href: '/dashboard/reviews',
      icon: Star,
    },
    {
      name: 'Website Template',
      href: '/dashboard/template',
      icon: Palette,
    },
  ]

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-900 text-white font-bold px-2 py-1 rounded text-sm">
            HTP
          </div>
          <span className="font-semibold text-gray-900">Dashboard</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        {contractorSlug && (
          <Link
            href={`/contractors/${contractorSlug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-900 rounded-lg hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            View Public Profile
          </Link>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
