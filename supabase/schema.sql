-- Run this in the Supabase SQL editor to set up the catalog.

create table if not exists figures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  series text default '',
  retailer text default 'General Release',
  release_date date,
  image_url text,
  price numeric(10, 2),
  notes text,
  status text default 'owned' check (status in ('owned', 'wishlist', 'listed', 'sold')),
  created_at timestamptz default now()
);

create index if not exists figures_release_date_idx on figures (release_date);
create index if not exists figures_retailer_idx on figures (retailer);

alter table figures enable row level security;

create policy "Public can view figures"
  on figures for select
  using (true);

create policy "Authenticated users can insert figures"
  on figures for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update figures"
  on figures for update
  to authenticated
  using (true);

create policy "Authenticated users can delete figures"
  on figures for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('figure-images', 'figure-images', true)
on conflict (id) do nothing;

create policy "Public can view figure images"
  on storage.objects for select
  using (bucket_id = 'figure-images');

create policy "Authenticated users can upload figure images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'figure-images');
