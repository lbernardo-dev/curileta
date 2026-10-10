import { requireAdmin } from '@/lib/supabase/admin';
import { ImageFrameEditor } from './ImageFrameEditor';

export default async function ImageFramesPage() {
  await requireAdmin(['owner', 'admin', 'editor']);
  return <ImageFrameEditor />;
}
