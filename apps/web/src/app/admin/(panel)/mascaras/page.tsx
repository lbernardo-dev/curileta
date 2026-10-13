import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/admin';
import CharacterMasksManager from './CharacterMasksManager';

export const metadata: Metadata = { title: 'Máscaras descargables · Administración' };

export default async function CharacterMasksPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <CharacterMasksManager />;
}
