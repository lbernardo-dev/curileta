import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import EventsManager from './EventsManager';

export const metadata: Metadata = { title: 'Eventos · Administración' };

export default async function AdminEventsPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <EventsManager />;
}
