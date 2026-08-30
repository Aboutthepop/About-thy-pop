import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Accepts a multipart/form-data POST with a single "file" field.
// Uploads to the "figure-images" bucket and returns a public URL.
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const db = supabaseAdmin();
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await db.storage
    .from('figure-images')
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = db.storage.from('figure-images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
