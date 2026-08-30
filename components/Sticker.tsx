import { retailerMeta } from '@/lib/types';

export default function Sticker({ retailer }: { retailer: string }) {
  if (!retailer || retailer === 'General Release') return null;

  const meta = retailerMeta(retailer);

  return (
    <div
      className="absolute -top-3 -right-3 z-10 px-2.5 py-1.5 rounded-full shadow-lg select-none flex items-center justify-center"
      style={{
        background: meta.color,
        color: meta.ink,
        transform: 'rotate(-9deg)',
        fontFamily: "'Space Mono', monospace",
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        border: '2px solid rgba(0,0,0,0.15)',
        boxShadow: '0 3px 8px rgba(0,0,0,0.45)',
        maxWidth: '110px',
        textAlign: 'center',
        lineHeight: 1.15,
      }}
    >
      {meta.name.toUpperCase()}
    </div>
  );
}
