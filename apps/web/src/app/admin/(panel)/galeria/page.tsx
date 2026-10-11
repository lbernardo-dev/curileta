import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import GalleryManager from './GalleryManager';

export const metadata: Metadata = { title: 'Galería · Administración' };

export default async function AdminGalleryPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <GalleryManager />;
}
