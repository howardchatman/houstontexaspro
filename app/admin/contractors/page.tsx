import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AdminContractorActions from './AdminContractorActions'

export default async function AdminContractorsPage() {
  const supabase = createAdminClient()

  const { data: contractors } = await supabase
    .from('contractors')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0B0B0B]">Contractors</h1>
        <p className="text-[#6B7280] mt-1">
          Manage all registered contractors. {contractors?.length ?? 0} total.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#F5F5F5]">
                  <th className="text-left p-4 font-medium text-[#6B7280]">Business</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Email</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">City</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Rating</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Status</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Joined</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contractors && contractors.length > 0 ? (
                  contractors.map((contractor: any) => (
                    <tr key={contractor.id} className="border-b last:border-0 hover:bg-[#F5F5F5]">
                      <td className="p-4">
                        <p className="font-medium text-[#0B0B0B]">{contractor.business_name}</p>
                        {contractor.slug && (
                          <p className="text-xs text-[#9CA3AF]">/{contractor.slug}</p>
                        )}
                      </td>
                      <td className="p-4 text-[#374151]">{contractor.profiles?.email || '—'}</td>
                      <td className="p-4 text-[#374151]">{contractor.city || '—'}</td>
                      <td className="p-4">
                        {contractor.average_rating ? (
                          <span className="text-[#0B0B0B]">{contractor.average_rating.toFixed(1)}</span>
                        ) : (
                          <span className="text-[#9CA3AF]">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {contractor.is_verified && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Verified</Badge>
                          )}
                          {contractor.is_featured && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">Featured</Badge>
                          )}
                          {!contractor.is_verified && !contractor.is_featured && (
                            <span className="text-[#9CA3AF] text-xs">Standard</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-[#6B7280] text-xs">
                        {new Date(contractor.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <AdminContractorActions
                          contractorId={contractor.id}
                          isVerified={contractor.is_verified}
                          isFeatured={contractor.is_featured}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#6B7280]">
                      No contractors registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
