'use client';

import Image from 'next/image';
import { Calendar, ImageOff, Pencil, Trash2 } from 'lucide-react';
import type { Figure } from '@/lib/types';

export default function PopCard({
  item,
  onEdit,
  onDelete,
  onCharacterClick,
}: {
  item: Figure;
  onEdit: (item: Figure) => void;
  onDelete: (id: string) => void;
  onCharacterClick: (character: string) => void;
}) {
  const dropSoon = item.release_date && new Date(item.release_date) > new Date();
  const characterName = item.character || item.name;
  const showRetailer = item.retailer && item.retailer !== 'General Release';
  const retailerLabel =
    item.retailer === 'Con Exclusive' && item.con_type
      ? 'Con Exclusive (' + item.con_type + ')'
      : item.retailer;

  return (
    <div className="relative rounded-lg overflow-visible group bg-card">
      <button
        onClick={() => onCharacterClick(characterName)}
        className="block w-full text-left"
      >
        <div className="relative m-2 mb-0 aspect-square rounded-sm overflow-hidden flex items-center justify-center bg-cardWindow">
          {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map(
            (pos, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 ${pos} pointer-events-none`}
                style={{ borderColor: '#1B1D22', margin: '4px', opacity: 0.55 }}
              />
            )
          )}
          {item.image_url ? (
            <Image src={item.image_url} alt={item.name} fill className="object-contain" unoptimized />
          ) : (
            <div className="flex w-full h-full items-center justify-center text-[#9A9488]">
              <ImageOff size={28} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="px-3 pt-2 pb-3">
          <div className="text-[13px] leading-tight truncate font-displayCard text-ink" title={item.name}>
            {item.name || 'Untitled Pop'}
          </div>
          {item.series ? (
            <div className="text-[10px] uppercase tracking-wide mt-1 truncate font-mono text-[#6B6558]">
              {item.series}
            </div>
          ) : null}
          <div className="flex items-center justify-between mt-2 gap-2">
            <div
              className="flex items-center gap-1 text-[10px] font-mono flex-shrink-0"
              style={{ color: dropSoon ? '#B5442E' : '#8A8578' }}
            >
              <Calendar size={11} />
              {item.release_date
                ? new Date(item.release_date + 'T00:00:00').toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'TBD'}
            </div>
            {showRetailer && (
              <div className="text-[10px] font-mono truncate underline text-ink">
                {retailerLabel}
              </div>
            )}
            {item.reference_number && !showRetailer ? (
              <div className="text-[10px] font-mono font-bold text-ink">#{item.reference_number}</div>
            ) : null}
          </div>
        </div>
      </button>

      <div className="flex gap-px">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold font-mono bg-ink text-card"
        >
          <Pencil size={11} /> EDIT
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold font-mono bg-[#B5442E] text-card"
        >
          <Trash2 size={11} /> DEL
        </button>
      </div>
    </div>
  );
}
