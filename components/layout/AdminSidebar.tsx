'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building, MessageSquare, Users, LogOut, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AdminSidebar() {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Contractors', href: '/admin/contractors', icon: Building },
    { name: 'Leads', href: '/admin/leads', icon: MessageSquare },
    { name: 'Prospects', href: '/admin/prospects', icon: Target },
    { name: 'Users', href: '/admin/users', icon: Users },
  ]

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r">
      <div className="p-4 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/htp_logos/htp_logo_white_background.png"
            alt="Houston Texas Pro"
            width={120}
            height={36}
            className="h-8 w-auto"
          />
          <span className="font-semibold text-[#0B0B0B]">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#F5F5F5] text-[#0B0B0B]'
                  : 'text-[#374151] hover:bg-[#F5F5F5] hover:text-[#0B0B0B]'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#374151] hover:bg-[#F5F5F5] hover:text-[#0B0B0B]"
        >
          <Building className="h-4 w-4" />
          Contractor Dashboard
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-[#374151] hover:text-[#0B0B0B]"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
