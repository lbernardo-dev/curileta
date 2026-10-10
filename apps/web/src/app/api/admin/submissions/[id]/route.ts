import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const allowedStatuses = ['new', 'in_progress', 'resolved', 'archived'];
const allowedLeadStages = ['new', 'contacted', 'qualified', 'won', 'lost'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin(['owner', 'admin']);
  const { id } = await params;
  let body: { status?: unknown; leadStage?: unknown; leadNotes?: unknown; reviewLead?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'La solicitud no tiene un formato válido.' }, { status: 400 });
  }

  const update: Record<string, string | null> = {};
  if (body.status !== undefined) {
    if (typeof body.status !== 'string' || !allowedStatuses.includes(body.status)) {
      return NextResponse.json({ success: false, error: 'El estado elegido no es válido.' }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body.leadStage !== undefined) {
    if (body.leadStage !== null && (typeof body.leadStage !== 'string' || !allowedLeadStages.includes(body.leadStage))) {
      return NextResponse.json({ success: false, error: 'La fase del lead no es válida.' }, { status: 400 });
    }
    update.lead_stage = body.leadStage as string | null;
  }
  if (body.leadNotes !== undefined) {
    if (typeof body.leadNotes !== 'string' || body.leadNotes.length > 4000) {
      return NextResponse.json({ success: false, error: 'Las notas deben tener como máximo 4.000 caracteres.' }, { status: 400 });
    }
    update.lead_notes = body.leadNotes;
  }
  if (body.reviewLead !== undefined) {
    if (body.reviewLead !== true) {
      return NextResponse.json({ success: false, error: 'La revisión de conservación no es válida.' }, { status: 400 });
    }
    update.lead_last_activity_at = new Date().toISOString();
    update.lead_deletion_scheduled_at = null;
    update.lead_retention_notified_at = null;
  }
  if (!Object.keys(update).length) {
    return NextResponse.json({ success: false, error: 'No hay cambios para guardar.' }, { status: 400 });
  }
  update.updated_at = new Date().toISOString();

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .update(update)
      .eq('id', id)
      .select('id, status, lead_stage, lead_notes, resolved_at, lead_last_activity_at, lead_deletion_scheduled_at, lead_retention_notified_at')
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
