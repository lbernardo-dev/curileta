import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import LettersManager from './LettersManager';

export const metadata: Metadata = { title: 'Cartas · Administración' };

export default async function AdminLettersPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <LettersManager />;
}
