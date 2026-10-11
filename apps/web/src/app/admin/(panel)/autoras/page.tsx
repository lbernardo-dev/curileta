import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import AuthorPagesManager from './AuthorPagesManager';

export const metadata: Metadata = { title: 'Páginas de autoras · Administración' };

export default async function AdminAuthorsPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <AuthorPagesManager />;
}
