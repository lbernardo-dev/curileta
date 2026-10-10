import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const allowedStatuses = ['new', 'in_progress', 'resolved', 'archived'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin(['owner', 'admin']);
  const { id } = await params;
  let body: { status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'La solicitud no tiene un formato válido.' }, { status: 400 });
  }

  if (typeof body.status !== 'string' || !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ success: false, error: 'El estado elegido no es válido.' }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, status')
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo actualizar el estado.' }, { status: 503 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin(['owner', 'admin']);
  const { id } = await params;

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: 'No se encontró el mensaje.' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo eliminar el mensaje.' }, { status: 503 });
  }
}
