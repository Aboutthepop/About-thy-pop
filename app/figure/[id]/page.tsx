'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RETAILERS, VARIANTS, SIZES, PRODUCT_TYPES, POP_LINES, CON_TYPES, LE_TIERS } from '@/lib/types';
import type { Figure } from '@/lib/types';

const emptyForm = {
  name: '',
  series: '',
  retailer: 'N/A',
  con_type: '',
  pop_line: '',
  release_date: '',
  image_url: '',
  image_url_2: '',
  reference_number: '',
  related: '',
  sku: '',
  variant: 'N/A',
  size: 'Standard [4"]',
  product_type: '',
  le_tier: '',
  le_amount: '',
  notes: '',
  status: 'owned' as const,
};

export default function FigureFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploading2, setUploading2] = useState(false);
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
          con_type: data.con_type ?? '',
          pop_line: data.pop_line ?? '',
          release_date: data.release_date ?? '',
          image_url: data.image_url ?? '',
          image_url_2: data.image_url_2 ?? '',
          reference_number: data.reference_number ?? '',
          related: data.related ?? '',
          sku: data.sku ?? '',
          variant: data.variant ?? 'N/A',
          size: data.size ?? 'Standard [4"]',
          product_type: data.product_type ?? '',
          le_tier: data.le_tier ?? '',
          le_amount: data.le_amount ?? '',
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

  async function handleFileChange2(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading2(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading2(false);
    if (data.url) setForm((f) => ({ ...f, image_url_2: data.url }));
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
  const labelCls = "text-[10px] uppercase tracking-wide block mb-1 font-mono text-muted";

  return (
    <div className="min-h-screen bg-vault px-4 py-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <h1 className="font-displayCard text-card text-lg mb-5">{isNew ? 'ADD FIGURE' : 'EDIT FIGURE'}</h1>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Related</label>
            <input
              value={form.related}
              onChange={(e) => setForm({ ...form, related: e.target.value })}
              placeholder="e.g. actor, athlete, musician name"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Pop Line</label>
            <select
              value={form.pop_line}
              onChange={(e) => setForm({ ...form, pop_line: e.target.value })}
              className={inputCls}
            >
              <option value="">Select a line</option>
              {POP_LINES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Series / Line</label>
            <input
              value={form.series}
              onChange={(e) => setForm({ ...form, series: e.target.value })}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Exclusive Retailer</label>
              <select
                value={form.retailer}
                onChange={(e) => setForm({ ...form, retailer: e.target.value })}
                className={inputCls}
              >
                {RETAILERS.map((r) => (
                  <option key={r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Release Date</label>
              <input
                type="date"
                value={form.release_date}
                onChange={(e) => setForm({ ...form, release_date: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          {form.retailer === 'Con Exclusive' && (
            <div>
              <label className={labelCls}>Which Con</label>
              <select
                value={form.con_type}
                onChange={(e) => setForm({ ...form, con_type: e.target.value })}
                className={inputCls}
              >
                <option value="">Select a con</option>
                {CON_TYPES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Variant</label>
              <select
                value={form.variant}
                onChange={(e) => setForm({ ...form, variant: e.target.value })}
                className={inputCls}
              >
                {VARIANTS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Size</label>
              <select
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className={inputCls}
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Product Type</label>
            <select
              value={form.product_type}
              onChange={(e) => setForm({ ...form, product_type: e.target.value })}
              className={inputCls}
            >
              {PRODUCT_TYPES.map((p) => (
                <option key={p} value={p}>{p === '' ? 'Standard Pop!' : p}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Limited Edition</label>
              <select
                value={form.le_tier}
                onChange={(e) => setForm({ ...form, le_tier: e.target.value })}
                className={inputCls}
              >
                <option value="">None</option>
                {LE_TIERS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {form.le_tier && (
              <div>
                <label className={labelCls}>LE Amount</label>
                <input
                  value={form.le_amount}
                  onChange={(e) => setForm({ ...form, le_amount: e.target.value })}
                  placeholder="e.g. 1 of 2500"
                  className={inputCls}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Reference #</label>
              <input
                value={form.reference_number}
                onChange={(e) => setForm({ ...form, reference_number: e.target.value })}
                placeholder="e.g. 1353"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>SKU</label>
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="Your inventory SKU"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Photo</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-muted font-mono"
              />
              {uploading && <span className="text-xs text-muted font-mono">Uploading...</span>}
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="w-24 h-24 object-contain" />
              )}
            </div>
          </div>

          <div>
            <label className={labelCls}>Second Photo (optional)</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange2}
                className="text-xs text-muted font-mono"
              />
              {uploading2 && <span className="text-xs text-muted font-mono">Uploading...</span>}
              {form.image_url_2 && (
                <img src={form.image_url_2} alt="Preview 2" className="w-24 h-24 object-contain" />
              )}
            </div>
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Condition, box status, quantity..."
              style={{ minHeight: '70px' }}
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex-1 py-2.5 rounded-sm font-bold text-sm font-mono bg-panel text-card border border-line"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-sm font-bold text-sm font-mono bg-accent text-white disabled:opacity-60"
          >
            {saving ? 'SAVING...' : isNew ? 'ADD TO CATALOG' : 'SAVE CHANGES'}
          </button>
        </div>
      </form>
    </div>
  );
}
