import { createAdminClient } from '@/lib/supabase/admin'
import { ProspectsClient } from './ProspectsClient'

export const metadata = { title: 'Prospects | Admin' }

export default async function AdminProspectsPage() {
  const supabase = createAdminClient()

  const { data: prospects } = await supabase
    .from('prospect_leads')
    .select('*')
    .order('priority_score', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(500)

  // Aggregate counts
  const { data: counts } = await supabase
    .from('prospect_leads')
    .select('status, communication_issue, priority_score')

  const total = counts?.length ?? 0
  const commIssues = counts?.filter((r) => r.communication_issue).length ?? 0
  const byStatus = (counts ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})

  const trades = [
    ...new Set((prospects ?? []).map((p) => p.trade).filter(Boolean) as string[]),
  ].sort()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B0B0B]">Prospects</h1>
        <p className="text-[#6B7280] mt-1 text-sm">
          Google Maps leads imported from CSV — scored and ready for outreach.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        <StatChip label="Total" value={total} />
        <StatChip label="Comm Issues" value={commIssues} highlight />
        {Object.entries(byStatus).map(([s, n]) => (
          <StatChip key={s} label={s} value={n} />
        ))}
      </div>

      <ProspectsClient
        initialProspects={prospects ?? []}
        trades={trades}
      />
    </div>
  )
}

function StatChip({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
        highlight
          ? 'bg-red-100 text-red-700'
          : 'bg-[#F5F5F5] text-[#374151]'
      }`}
    >
      <span className="font-bold">{value}</span>
      <span className="capitalize">{label}</span>
    </span>
  )
}
