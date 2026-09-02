import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('figures')
    .select('*')
    .order('release_date', { ascending: false, nullsFirst: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = supabaseAdmin();

  const { data, error } = await db
    .from('figures')
    .insert({
      name: body.name,
      series: body.series ?? '',
      retailer: body.retailer ?? 'General Release',
      con_type: body.con_type || null,
      pop_line: body.pop_line || null,
      release_date: body.release_date || null,
      image_url: body.image_url || null,
      reference_number: body.reference_number || null,
      character: body.character || null,
      sku: body.sku || null,
      variant: body.variant || null,
      size: body.size || null,
      product_type: body.product_type || null,
      notes: body.notes || null,
      status: body.status ?? 'owned',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
