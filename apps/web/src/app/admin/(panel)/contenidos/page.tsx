import { requireAdmin } from '@/lib/supabase/admin';
import ContentManager from './ContentManager';

export default async function AdminContentPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <ContentManager />;
}
