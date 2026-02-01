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
        <h1 className="text-2xl font-bold text-gray-900">Contractors</h1>
        <p className="text-gray-500 mt-1">
          Manage all registered contractors. {contractors?.length ?? 0} total.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-500">Business</th>
                  <th className="text-left p-4 font-medium text-gray-500">Email</th>
                  <th className="text-left p-4 font-medium text-gray-500">City</th>
                  <th className="text-left p-4 font-medium text-gray-500">Rating</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Joined</th>
                  <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contractors && contractors.length > 0 ? (
                  contractors.map((contractor: any) => (
                    <tr key={contractor.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{contractor.business_name}</p>
                        {contractor.slug && (
                          <p className="text-xs text-gray-400">/{contractor.slug}</p>
                        )}
                      </td>
                      <td className="p-4 text-gray-600">{contractor.profiles?.email || '—'}</td>
                      <td className="p-4 text-gray-600">{contractor.city || '—'}</td>
                      <td className="p-4">
                        {contractor.average_rating ? (
                          <span className="text-gray-900">{contractor.average_rating.toFixed(1)}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
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
                            <span className="text-gray-400 text-xs">Standard</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 text-xs">
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
                    <td colSpan={7} className="p-8 text-center text-gray-500">
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
