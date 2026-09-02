export type Figure = {
  id: string;
  name: string;
  series: string;
  retailer: string;
  con_type: string | null;
  pop_line: string | null;
  release_date: string | null;
  image_url: string | null;
  image_url_2: string | null;
  reference_number: string | null;
  character: string | null;
  related: string | null;
  sku: string | null;
  variant: string | null;
  size: string | null;
  product_type: string | null;
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
  { name: 'Con Exclusive', color: '#D4AF37', ink: '#1B1D22' },
  { name: 'Barnes & Noble', color: '#2E7D32', ink: '#FFFFFF' },
  { name: 'General Release', color: '#8A8F98', ink: '#FFFFFF' },
];

export const CON_TYPES = ['ECCC', 'NYCC', 'SDCC', 'LACC', 'C2E2'];

export const POP_LINES = [
  'Animation',
  'Anime',
  'DC',
  'Die-Cast!',
  'Disney',
  'Horror',
  'Marvel',
  'Movies',
  'Pop! Rocks',
  'Sanrio',
  'Sports',
  'Star Wars',
  'TV Shows',
  'Video Games',
];

export const VARIANTS = [
  'Common',
  'Chase',
  'Flocked',
  'Diamond/Glitter',
  'Glow in the Dark',
  'Metallic',
  'Chrome',
  'Black Light',
  'N/A',
];

export const SIZES = ['Standard [4"]', 'Super [6"]', 'Jumbo [10"]', 'Mega [18"]'];

export const PRODUCT_TYPES = [
  '',
  'Pop! Rides',
  'Pop! Rides DLX',
  'Pop! Rides Super DLX',
  'Pop! Moment',
  'Pop! Premium',
  'Pop! Plus',
  'Pop! DLX',
  'Pop! Town',
  'Vinyl Soda',
  'Rewind',
  'Mystery Mini',
  'Open Box Minis',
  'Pop! Keychain',
  'Pen Topper',
];

export function retailerMeta(name: string): RetailerMeta {
  return RETAILERS.find((r) => r.name === name) ?? { name, color: '#8A8F98', ink: '#FFFFFF' };
}
