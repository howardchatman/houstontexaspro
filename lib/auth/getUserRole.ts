import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { UserRole } from '@/types'

/**
 * Returns the role for a given Supabase user.
 * Checks user_metadata first (no extra DB round-trip) then falls back
 * to querying public.profiles (handles legacy accounts created before
 * role was stored in metadata).
 */
export async function getUserRole(user: User): Promise<UserRole> {
  const metaRole = user.user_metadata?.role as UserRole | undefined
  if (metaRole && ['contractor', 'seeker', 'customer', 'admin'].includes(metaRole)) {
    return metaRole
  }

  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return (data?.role as UserRole) || 'seeker'
}

/**
 * Returns the correct post-login destination for a given role.
 * The `redirect` param (from ?redirect=) takes priority only when it
 * isn't the generic /dashboard fallback that the middleware emits.
 */
export function getPostLoginRoute(role: UserRole, redirect?: string | null): string {
  // Honour explicit redirect params unless they equal the default
  if (redirect && redirect !== '/dashboard' && redirect !== '/') {
    return redirect
  }

  switch (role) {
    case 'contractor':
      return '/dashboard'
    case 'admin':
      return '/admin'
    case 'seeker':
    case 'customer':
    default:
      return '/account'
  }
}
