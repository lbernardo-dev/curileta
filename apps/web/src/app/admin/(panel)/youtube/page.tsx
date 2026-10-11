import { requireAdmin } from '@/lib/supabase/admin';
import { YouTubeAdmin } from './YouTubeAdmin';

export default async function YouTubeChannelAdminPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <YouTubeAdmin />;
}
