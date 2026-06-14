# MF Sports Injury Rehab — Rebuild

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (DB, Auth, Storage)
- Vercel (hosting)

## ✅ Done so far
- Full database schema (`supabase/schema.sql`) — includes all tables, RLS
  policies, and seed data from the old WordPress site
- Homepage with: Navbar, Hero, About, Services, Conditions, Reviews,
  Insurance, Contact (with form), Footer — all fetching live from Supabase
- Admin auth (Supabase Auth login page + route guard)
- Admin dashboard home
- Admin Hero editor (fully working — edit text + upload bg image)
- Admin Services CRUD (fully working — add/edit/delete/reorder services)
- Reusable `ImageUploader` component (uploads to Supabase Storage)

## 🔜 To build next (same pattern as Services/Hero)
- Admin pages: About/Team, Conditions, Reviews, Gallery, Insurance Logos,
  Contact Info, Form Submissions
- Individual service detail pages (`/services/[slug]`)
- `/about`, `/contact`, `/gallery` standalone pages
- Mobile sticky "Book Now" bar

## Setup steps (do this first, tomorrow)

### 1. Create Supabase project
- Go to supabase.com, create new project
- Go to SQL Editor, paste contents of `supabase/schema.sql`, run it
- Go to Storage, create a new **public** bucket called `site-images`
- Go to Authentication > Users, manually create 2 users:
  - Your brother-in-law's email + password
  - Your sister's email + password
  (These are the only 2 admin logins)

### 2. Environment variables
- Copy `.env.local.example` to `.env.local`
- Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  from Supabase Settings > API

### 3. Install & run
```bash
npm install
npm run dev
```
Visit `localhost:3000` for the site, `localhost:3000/admin/login` for admin.

### 4. CONFIRM with brother-in-law before launch
- Business hours — schema currently has "12pm to 9pm" as a placeholder.
  Old site said "1am" which looked like a typo. Get the real hours.
- Upload real images: hero background, founder photo, service images,
  insurance logos (download these from the old WordPress site first)
- Add real reviews if they have any from Cliniko/Google

### 5. Deploy
- Push to GitHub
- Import into Vercel
- Add the same env vars in Vercel project settings
- Once working on `.vercel.app` URL, add custom domain
  `mfsportsinjuryrehab.com.au` in Vercel, update DNS

## Notes
- All videos should use YouTube embed links (paste into gallery), not
  Supabase storage — keeps storage usage low (free tier = 1GB)
- Color scheme: navy background + teal accent — can be changed easily in
  `tailwind.config.js`
