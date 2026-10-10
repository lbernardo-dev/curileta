import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import BookCatalogEditor from './BookCatalogEditor';

export const metadata: Metadata = { title: 'Catálogo de libros · Administración' };

export default async function AdminBooksPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <BookCatalogEditor />;
}
