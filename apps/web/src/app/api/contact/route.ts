import { NextRequest, NextResponse } from 'next/server';

interface ContactRequestBody {
  name?: string;
  email?: string;
  company?: string;
  category?: string;
  message?: string;
  adultConsent?: boolean;
  privacyConsent?: boolean;
  honeypot?: string;
}

const CATEGORIES: Record<string, string> = {
  editorial: 'Editorial',
  licensing: 'Licencias y colaboraciones',
  press: 'Prensa y comunicación',
  education: 'Educación',
  events: 'Eventos',
  general: 'Consulta general',
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

export async function POST(request: NextRequest) {
  let body: ContactRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'La solicitud no tiene un formato válido.' }, { status: 400 });
  }

  // Bots receive a neutral response, but no message is sent.
  if (typeof body.honeypot === 'string' && body.honeypot.trim()) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 320) : '';
  const company = typeof body.company === 'string' ? body.company.trim().slice(0, 160) : '';
  const category = typeof body.category === 'string' && CATEGORIES[body.category] ? body.category : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 10000) : '';

  if (!name || !email || !message || !category) {
    return NextResponse.json({ success: false, error: 'Revisa los campos obligatorios del formulario.' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'La dirección de correo no es válida.' }, { status: 400 });
  }

  if (!body.adultConsent) {
    return NextResponse.json({ success: false, error: 'Este formulario está reservado a personas adultas.' }, { status: 403 });
  }

  if (!body.privacyConsent) {
    return NextResponse.json({ success: false, error: 'Debes aceptar la política de privacidad para continuar.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { success: false, error: 'El formulario todavía no está conectado al servicio de correo.' },
      { status: 503 }
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || '—');
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const categoryLabel = CATEGORIES[category];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Curileta · ${categoryLabel}] ${name}`,
        text: `Nombre: ${name}\nCorreo: ${email}\nOrganización: ${company || '—'}\nCategoría: ${categoryLabel}\n\n${message}`,
        html: `<h2>Nueva consulta de Curileta</h2><p><strong>Nombre:</strong> ${safeName}</p><p><strong>Correo:</strong> ${safeEmail}</p><p><strong>Organización:</strong> ${safeCompany}</p><p><strong>Categoría:</strong> ${escapeHtml(categoryLabel)}</p><hr><p>${safeMessage}</p>`,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'No se pudo entregar el mensaje. Inténtalo de nuevo más tarde.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, receivedAt: new Date().toISOString() }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'No se pudo conectar con el servicio de correo. Inténtalo de nuevo más tarde.' },
      { status: 502 }
    );
  }
}
