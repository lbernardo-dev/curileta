import 'server-only';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const EVENT_PRINTABLES_BUCKET = 'curileta-site-media';
export type EventPrintableType = 'coloring' | 'printable';
export type EventPrintableLocaleText = { es: string; en: string };

export interface EventPrintable {
  id: string;
  eventId: string;
  eventSlug: string;
  eventName: EventPrintableLocaleText;
  slug: string;
  resourceType: EventPrintableType;
  title: EventPrintableLocaleText;
  description: EventPrintableLocaleText;
  fileUrl: string;
  filePath: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

type EventPrintableRow = {
  id: string;
  event_id: string;
  slug: string;
  resource_type: EventPrintableType;
  title: EventPrintableLocaleText;
  description: EventPrintableLocaleText;
  file_url: string;
  file_path: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export function isEventPrintableAsset(urlValue: unknown, pathValue: unknown): urlValue is string {
  if (typeof urlValue !== 'string' || typeof pathValue !== 'string'
    || !/^events\/printables\/[0-9a-f-]{36}\.pdf$/i.test(pathValue)) return false;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;
  try {
    const fileUrl = new URL(urlValue);
    return !fileUrl.username && !fileUrl.password
      && fileUrl.origin === new URL(supabaseUrl).origin
      && fileUrl.pathname === `/storage/v1/object/public/${EVENT_PRINTABLES_BUCKET}/${pathValue}`
      && !fileUrl.search && !fileUrl.hash;
  } catch {
    return false;
  }
}

export function mapEventPrintable(row: EventPrintableRow, event?: { slug: string; name: EventPrintableLocaleText }): EventPrintable {
  return {
    id: row.id,
    eventId: row.event_id,
    eventSlug: event?.slug || '',
    eventName: event?.name || { es: '', en: '' },
    slug: row.slug,
    resourceType: row.resource_type,
    title: row.title,
    description: row.description,
    fileUrl: row.file_url,
    filePath: row.file_path,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublishedEventPrintables(eventId: string): Promise<EventPrintable[]> {
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('event_printables')
      .select('*')
      .eq('event_id', eventId)
      .eq('is_published', true)
      .order('resource_type')
      .order('sort_order')
      .order('created_at');
    if (error || !Array.isArray(data)) return [];
    return (data as EventPrintableRow[]).map((row) => mapEventPrintable(row));
  } catch {
    return [];
  }
}

export async function getPublishedEventPrintable(slug: string): Promise<EventPrintable | null> {
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('event_printables')
      .select('*, site_events!inner(slug,name)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();
    if (error || !data) return null;
    const relatedEvent = Array.isArray(data.site_events) ? data.site_events[0] : data.site_events;
    const name = relatedEvent && typeof relatedEvent === 'object' ? relatedEvent.name : {};
    const eventSlug = relatedEvent && typeof relatedEvent === 'object' && typeof relatedEvent.slug === 'string' ? relatedEvent.slug : '';
    if (!eventSlug || !name || typeof name !== 'object') return null;
    return mapEventPrintable(data as unknown as EventPrintableRow, { slug: eventSlug, name: name as EventPrintableLocaleText });
  } catch {
    return null;
  }
}

export async function removeUnreferencedEventPrintable(path: string): Promise<boolean> {
  if (!/^events\/printables\/[0-9a-f-]{36}\.pdf$/i.test(path)) return false;
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from('event_printables').select('id').eq('file_path', path).limit(1).maybeSingle();
  if (error || data) return false;
  const { error: removeError } = await admin.storage.from(EVENT_PRINTABLES_BUCKET).remove([path]);
  return !removeError;
}

export function revalidateEventPrintablePages() {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/eventos', 'page');
}
