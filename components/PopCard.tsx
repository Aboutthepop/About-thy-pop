'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Calendar, Download, ImageOff, Pencil, Trash2 } from 'lucide-react';
import type { Figure } from '@/lib/types';

function downloadImage(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  const safeName = (name || 'funko-pop').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  a.download = safeName + '.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

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
  const showRetailer = item.retailer && item.retailer !== 'General Release' && item.retailer !== 'N/A';
  const retailerLabel =
    item.retailer === 'Con Exclusive' && item.con_type
      ? 'Con Exclusive (' + item.con_type + ')'
      : item.retailer;

  const photos = [item.image_url, item.image_url_2].filter(Boolean) as string[];
  const hasSecondPhoto = photos.length > 1;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(idx);
  }

  return (
    <div className="relative rounded-lg overflow-visible group bg-card">
      <div className="relative m-2 mb-0 aspect-square rounded-sm overflow-hidden bg-cardWindow">
        {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map(
          (pos, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 ${pos} pointer-events-none z-10`}
              style={{ borderColor: '#1B1D22', margin: '4px', opacity: 0.55 }}
            />
          )
        )}
        {photos.length > 0 ? (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex w-full h-full overflow-x-auto"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {photos.map((url, i) => (
              <div
                key={i}
                className="relative w-full h-full flex-shrink-0 flex items-center justify-center"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Image src={url} alt={item.name + ' photo ' + (i + 1)} fill className="object-contain" unoptimized />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full h-full items-center justify-center text-[#9A9488]">
            <ImageOff size={28} strokeWidth={1.5} />
          </div>
        )}
        {hasSecondPhoto && (
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center gap-1.5 z-10">
            {photos.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === activeIndex ? '#1B1D22' : 'rgba(27,29,34,0.35)' }}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onCharacterClick(characterName)}
        className="block w-full text-left"
      >
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
        {photos.length > 0 && (
          <button
            onClick={() => downloadImage(photos[activeIndex], item.name)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold font-mono bg-[#3D5A6C] text-card"
          >
            <Download size={11} /> SAVE
          </button>
        )}
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
