# Mwashi Gadgets — Supabase Catalogue Cleanup

The storefront now uses Supabase as the single source of truth for products.

Removed legacy hard-coded catalogue files:
- js/apple.js
- js/samsung.js
- js/pixel.js
- js/nothing.js (removed)
- js/accessories.js
- js/audio.js

Updated:
- js/products.js remains the product loader.
- js/hero.js now uses products loaded from Supabase.
- installment.html no longer loads legacy product arrays.
- admin/index.html no longer loads legacy product arrays.
- index.html no longer contains a hard-coded hero phone.

Product records should now be created/edited through the Admin Products page and stored in public.products.
