import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { data, error } = await db.from('figures').select('*').eq('id', params.id).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = supabaseAdmin();

  const { data, error } = await db
    .from('figures')
    .update({
      name: body.name,
      series: body.series,
      retailer: body.retailer,
      con_type: body.con_type || null,
      pop_line: body.pop_line || null,
      release_date: body.release_date || null,
      image_url: body.image_url || null,
      image_url_2: body.image_url_2 || null,
      reference_number: body.reference_number || null,
      related: body.related || null,
      sku: body.sku || null,
      variant: body.variant || null,
      size: body.size || null,
      product_type: body.product_type || null,
      le_tier: body.le_tier || null,
      le_amount: body.le_amount || null,
      notes: body.notes,
      status: body.status,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return
