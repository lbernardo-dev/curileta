'use client';

import { useEffect, useState } from 'react';
import type { ContactFormConfig, ContactFormField, ContactFormOption } from '@/lib/forms/types';

interface FormRecord extends ContactFormConfig {
  updated_at: string;
}

function formText(value: { es: string; en?: string } | undefined, locale: 'es' | 'en') {
  return locale === 'en' ? value?.en || value?.es || '' : value?.es || value?.en || '';
}

function optionLines(options: ContactFormOption[] | undefined) {
  return (options || []).map((option) => `${option.value}|${option.label.es}|${option.label.en || ''}`).join('\n');
}

function parseOptionLines(value: string): ContactFormOption[] {
  return value.split('\n').map((line) => line.trim()).filter(Boolean).map((line, index) => {
    const [rawValue, spanish, english = ''] = line.split('|').map((part) => part.trim());
    return {
      value: rawValue || `option_${index + 1}`,
      label: { es: spanish || rawValue || `Opción ${index + 1}`, en: english || undefined },
    };
  }).slice(0, 40);
}

export function FormsManager() {
  const [forms, setForms] = useState<FormRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/admin/forms')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudieron cargar los formularios.');
        setForms(result.data as FormRecord[]);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los formularios.'))
      .finally(() => setLoading(false));
  }, []);

  function updateForm(id: string, updater: (form: FormRecord) => FormRecord) {
    setForms((current) => current.map((form) => form.id === id ? updater(form) : form));
  }

  function updateField(formId: string, fieldKey: string, updater: (field: ContactFormField) => ContactFormField) {
    updateForm(formId, (form) => ({
      ...form,
      fields: form.fields.map((field) => field.key === fieldKey ? updater(field) : field),
    }));
  }

  function addField(formId: string) {
    updateForm(formId, (form) => ({
      ...form,
      fields: [...form.fields, {
        key: `custom_${Date.now()}`,
        type: 'text',
        required: false,
        label: { es: 'Nuevo campo', en: 'New field' },
      }],
    }));
  }

  function removeField(formId: string, fieldKey: string) {
    updateForm(formId, (form) => ({ ...form, fields: form.fields.filter((field) => field.key !== fieldKey) }));
  }

  function updateCategoryRecipient(formId: string, category: string, email: string) {
    updateForm(formId, (form) => {
      const categoryRecipients = { ...form.notification_settings?.categoryRecipients };
      if (email.trim()) categoryRecipients[category] = email.trim();
      else delete categoryRecipients[category];
      return {
        ...form,
        notification_settings: { ...form.notification_settings, categoryRecipients },
      };
    });
  }

  async function saveForm(form: FormRecord) {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/forms/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          fields: form.fields,
          enabled: form.enabled,
          notificationSettings: form.notification_settings || {},
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la configuración.');
      updateForm(form.id, (current) => ({ ...current, ...result.data }));
      setNotice('La configuración se guardó.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la configuración.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="space-y-4" aria-label="Cargando formularios"><div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" /><div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" /></div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Configuración</p>
        <h1 className="text-balance mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Formularios</h1>
        <p className="text-pretty mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">Activa cada formulario y ajusta sus textos, campos y destinatarios.</p>
      </header>

      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-[#313131] dark:bg-[#272727] dark:text-emerald-100">{notice}</p>}

      {forms.length ? forms.map((form) => (
        <section key={form.id} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{form.slug}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Ruta pública: /api/forms/{form.slug}</p>
            </div>
            <label className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold focus-within:ring-2 focus-within:ring-emerald-600">
              <input type="checkbox" checked={form.enabled} onChange={(event) => updateForm(form.id, (current) => ({ ...current, enabled: event.target.checked }))} className="size-4 accent-emerald-700" />
              Formulario activo
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(['es', 'en'] as const).map((locale) => (
              <div key={locale} className="space-y-4">
                <h3 className="text-sm font-semibold">{locale === 'es' ? 'Textos en español' : 'Textos en inglés'}</h3>
                <label className="block space-y-2 text-sm font-semibold">
                  <span>Título</span>
                  <input value={formText(form.title, locale)} onChange={(event) => updateForm(form.id, (current) => ({ ...current, title: { ...current.title, [locale]: event.target.value } }))} maxLength={120} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818]" />
                </label>
                <label className="block space-y-2 text-sm font-semibold">
                  <span>Descripción</span>
                  <textarea value={formText(form.description, locale)} onChange={(event) => updateForm(form.id, (current) => ({ ...current, description: { ...current.description, [locale]: event.target.value } }))} maxLength={600} rows={3} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818]" />
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Campos</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Los campos básicos de nombre, correo y mensaje son obligatorios.</p>
              </div>
              <button type="button" onClick={() => addField(form.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">Añadir campo</button>
            </div>

            <div className="space-y-3">
              {form.fields.map((field) => (
                <article key={field.key} className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 dark:border-[#313131] md:grid-cols-[minmax(0,1fr)_10rem_auto] md:items-start">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {(['es', 'en'] as const).map((locale) => (
                      <label key={locale} className="block space-y-2 text-sm font-semibold">
                        <span>{locale === 'es' ? 'Etiqueta en español' : 'Etiqueta en inglés'}</span>
                        <input value={formText(field.label, locale)} onChange={(event) => updateField(form.id, field.key, (current) => ({ ...current, label: { ...current.label, [locale]: event.target.value } }))} maxLength={120} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818]" />
                      </label>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <label className="block space-y-2 text-sm font-semibold">
                      <span>Tipo</span>
                      <select value={field.type} onChange={(event) => updateField(form.id, field.key, (current) => {
                        const type = event.target.value as ContactFormField['type'];
                        return {
                          ...current,
                          type,
                          options: type === 'select'
                            ? current.options?.length ? current.options : [{ value: 'option_1', label: { es: 'Opción 1', en: 'Option 1' } }]
                            : current.options,
                        };
                      })} disabled={Boolean(field.system)} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-60 dark:border-[#313131] dark:bg-[#181818]">
                        <option value="text">Texto</option>
                        <option value="email">Correo</option>
                        <option value="textarea">Mensaje largo</option>
                        <option value="select">Lista</option>
                        <option value="checkbox">Confirmación</option>
                      </select>
                    </label>
                    {field.type === 'select' && (
                      <label className="block space-y-2 text-sm font-semibold">
                        <span>Opciones</span>
                        <textarea
                          value={optionLines(field.options)}
                          onChange={(event) => updateField(form.id, field.key, (current) => ({ ...current, options: parseOptionLines(event.target.value) }))}
                          rows={4}
                          aria-describedby={`options-help-${field.key}`}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818]"
                        />
                        <span id={`options-help-${field.key}`} className="block text-xs font-normal text-slate-600 dark:text-slate-300">Una opción por línea: valor | español | inglés.</span>
                      </label>
                    )}
                    <label className="flex items-center gap-2 rounded-lg py-1 text-sm font-semibold focus-within:ring-2 focus-within:ring-emerald-600">
                      <input type="checkbox" checked={field.required} onChange={(event) => updateField(form.id, field.key, (current) => ({ ...current, required: event.target.checked }))} disabled={Boolean(field.system && ['name', 'email', 'message'].includes(field.system))} className="size-4 accent-emerald-700" />
                      Obligatorio
                    </label>
                  </div>
                  {field.system ? (
                    <span className="text-xs text-slate-600 dark:text-slate-300">Campo esencial</span>
                  ) : (
                    <button type="button" onClick={() => removeField(form.id, field.key)} className="min-h-12 rounded-lg px-3 py-2 text-sm font-semibold text-red-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 dark:text-red-200 dark:hover:bg-[#272727]">Quitar campo</button>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 dark:border-[#313131] sm:grid-cols-2">
            <label className="block space-y-2 text-sm font-semibold">
              <span>Correo para las consultas</span>
              <input type="email" value={form.notification_settings?.defaultTo || ''} onChange={(event) => updateForm(form.id, (current) => ({ ...current, notification_settings: { ...current.notification_settings, defaultTo: event.target.value } }))} placeholder="equipo@curileta.com" maxLength={320} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818]" />
              <span className="block text-xs font-normal text-slate-600 dark:text-slate-300">Si queda vacío, se usa la dirección configurada en Vercel.</span>
            </label>
          </div>

          {form.fields.find((field) => field.system === 'category')?.options?.length ? (
            <fieldset className="space-y-4 border-t border-slate-200 pt-6 dark:border-[#313131]">
              <legend className="text-base font-bold">Destinatarios por categoría</legend>
              <p className="text-pretty text-sm leading-5 text-slate-600 dark:text-slate-300">Si dejas una categoría vacía, el mensaje se envía al correo general del formulario.</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {form.fields.find((field) => field.system === 'category')?.options?.map((option) => (
                  <label key={option.value} className="block space-y-2 text-sm font-semibold">
                    <span>{formText(option.label, 'es')}</span>
                    <input
                      type="email"
                      value={form.notification_settings?.categoryRecipients?.[option.value] || ''}
                      onChange={(event) => updateCategoryRecipient(form.id, option.value, event.target.value)}
                      maxLength={320}
                      className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818]"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="flex justify-end border-t border-slate-200 pt-6 dark:border-[#313131]">
            <button type="button" onClick={() => saveForm(form)} disabled={saving} className="min-h-12 rounded-lg bg-emerald-800 px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1f1f1f]">{saving ? 'Guardando…' : 'Guardar formulario'}</button>
          </div>
        </section>
      )) : (
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-[#313131] dark:bg-[#1f1f1f]">
          <h2 className="text-xl font-bold">Todavía no hay formularios</h2>
          <p className="text-pretty mx-auto mt-2 max-w-md text-sm leading-5 text-slate-600 dark:text-slate-300">Aplica la migración inicial de Supabase para crear el formulario de contacto.</p>
        </section>
      )}
    </div>
  );
}
