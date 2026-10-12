import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { listManagedLetters, saveManagedLetter } from '@/lib/letters-admin.server';
import { normalizeLetter } from '@/lib/letters.validation';

export async function GET(request: NextRequest) {
  await requireAdmin(['owner', 'admin', 'editor']);
  try {
    const letters = await listManagedLetters(request.nextUrl.searchParams.get('includeDeleted') === 'true');
    return NextResponse.json({ letters }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'No se pudieron cargar las cartas de Supabase. Revisa la configuración y las migraciones del panel.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: 'La carta no tiene un formato válido.' }, { status: 400 });
  }
  if (raw.length > 400_000) return NextResponse.json({ error: 'La carta supera el tamaño permitido.' }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw) as unknown;
  } catch {
    return NextResponse.json({ error: 'La carta no tiene un formato válido.' }, { status: 400 });
  }
  const letter = normalizeLetter(body);
  if (!letter) return NextResponse.json({ error: 'Revisa los campos requeridos, el estado, el enlace de YouTube y las fotos.' }, { status: 400 });

  try {
    await saveManagedLetter(letter, identity.userId);
    revalidateLetters();
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const status = message.includes('Ya existe') ? 409 : 503;
    return NextResponse.json({ error: message.includes('Ya existe') ? message : 'No se pudo guardar la carta en Supabase.' }, { status });
  }
}

function revalidateLetters() {
  revalidateTag('cms:letter', 'max');
  revalidatePath('/[locale]', 'page');
}
