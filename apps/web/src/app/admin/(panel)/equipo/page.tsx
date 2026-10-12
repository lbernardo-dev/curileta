import { requireAdmin } from '@/lib/supabase/admin';
import TeamManager from './TeamManager';

export default async function AdminTeamPage() {
  await requireAdmin(['owner']);
  return <TeamManager />;
}
