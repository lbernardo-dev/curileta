import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { findAuthUserByEmail, isAdminRole, listAdminTeam, setAdminProfileRole } from '@/lib/admin-team.server';

const MAX_BODY_LENGTH = 12_000;

export async function GET() {
  await requireAdmin(['owner']);
  try {
    const team = await listAdminTeam();
    return NextResponse.json({ team }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo consultar el equipo en Supabase.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const actor = await requireAdmin(['owner']);
  const body = await readBody(request);
  const email = readText(body?.email, 320);
  const displayName = readText(body?.displayName, 120);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !displayName || !isAdminRole(body?.role)) {
    return NextResponse.json({ error: 'Indica un correo de una cuenta existente, un nombre y un rol válido.' }, { status: 400 });
  }
  try {
    const user = await findAuthUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'No existe esa cuenta en Supabase Auth. Esta acción no envía invitaciones.' }, { status: 404 });
    await setAdminProfileRole({ actorUserId: actor.userId, targetUserId: user.id, role: body.role, displayName });
    return NextResponse.json({ success: true });
  } catch (error) {
    return roleChangeError(error);
  }
}

export async function PATCH(request: Request) {
  const actor = await requireAdmin(['owner']);
  const body = await readBody(request);
  const userId = readText(body?.userId, 80);
  const displayName = readText(body?.displayName, 120);
  if (!userId || !displayName || !isAdminRole(body?.role)) {
    return NextResponse.json({ error: 'Selecciona un perfil, un nombre y un rol válido.' }, { status: 400 });
  }
  try {
    await setAdminProfileRole({ actorUserId: actor.userId, targetUserId: userId, role: body.role, displayName });
    return NextResponse.json({ success: true });
  } catch (error) {
    return roleChangeError(error);
  }
}

export async function DELETE(request: Request) {
  const actor = await requireAdmin(['owner']);
  const body = await readBody(request);
  const userId = readText(body?.userId, 80);
  if (!userId) return NextResponse.json({ error: 'Selecciona un perfil válido.' }, { status: 400 });
  try {
    await setAdminProfileRole({ actorUserId: actor.userId, targetUserId: userId, role: null, displayName: 'Acceso revocado' });
    return NextResponse.json({ success: true });
  } catch (error) {
    return roleChangeError(error);
  }
}

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_BODY_LENGTH) return null;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_LENGTH) return null;
    const value = JSON.parse(raw) as unknown;
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function readText(value: unknown, maxLength: number) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength ? value.trim() : null;
}

function roleChangeError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('Debe permanecer') || message.includes('Solo la persona propietaria') || message.includes('no tiene acceso')) {
    return NextResponse.json({ error: message }, { status: 409 });
  }
  return NextResponse.json({ error: 'No se pudo actualizar el equipo. Revisa la migración de administración.' }, { status: 503 });
}
