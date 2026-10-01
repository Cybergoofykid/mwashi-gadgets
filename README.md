# mwashi_gadgets
SMARTPHONE SELLING WEBSITE


## Current Supabase image-upload setup

- Storage bucket: `product-images` (Public).
- Product images are uploaded by the admin to `product-images/products/`.
- Uploads use unique timestamped filenames with `upsert: false`, so creating a new product only needs an authenticated `INSERT` storage policy.
- A bucket-wide `SELECT` policy is also required so Supabase Storage can return metadata after an upload.
- The storefront reads products from the Supabase `products` table; it does not depend on a hard-coded phone catalogue.

### Dashboard policies for `product-images`

Create/verify these policies under **Storage → Files → Policies → product-images**:

1. `INSERT` for `authenticated` with `bucket_id = 'product-images'`.
2. `SELECT` for `public` with `bucket_id = 'product-images'`.
3. `UPDATE` for `authenticated` with `bucket_id = 'product-images'`.
4. `DELETE` for `authenticated` with `bucket_id = 'product-images'`.

The first two are the policies needed for the normal add-product upload flow.
