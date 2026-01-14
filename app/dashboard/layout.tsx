import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  // Get contractor profile
  const { data: contractor } = await supabase
    .from('contractors')
    .select('slug')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar contractorSlug={contractor?.slug} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
