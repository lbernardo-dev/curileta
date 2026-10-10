import { requireAdmin } from '@/lib/supabase/admin';
import { YouTubeChannelEditor } from './YouTubeChannelEditor';

export default async function YouTubeChannelAdminPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <YouTubeChannelEditor />;
}
