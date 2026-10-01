# Mwashi Gadgets Admin Setup

This build adds a Supabase-powered admin panel without requiring Laravel/PHP on your server.

## 1. Create a Supabase project
Create a project at https://supabase.com/

## 2. Create the table
Open SQL Editor and run `SUPABASE_SCHEMA.sql`.

## 3. Create your admin account
In Supabase Dashboard:
Authentication -> Users -> Add user.
Create the email/password you will use for `/admin/login.html`.

## 4. Add public Supabase credentials
Open `admin/config.js` and replace:
- YOUR_SUPABASE_PROJECT_URL
- YOUR_SUPABASE_ANON_KEY

Use only the project's public `anon` key. Never put a `service_role` key in the website.

## 5. Import your current products
Open `/admin/login.html`, sign in, then Dashboard -> Import Current Catalogue.
This copies the existing JavaScript catalogue into Supabase.

## Important
The admin CRUD is ready in this build. The customer storefront still uses the existing local catalogue as a safe fallback. The next integration step is to make `index.html`, `product.html` and `cart.html` read the live Supabase catalogue first, then fall back to the current JS catalogue if Supabase is unavailable.
