import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Search, Star, Clock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/account')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const name = profile?.full_name || user.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0B0B0B]">Welcome back, {name}</h1>
          <p className="text-[#6B7280] mt-1">Find and manage your Houston contractors</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="w-10 h-10 rounded-full bg-[#1F3C58]/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-[#1F3C58]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Find a contractor</p>
                <Link href="/contractors" className="text-sm font-medium text-[#1F3C58] hover:underline">
                  Browse all →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="w-10 h-10 rounded-full bg-[#1F3C58]/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-[#1F3C58]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Your reviews</p>
                <span className="text-sm font-medium text-[#374151]">0 written</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="w-10 h-10 rounded-full bg-[#1F3C58]/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#1F3C58]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Recent requests</p>
                <span className="text-sm font-medium text-[#374151]">0 sent</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Account type</span>
              <span className="font-medium capitalize">{profile?.role || 'seeker'}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B7280] mb-3">Are you a contractor?</p>
          <Button variant="outline" asChild>
            <Link href="/register/contractor">Register your business</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
