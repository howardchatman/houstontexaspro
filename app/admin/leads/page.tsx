import { createAdminClient } from '@/lib/supabase/admin'
import AdminLeadsClient from './AdminLeadsClient'

export default async function AdminLeadsPage() {
  const supabase = createAdminClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*, contractors(business_name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0B0B0B]">Leads</h1>
        <p className="text-[#6B7280] mt-1">
          All lead submissions across the platform. {leads?.length ?? 0} total.
        </p>
      </div>

      <AdminLeadsClient leads={leads || []} />
    </div>
  )
}
