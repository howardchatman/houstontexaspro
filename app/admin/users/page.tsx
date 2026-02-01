import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminUsersPage() {
  const supabase = createAdminClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0B0B0B]">Users</h1>
        <p className="text-[#6B7280] mt-1">
          All registered users. {users?.length ?? 0} total.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#F5F5F5]">
                  <th className="text-left p-4 font-medium text-[#6B7280]">Name</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Email</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Role</th>
                  <th className="text-left p-4 font-medium text-[#6B7280]">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user: any) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-[#F5F5F5]">
                      <td className="p-4 font-medium text-[#0B0B0B]">
                        {user.full_name || '—'}
                      </td>
                      <td className="p-4 text-[#374151]">{user.email}</td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-700'
                              : user.role === 'contractor'
                              ? 'bg-gray-100 text-[#374151]'
                              : 'bg-gray-100 text-[#374151]'
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-[#6B7280] text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#6B7280]">
                      No users yet.
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
