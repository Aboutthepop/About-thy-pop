'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RETAILERS } from '@/lib/types';
import type { Figure } from '@/lib/types';

const emptyForm = {
  name: '',
  series: '',
  retailer: 'General Release',
  release_date: '',
  image_url: '',
  reference_number: '',
  character: '',
  notes: '',
  status: 'owned' as const,
};

export default function FigureFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    fetch('/api/figures/' + params.id)
      .then((r) => r.json())
      .then((data: Figure) =>
        setForm({
          name: data.name,
          series: data.series ?? '',
          retailer: data.retailer,
          release_date: data.release_date ?? '',
          image_url: data.image_url ?? '',
          reference_number: data.reference_number ?? '',
          character: data.character ?? '',
          notes: data.notes ?? '',
          status: (data.status ?? 'owned') as any,
        })
      );
  }, [isNew, params.id]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm((f) => ({ ...f, image_url: data.url }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const method = isNew ? 'POST' : 'PATCH';
    const url = isNew ? '/api/figures' : '/api/figures/' + params.id;
    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.push('/');
  }

  const inputCls = "w-full rounded-sm px-3 py-2 text-sm outline-none bg-panel text-card border border-line font-body";

  return (
    <div className="min-h-screen bg-vault px-4 py-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <h1 className="font-display text-card text-lg mb-5">{isNew ? 'ADD FIGURE' : 'EDIT FIGURE'}</h1>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted">Name *</label>
            <input
              required
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Spider-Man (Zero Suit)"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted">Character</label>
            <input
              className={inputCls}
              value={form.character}
              onChange={(e) => setForm({ ...form, character: e.target.value })}
              placeholder="e.g. Roy Kent (groups variants together)"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted">Series / Line</label>
            <input
              className={inputCls}
              value={form.series}
              onChange={(e) => setForm({ ...form, series: e.target.value })}
              placeholder="e.g. Marvel, POP Animation"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted">Exclusive Retailer</label>
              <select
                className={inputCls}
                value={form.retailer}
                onChange={(e) => setForm({ ...form, retailer: e.target.value })}
              >
                {RETAILERS.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted">Release Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.release_date}
                onChange={(e) => setForm({ ...form, release_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted">Reference #</label>
            <input
              className={inputCls}
              value={form.reference_number}
              onChange={(e) => setForm({ ...form, reference_number: e.target.value })}
              placeholder="e.g. 1353"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted">Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-card" />
            {uploading && <div className="text-xs text-muted mt-1">Uploading...</div>}
            {form.image_url && (
              <img src={form.image_url} alt="preview" className="mt-2 w-24 h-24 object-contain bg-cardWindow rounded-sm" />
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted">Notes</label>
            <textarea
              className={inputCls}
              style={{ minHeight: '70px' }}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Condition, box status, quantity..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full mt-5 py-2.5 rounded-sm font-bold text-sm font-mono bg-accent text-white disabled:opacity-60"
        >
          {saving ? 'SAVING...' : isNew ? 'ADD TO CATALOG' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}
