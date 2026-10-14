import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import RiddlesManager from './RiddlesManager';

export const metadata: Metadata = { title: 'Acertijos de temporada · Administración' };

export default async function AdminRiddlesPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <RiddlesManager />;
}
