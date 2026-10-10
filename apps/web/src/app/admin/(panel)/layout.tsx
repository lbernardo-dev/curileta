import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import { AdminShell } from './AdminShell';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const identity = await requireAdmin();
  return <AdminShell identity={identity}>{children}</AdminShell>;
}
