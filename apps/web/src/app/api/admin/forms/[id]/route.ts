import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { ContactFormField, LocalizedValue } from '@/lib/forms/types';

function isLocalizedValue(value: unknown): value is LocalizedValue {
  return Boolean(value && typeof value === 'object' && typeof (value as LocalizedValue).es === 'string');
}

function isEmailAddress(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidField(value: unknown): value is ContactFormField {
  if (!value || typeof value !== 'object') return false;
  const field = value as ContactFormField;
  return /^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(field.key)
    && ['text', 'email', 'textarea', 'select', 'checkbox'].includes(field.type)
    && isLocalizedValue(field.label)
    && typeof field.required === 'boolean'
    && (field.maxLength === undefined || (Number.isInteger(field.maxLength) && field.maxLength > 0 && field.maxLength <= 10000))
    && (field.type !== 'select' || (
      Array.isArray(field.options)
      && field.options.length > 0
      && field.options.length <= 40
      && field.options.every((option) => Boolean(
        option
        && typeof option.value === 'string'
        && /^[a-z0-9][a-z0-9_]{0,49}$/.test(option.value)
        && isLocalizedValue(option.label)
      ))
      && new Set(field.options.map((option) => option.value)).size === field.options.length
    ));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin(['owner', 'admin']);
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'La solicitud no tiene un formato válido.' }, { status: 400 });
  }

  const title = body.title;
  const description = body.description;
  const fields = body.fields;
  if (!isLocalizedValue(title) || !isLocalizedValue(description) || !Array.isArray(fields) || !fields.every(isValidField)) {
    return NextResponse.json({ success: false, error: 'Revisa los nombres y campos del formulario.' }, { status: 400 });
  }
  if (fields.filter((field) => field.system === 'name').length !== 1
    || fields.filter((field) => field.system === 'email').length !== 1
    || fields.filter((field) => field.system === 'message').length !== 1) {
    return NextResponse.json({ success: false, error: 'El formulario debe incluir un nombre, un correo y un mensaje.' }, { status: 400 });
  }
  if (new Set(fields.map((field) => field.key)).size !== fields.length) {
    return NextResponse.json({ success: false, error: 'Cada campo necesita un identificador distinto.' }, { status: 400 });
  }

  const enabled = typeof body.enabled === 'boolean' ? body.enabled : true;
  const notificationSettings = body.notificationSettings;
  if (notificationSettings !== undefined && (!notificationSettings || typeof notificationSettings !== 'object' || Array.isArray(notificationSettings))) {
    return NextResponse.json({ success: false, error: 'Revisa la configuración de notificaciones.' }, { status: 400 });
  }
  if (notificationSettings) {
    const settings = notificationSettings as { defaultTo?: unknown; categoryRecipients?: unknown };
    if (settings.defaultTo !== undefined && settings.defaultTo !== '' && !isEmailAddress(settings.defaultTo)) {
      return NextResponse.json({ success: false, error: 'La dirección para las consultas no es válida.' }, { status: 400 });
    }
    if (settings.categoryRecipients !== undefined) {
      const recipients = settings.categoryRecipients;
      if (!recipients || typeof recipients !== 'object' || Array.isArray(recipients)
        || Object.entries(recipients).some(([category, email]) => !/^[a-z0-9_-]{1,80}$/.test(category) || !isEmailAddress(email))) {
        return NextResponse.json({ success: false, error: 'Revisa los destinatarios por categoría.' }, { status: 400 });
      }
    }
  }

  try {
    const supabase = createSupabaseAdminClient();
    const update: Record<string, unknown> = { title, description, fields, enabled, updated_at: new Date().toISOString() };
    if (notificationSettings) update.notification_settings = notificationSettings;
    const { data, error } = await supabase
      .from('contact_forms')
      .update(update)
      .eq('id', id)
      .select('id, slug, title, description, enabled, fields, notification_settings, updated_at')
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo guardar la configuración.' }, { status: 503 });
  }
}
