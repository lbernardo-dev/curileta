import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { ContactFormConfig, ContactSystemField } from '@/lib/forms/types';
import { localized } from '@/lib/forms/types';

type ContactRequestBody = {
  formSlug?: unknown;
  locale?: unknown;
  answers?: unknown;
  honeypot?: unknown;
  turnstileToken?: unknown;
};

const MAX_REQUEST_LENGTH = 24_000;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    };
    return entities[character];
  });
}

function fieldValue(answers: Record<string, unknown>, field: ContactFormConfig['fields'][number]) {
  const value = answers[field.key];
  if (field.type === 'checkbox') return value === true;
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, field.maxLength || 4000);
}

function validateField(field: ContactFormConfig['fields'][number], value: unknown) {
  if (field.type === 'checkbox') return !field.required || value === true;
  if (typeof value !== 'string') return !field.required;
  if (field.required && !value) return false;
  if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
  if (field.type === 'select' && value && !field.options?.some((option) => option.value === value)) return false;
  return true;
}

function systemValue(answers: Record<string, unknown>, fields: ContactFormConfig['fields'], system: ContactSystemField) {
  const field = fields.find((item) => item.system === system);
  if (!field) return '';
  const value = fieldValue(answers, field);
  if (typeof value !== 'string') return '';
  if (system === 'message') return value.replace(/[\u0000-\u0009\u000b-\u000d\u000e-\u001f\u007f]/g, '');
  return value.replace(/[\r\n\t\u0000-\u001f\u007f]+/g, ' ').trim();
}

async function verifyTurnstile(token: string, secret: string) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const result = await response.json() as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: ContactRequestBody;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_LENGTH) {
      return NextResponse.json({ success: false, error: 'El mensaje supera el tamaño permitido.' }, { status: 413 });
    }
    body = JSON.parse(rawBody) as ContactRequestBody;
  } catch {
    return NextResponse.json({ success: false, error: 'La solicitud no tiene un formato válido.' }, { status: 400 });
  }

  if (typeof body.honeypot === 'string' && body.honeypot.trim()) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (process.env.NODE_ENV === 'production'
    && (!turnstileSecret || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || !process.env.PRIVACY_NOTICE_VERSION)) {
    return NextResponse.json({ success: false, error: 'Falta completar la configuración de privacidad y antispam.' }, { status: 503 });
  }
  if (turnstileSecret) {
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    if (!token || token.length > 2048 || !(await verifyTurnstile(token, turnstileSecret))) {
      return NextResponse.json({ success: false, error: 'Completa la verificación antispam para continuar.' }, { status: 403 });
    }
  }

  const formSlug = typeof body.formSlug === 'string' ? body.formSlug : 'contact';
  const locale = body.locale === 'en' ? 'en' : 'es';
  const answers = body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)
    ? body.answers as Record<string, unknown>
    : null;
  if (!answers || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formSlug)) {
    return NextResponse.json({ success: false, error: 'Revisa los campos del formulario.' }, { status: 400 });
  }

  let supabase: ReturnType<typeof createSupabaseAdminClient>;
  let form: (ContactFormConfig & { id: string }) | null;
  try {
    supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('contact_forms')
      .select('id, slug, title, description, enabled, fields, notification_settings')
      .eq('slug', formSlug)
      .eq('enabled', true)
      .maybeSingle();
    if (error) throw error;
    form = data as (ContactFormConfig & { id: string }) | null;
  } catch {
    return NextResponse.json(
      { success: false, error: 'El formulario todavía no está conectado a la base de datos.' },
      { status: 503 }
    );
  }

  if (!form || !Array.isArray(form.fields)) {
    return NextResponse.json({ success: false, error: 'Este formulario no está disponible.' }, { status: 404 });
  }

  const normalizedAnswers: Record<string, string | boolean> = {};
  for (const field of form.fields) {
    const value = fieldValue(answers, field);
    if (!validateField(field, value)) {
      return NextResponse.json({ success: false, error: 'Revisa los campos obligatorios y sus formatos.' }, { status: 400 });
    }
    normalizedAnswers[field.key] = value;
  }

  const name = systemValue(normalizedAnswers, form.fields, 'name');
  const email = systemValue(normalizedAnswers, form.fields, 'email');
  const company = systemValue(normalizedAnswers, form.fields, 'company');
  const category = systemValue(normalizedAnswers, form.fields, 'category');
  const message = systemValue(normalizedAnswers, form.fields, 'message');
  const adultConsent = normalizedAnswers[form.fields.find((field) => field.system === 'adultConsent')?.key || ''] === true;
  const privacyConsent = normalizedAnswers[form.fields.find((field) => field.system === 'privacyConsent')?.key || ''] === true;

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: 'El formulario necesita nombre, correo y mensaje.' }, { status: 400 });
  }
  if (form.fields.some((field) => field.system === 'adultConsent') && !adultConsent) {
    return NextResponse.json({ success: false, error: 'Este formulario está reservado a personas adultas.' }, { status: 403 });
  }
  if (form.fields.some((field) => field.system === 'privacyConsent') && !privacyConsent) {
    return NextResponse.json({ success: false, error: 'Debes aceptar la política de privacidad para continuar.' }, { status: 400 });
  }

  const { data: submission, error: insertError } = await supabase
    .from('contact_submissions')
    .insert({
      form_id: form.id,
      form_slug: form.slug,
      locale,
      name,
      email,
      company: company || null,
      category: category || null,
      message,
      answers: normalizedAnswers,
      adult_consent: adultConsent,
      privacy_consent: privacyConsent,
      privacy_notice_version: process.env.PRIVACY_NOTICE_VERSION || null,
    })
    .select('id')
    .single();

  if (insertError || !submission) {
    return NextResponse.json({ success: false, error: 'No se pudo guardar el mensaje. Inténtalo de nuevo más tarde.' }, { status: 503 });
  }

  await supabase.rpc('record_public_analytics', {
    p_event_name: 'contact_submit',
    p_path: `/${locale}/contacto`,
    p_locale: locale,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const defaultTo = process.env.CONTACT_TO_EMAIL;
  const categoryRecipients = form.notification_settings?.categoryRecipients || {};
  const to = categoryRecipients[category] || form.notification_settings?.defaultTo || defaultTo;

  if (!apiKey || !from || !to) {
    await supabase.from('contact_submissions').update({ email_status: 'failed', email_error: 'Email service is not configured.' }).eq('id', submission.id);
    return NextResponse.json({ success: true, notificationPending: true }, { status: 202 });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || '—');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const additionalAnswers = form.fields
    .filter((field) => !['name', 'email', 'company', 'category', 'message', 'adultConsent', 'privacyConsent'].includes(field.system || ''))
    .map((field) => {
      const answer = normalizedAnswers[field.key];
      const answerText = typeof answer === 'boolean'
        ? (locale === 'en' ? (answer ? 'Yes' : 'No') : (answer ? 'Sí' : 'No'))
        : answer || '—';
      const label = localized(field.label, locale);
      return { label, value: answerText };
    });
  const additionalText = additionalAnswers.map(({ label, value }) => `${label}: ${value}`).join('\n');
  const additionalHtml = additionalAnswers
    .map(({ label, value }) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join('');
  const categoryLabel = form.fields.find((field) => field.system === 'category')?.options?.find((option) => option.value === category)?.label;
  const localizedCategory = locale === 'en' ? categoryLabel?.en || categoryLabel?.es : categoryLabel?.es || categoryLabel?.en;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Curileta · ${localizedCategory || 'Consulta'}] ${name}`,
        text: `Nombre: ${name}\nCorreo: ${email}\nOrganización: ${company || '—'}\nCategoría: ${localizedCategory || category || '—'}${additionalText ? `\n${additionalText}` : ''}\n\n${message}`,
        html: `<h2>Nueva consulta de Curileta</h2><p><strong>Nombre:</strong> ${safeName}</p><p><strong>Correo:</strong> ${safeEmail}</p><p><strong>Organización:</strong> ${safeCompany}</p><p><strong>Categoría:</strong> ${escapeHtml(localizedCategory || category || '—')}</p>${additionalHtml}<hr><p>${safeMessage}</p>`,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      await supabase.from('contact_submissions').update({ email_status: 'failed', email_error: `Resend returned ${response.status}.` }).eq('id', submission.id);
      return NextResponse.json({ success: true, notificationPending: true }, { status: 202 });
    }

    await supabase.from('contact_submissions').update({ email_status: 'sent', email_error: null }).eq('id', submission.id);
    return NextResponse.json({ success: true, receivedAt: new Date().toISOString() }, { status: 200 });
  } catch {
    await supabase.from('contact_submissions').update({ email_status: 'failed', email_error: 'Email delivery failed.' }).eq('id', submission.id);
    return NextResponse.json({ success: true, notificationPending: true }, { status: 202 });
  }
}
