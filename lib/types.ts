export type Figure = {
  id: string;
  name: string;
  series: string;
  retailer: string;
  release_date: string | null; // ISO date, e.g. "2026-08-29"
  image_url: string | null;
  reference_number: string | null;
  character: string | null;
  notes: string | null;
  status: 'owned' | 'wishlist' | 'listed' | 'sold';
  created_at: string;
};

export type RetailerMeta = { name: string; color: string; ink: string };

export const RETAILERS: RetailerMeta[] = [
  { name: 'Hot Topic', color: '#FFD400', ink: '#1B1D22' },
  { name: 'BoxLunch', color: '#7C2AE8', ink: '#FFFFFF' },
  { name: 'GameStop', color: '#0055A4', ink: '#FFFFFF' },
  { name: 'Target', color: '#CC0000', ink: '#FFFFFF' },
  { name: 'Walmart', color: '#0071CE', ink: '#FFFFFF' },
  { name: 'Amazon', color: '#FF9900', ink: '#1B1D22' },
  { name: 'Funko Shop', color: '#1596D0', ink: '#FFFFFF' },
  { name: 'SDCC / Con Excl.', color: '#D4AF37', ink: '#1B1D22' },
  { name: 'Barnes & Noble', color: '#2E7D32', ink: '#FFFFFF' },
  { name: 'General Release', color: '#8A8F98', ink: '#FFFFFF' },
];

export function retailerMeta(name: string): RetailerMeta {
  return RETAILERS.find((r) => r.name === name) ?? { name, color: '#8A8F98', ink: '#FFFFFF' };
}
