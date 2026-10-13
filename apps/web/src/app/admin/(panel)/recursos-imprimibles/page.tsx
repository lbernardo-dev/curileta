import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import EventPrintablesManager from './EventPrintablesManager';

export const metadata: Metadata = { title: 'Recursos imprimibles · Administración' };

export default async function EventPrintablesPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <EventPrintablesManager />;
}
