# Mwashi Gadgets Admin Setup

This build adds a Supabase-powered admin panel without requiring Laravel/PHP on your server.

## 1. Create a Supabase project
Create a project at https://supabase.com/

## 2. Create the table
Open SQL Editor and run `SUPABASE_SCHEMA.sql`.

<<<<<<< HEAD
## 3. Create your admin account
=======
## 3. Create your owner/admin account
>>>>>>> 9b90dc5dbddaf105b4e6afdb9327c233a7c59b9a
In Supabase Dashboard:
Authentication -> Users -> Add user.
Create the email/password you will use for `/admin/login.html`.

<<<<<<< HEAD
=======
Then add that Auth user's UUID to `public.admin_users` in SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

The UUID is the user's `id` shown under Authentication -> Users. Only users listed in `admin_users` can enter the admin area.

>>>>>>> 9b90dc5dbddaf105b4e6afdb9327c233a7c59b9a
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
