'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Loader2, Menu, Plus, Search, Sparkles, Store, X } from 'lucide-react';
import PopCard from '@/components/PopCard';
import { RETAILERS, POP_LINES } from '@/lib/types';
import type { Figure } from '@/lib/types';

type SortKey = 'date-desc' | 'date-asc' | 'ref-desc' | 'ref-asc' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date-desc', label: 'Newest Release' },
  { key: 'date-asc', label: 'Oldest Release' },
  { key: 'ref-desc', label: 'Reference # High to Low' },
  { key: 'ref-asc', label: 'Reference # Low to High' },
  { key: 'name-asc', label: 'A-Z' },
  { key: 'name-desc', label: 'Z-A' },
];

export default function HomePage() {
  const [items, setItems] = useState<Figure[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [retailerFilter, setRetailerFilter] = useState('All');
  const [characterFilter, setCharacterFilter] = useState<string | null>(null);
  const [popLineFilter, setPopLineFilter] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('name-asc');

  useEffect(() => {
    fetch('/api/figures')
      .then((r) => r.json())
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = items.filter((i) => {
      const matchesRetailer = retailerFilter === 'All' || i.retailer === retailerFilter;
      const matchesCharacter = characterFilter === null || (i.character || i.name) === characterFilter;
      const matchesPopLine = popLineFilter === null || i.pop_line === popLineFilter;
      const seriesLower = (i.series ?? '').toLowerCase();
      const matchesQuery =
        i.name.toLowerCase().includes(query.toLowerCase()) || seriesLower.includes(query.toLowerCase());
      return matchesRetailer && matchesCharacter && matchesPopLine && matchesQuery;
    });
    list.sort((a, b) => {
      if (sortBy === 'date-desc') return (b.release_date ?? '').localeCompare(a.release_date ?? '');
      if (sortBy === 'date-asc') return (a.release_date ?? '').localeCompare(b.release_date ?? '');
      if (sortBy === 'ref-desc') return (parseInt(b.reference_number || '0') || 0) - (parseInt(a.reference_number || '0') || 0);
      if (sortBy === 'ref-asc') return (parseInt(a.reference_number || '0') || 0) - (parseInt(b.reference_number || '0') || 0);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [items, query, retailerFilter, characterFilter, popLineFilter, sortBy]);

  const droppingSoon = useMemo(() => {
    const now = new Date();
    const in60 = new Date();
    in60.setDate(now.getDate() + 60);
    return items
      .filter((i) => i.release_date && new Date(i.release_date) > now && new Date(i.release_date) <= in60)
      .sort((a, b) => (a.release_date ?? '').localeCompare(b.release_date ?? ''));
  }, [items]);

  const usedRetailers = useMemo(() => {
    const set = new Set(items.map((i) => i.retailer));
    return ['All', ...RETAILERS.filter((r) => set.has(r.name)).map((r) => r.name)];
  }, [items]);

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch('/api/figures/' + id, { method: 'DELETE' });
  }

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sortBy)?.label ?? 'Sort';

  return (
    <div className="min-h-screen w-full bg-vault">
      <div
        className="absolute inset-x-0 top-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(238,56,49,0.10), transparent)' }}
      />

      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-64 bg-panel border-r border-line p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-displayCard text-card text-sm">POP LINES</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={18} className="text-muted" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setPopLineFilter(null);
                  setMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-sm text-sm font-mono text-card hover:bg-vault"
                style={{ background: popLineFilter === null ? 'rgba(238,56,49,0.15)' : 'transparent' }}
              >
                All Pop Lines
              </button>
              {POP_LINES.map((line) => (
                <button
                  key={line}
                  onClick={() => {
                    setPopLineFilter(line);
                    setMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-sm text-sm font-mono text-card hover:bg-vault"
                  style={{ background: popLineFilter === line ? 'rgba(238,56,49,0.15)' : 'transparent' }}
                >
                  {line}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-sm bg-panel border border-line text-card"
              aria-label="Open pop lines menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-accent">
                <Sparkles size={16} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono">Collector's Catalog</span>
              </div>
              <h1 className="text-3xl md:text-4xl mt-1 font-display text-card tracking-wide">ABOUT THY POP</h1>
            </div>
          </div>
          <a
            href="/figure/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-bold font-mono bg-accent text-white"
          >
            <Plus size={16} /> ADD FIGURE
          </a>
        </div>

        <div className="text-xs mb-6 font-mono text-muted">
          {items.length} figure{items.length !== 1 ? 's' : ''} in the catalog
        </div>

        {(characterFilter || popLineFilter) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wide font-mono text-muted">Showing:</span>
            {popLineFilter && (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono bg-panel border border-line text-card">
                {popLineFilter}
                <button onClick={() => setPopLineFilter(null)} aria-label="Clear pop line filter">
                  <X size={14} />
                </button>
              </span>
            )}
            {characterFilter && (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono bg-panel border border-line text-card">
                {characterFilter}
                <button onClick={() => setCharacterFilter(null)} aria-label="Clear character filter">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {droppingSoon.length > 0 && (
          <div className="mb-8 -mx-4 px-4 py-3 overflow-x-auto border-y border-line" style={{ background: 'linear-gradient(90deg, rgba(238,56,49,0.08), transparent)' }}>
            <div className="text-[10px] uppercase tracking-[0.15em] mb-2 font-mono text-accent">
              Dropping Soon (60 days)
            </div>
            <div className="flex gap-3">
              {droppingSoon.map((i) => (
                <div key={i.id} className="flex-shrink-0 flex items-center gap-2 pr-3 border-r border-line">
                  <div className="text-[11px] truncate max-w-[140px] text-card font-semibold">{i.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or series..."
              className="w-full pl-9 pr-3 py-2 rounded-sm text-sm outline-none bg-panel text-card border border-line"
            />
          </div>
          <div className="relative">
            <Store size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
            <select
              value={retailerFilter}
              onChange={(e) => setRetailerFilter(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-sm text-sm outline-none appearance-none bg-panel text-card border border-line"
            >
              {usedRetailers.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm bg-panel text-card border border-line"
            >
              {currentSortLabel}
              <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 mt-1 w-52 bg-panel border border-line rounded-sm z-50 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortBy(opt.key);
                        setSortOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm font-mono text-card hover:bg-vault"
                      style={{ background: sortBy === opt.key ? 'rgba(238,56,49,0.15)' : 'transparent' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading catalog...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 rounded-lg border border-dashed border-line">
            <div className="font-displayCard text-card text-base mb-2">
              {items.length === 0 ? "Shelf's empty." : 'No figures match.'}
            </div>
            <div className="text-sm mb-5 text-muted">
              {items.length === 0 ? 'Add your first figure to start the collection.' : 'Try a different search or filter.'}
            </div>
            {items.length === 0 && (
              <a href="/figure/new" className="px-4 py-2 rounded-sm text-sm font-bold font-mono bg-accent text-white">
                + Add Figure
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <PopCard
                key={item.id}
                item={item}
                onEdit={(i) => (window.location.href = '/figure/' + i.id)}
                onDelete={handleDelete}
                onCharacterClick={(c) => setCharacterFilter(c)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
