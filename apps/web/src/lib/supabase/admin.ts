import 'server-only';

import { redirect } from 'next/navigation';
import { createSupabaseAdminClient, createSupabaseServerClient } from './server';

export type AdminRole = 'owner' | 'admin' | 'editor' | 'analyst';

export interface AdminIdentity {
  userId: string;
  email: string;
  displayName: string;
  role: AdminRole;
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  try {
    const auth = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await auth.auth.getUser();
    if (authError || !user) return null;

    const admin = createSupabaseAdminClient();
    const { data: profile, error } = await admin
      .from('admin_profiles')
      .select('display_name, role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !profile) return null;
    if (!['owner', 'admin', 'editor', 'analyst'].includes(profile.role)) return null;

    return {
      userId: user.id,
      email: user.email || '',
      displayName: profile.display_name || user.email || 'Equipo Curileta',
      role: profile.role as AdminRole,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(allowedRoles?: AdminRole[]) {
  const identity = await getAdminIdentity();
  if (!identity) redirect('/admin/login');
  if (allowedRoles && !allowedRoles.includes(identity.role)) redirect('/admin');
  return identity;
}
