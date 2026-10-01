-- MWASHI GADGETS SUPABASE SCHEMA
-- Run this in Supabase SQL Editor.

create table if not exists public.products (
  id bigint primary key,
  name text not null,
  type text default 'product',
  category text,
  brand text,
  subcategory text,
  featured boolean default false,
  latest boolean default false,
  installment boolean default false,
  image text,
  description text,
  price numeric(14,2),
  storage jsonb,
  colours jsonb default '[]'::jsonb,
  compatibility jsonb default '[]'::jsonb,
  stock integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

-- Public storefront can read active products.
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
using (active = true);

-- Authenticated admins can manage products.
drop policy if exists "Authenticated admins can manage products" on public.products;
create policy "Authenticated admins can manage products"
on public.products for all
to authenticated
using (true)
with check (true);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_brand_idx on public.products(brand);
create index if not exists products_active_idx on public.products(active);

-- Optional: create an admin user in Supabase Dashboard > Authentication > Users.


-- Product image storage
-- The bucket is public so the storefront can display product images without requiring a login.
-- Upload/delete/update operations are still protected by storage.objects RLS.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Bucket-wide SELECT is intentional: Storage may need to return metadata
-- for a newly uploaded object, while the public bucket serves the actual
-- image to storefront visitors without authentication.
drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Authenticated users can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

drop policy if exists "Authenticated users can upload product images" on storage.objects;
create policy "Authenticated users can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can update product images" on storage.objects;
create policy "Authenticated users can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can delete product images" on storage.objects;
create policy "Authenticated users can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
