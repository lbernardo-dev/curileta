import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { removeSiteMediaAsset } from '@/lib/site-media.server';
import { deleteManagedLetter, listManagedLetters, restoreManagedLetter, saveManagedLetter } from '@/lib/letters-admin.server';
import { isValidLetterId, normalizeLetter } from '@/lib/letters.validation';
import { requireAdmin } from '@/lib/supabase/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!isValidLetterId(id)) return NextResponse.json({ error: 'Selecciona una carta válida.' }, { status: 400 });

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 400_000) return NextResponse.json({ error: 'La carta supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as unknown;
  } catch {
    return NextResponse.json({ error: 'La carta no tiene un formato válido.' }, { status: 400 });
  }
  const letter = normalizeLetter(body);
  if (!letter) return NextResponse.json({ error: 'Revisa los campos de la carta.' }, { status: 400 });

  try {
    const previous = (await listManagedLetters()).find((item) => item.id === id);
    if (!previous) return NextResponse.json({ error: 'La carta ya no existe. Actualiza la lista.' }, { status: 404 });
    await saveManagedLetter(letter, identity.userId, id);
    const retainedPaths = new Set(letter.photos
      .flatMap((photo) => [photo.storagePath, photo.censoredStoragePath])
      .filter((path): path is string => Boolean(path)));
    await Promise.all((previous.photos || [])
      .flatMap((photo) => [photo.storagePath, photo.censoredStoragePath])
      .filter((path): path is string => typeof path === 'string' && path.length > 0 && !retainedPaths.has(path))
      .map((path) => removeSiteMediaAsset(path, 'letters/photos').catch(() => false)));
    revalidateLetters();
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const status = message.includes('no existe') ? 404 : message.includes('Ya existe') ? 409 : 503;
    return NextResponse.json({ error: message.includes('no existe') || message.includes('Ya existe') ? message : 'No se pudo guardar la carta en Supabase.' }, { status });
  }
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!isValidLetterId(id)) return NextResponse.json({ error: 'Selecciona una carta válida.' }, { status: 400 });
  try {
    if (!(await restoreManagedLetter(id, identity.userId))) return NextResponse.json({ error: 'La carta ya no existe.' }, { status: 404 });
    revalidateLetters();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo recuperar la carta de Supabase.' }, { status: 503 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!isValidLetterId(id)) return NextResponse.json({ error: 'Selecciona una carta válida.' }, { status: 400 });
  try {
    const previous = (await listManagedLetters()).find((item) => item.id === id);
    if (!previous || !(await deleteManagedLetter(id, identity.userId))) return NextResponse.json({ error: 'La carta ya no existe.' }, { status: 404 });
    revalidateLetters();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo eliminar la carta de Supabase.' }, { status: 503 });
  }
}

function revalidateLetters() {
  revalidateTag('cms:letter', 'max');
  revalidatePath('/[locale]', 'page');
}
