import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'La revalidación no está configurada.' }, { status: 503 });
  }
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > 32_000) {
    return NextResponse.json({ message: 'El cuerpo supera el tamaño permitido.' }, { status: 413 });
  }

  const rawBody = await request.text();
  if (rawBody.length > 32_000) {
    return NextResponse.json({ message: 'El cuerpo supera el tamaño permitido.' }, { status: 413 });
  }
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature || !(await isValidSignature(rawBody, signature, secret))) {
    return NextResponse.json({ message: 'Firma no válida.' }, { status: 401 });
  }

  let payload: { _type?: string; contentType?: string };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ message: 'El cuerpo debe ser JSON válido.' }, { status: 400 });
  }

  const tags = new Set<string>(['sanity:siteSettings']);
  if (payload._type === 'contentEntry' && payload.contentType) {
    tags.add(`sanity:${payload.contentType}`);
  } else if (payload._type === 'siteSettings') {
    tags.add('sanity:siteSettings');
  } else {
    return NextResponse.json({ message: 'Tipo de contenido no reconocido.' }, { status: 400 });
  }

  tags.forEach((tag) => revalidateTag(tag));
  revalidatePath('/', 'layout');

  return NextResponse.json({ revalidated: true, tags: [...tags] });
}
