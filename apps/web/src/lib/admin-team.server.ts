import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { AdminRole } from '@/lib/supabase/admin';

const validRoles: AdminRole[] = ['owner', 'admin', 'editor', 'analyst'];

type ProfileRow = {
  user_id: string;
  display_name: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
};

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === 'string' && validRoles.includes(value as AdminRole);
}

async function listAuthUsers() {
  const client = createSupabaseAdminClient();
  const users = [];
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 500 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 500) return users;
  }
  throw new Error('La lista de cuentas de Supabase supera el límite de consulta del panel.');
}

export async function listAdminTeam() {
  const client = createSupabaseAdminClient();
  const [{ data: rows, error }, users] = await Promise.all([
    client.from('admin_profiles').select('user_id, display_name, role, created_at, updated_at').order('created_at', { ascending: true }),
    listAuthUsers(),
  ]);
  if (error) throw error;
  const usersById = new Map(users.map((user) => [user.id, user]));
  return ((rows || []) as ProfileRow[]).map((profile) => {
    const user = usersById.get(profile.user_id);
    return {
      userId: profile.user_id,
      email: user?.email || '',
      displayName: profile.display_name,
      role: profile.role,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      emailConfirmed: Boolean(user?.email_confirmed_at),
      lastSignInAt: user?.last_sign_in_at || null,
    };
  });
}

export async function findAuthUserByEmail(email: string) {
  const normalized = email.trim().toLocaleLowerCase('en-US');
  const users = await listAuthUsers();
  return users.find((user) => user.email?.toLocaleLowerCase('en-US') === normalized) || null;
}

export async function setAdminProfileRole(input: {
  actorUserId: string;
  targetUserId: string;
  role: AdminRole | null;
  displayName: string;
}) {
  const { error } = await createSupabaseAdminClient().rpc('set_admin_profile_role', {
    p_actor_user_id: input.actorUserId,
    p_target_user_id: input.targetUserId,
    p_role: input.role,
    p_display_name: input.displayName,
  });
  if (error) throw error;
}
