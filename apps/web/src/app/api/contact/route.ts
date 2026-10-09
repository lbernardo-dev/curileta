import { NextRequest, NextResponse } from 'next/server';

interface ContactRequestBody {
  name: string;
  email: string;
  company?: string;
  category: string;
  message: string;
  adultConsent: boolean;
  privacyConsent: boolean;
  honeypot?: string;
}

const DEPARTMENT_ROUTING: Record<string, string> = {
  editorial: 'editorial@curileta.com',
  licensing: 'licencias@curileta.com',
  press: 'prensa@curileta.com',
  education: 'educacion@curileta.com',
  events: 'eventos@curileta.com',
  general: 'hola@curileta.com',
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequestBody = await request.json();

    // 1. Verificación Honeypot (Detección de bots automatizados)
    if (body.honeypot && body.honeypot.trim() !== '') {
      // Rechazo silencioso sin alertar al bot
      return NextResponse.json({ success: true, message: 'Message received' }, { status: 200 });
    }

    // 2. Validación de campos obligatorios
    if (!body.name || !body.email || !body.message || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios requeridos.' },
        { status: 400 }
      );
    }

    // 3. Validación de formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'La dirección de correo electrónico no es válida.' },
        { status: 400 }
      );
    }

    // 4. Cumplimiento de Mayoría de Edad (Protección de Menores COPPA / RGPD-K)
    if (!body.adultConsent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debe confirmar expresamente que es mayor de edad (18 años o más).',
        },
        { status: 403 }
      );
    }

    if (!body.privacyConsent) {
      return NextResponse.json(
        { success: false, error: 'Debe aceptar la política de privacidad y tratamiento de datos.' },
        { status: 400 }
      );
    }

    // 5. Enrutamiento inteligente según categoría
    const targetDepartmentEmail =
      DEPARTMENT_ROUTING[body.category] || DEPARTMENT_ROUTING.general;

    // Log estructurado sin exponer contenido sensible en producción
    console.log(`[Contact API] Mensaje enrutado a ${targetDepartmentEmail} | Categoría: ${body.category}`);

    return NextResponse.json(
      {
        success: true,
        category: body.category,
        receivedAt: new Date().toISOString(),
        message: 'Tu solicitud ha sido recibida y enrutada al equipo responsable.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud', details: errorMsg },
      { status: 500 }
    );
  }
}
