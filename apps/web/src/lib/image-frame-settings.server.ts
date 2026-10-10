import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { ImageFrameKey, ImageFrameMap } from './image-frames';

export async function getImageFrameSettings(): Promise<ImageFrameMap> {
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('image_frame_settings')
      .select('target_key, position_x, position_y, zoom');

    if (error) throw error;

    return Object.fromEntries((data || []).map((row) => [row.target_key as ImageFrameKey, {
      positionX: row.position_x,
      positionY: row.position_y,
      zoom: Number(row.zoom),
    }]));
  } catch (error) {
    console.error('[ImageFrameSettings] No se pudieron leer los encuadres; se usan los valores por defecto.', error);
    return {};
  }
}
