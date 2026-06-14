-- ============================================
-- MF SPORTS INJURY REHAB - DATABASE SCHEMA
-- ============================================

-- HERO SECTION
create table hero (
  id uuid primary key default gen_random_uuid(),
  heading text not null default 'Welcome to MF Sports Injury Rehab',
  subheading text default 'Where your journey to optimal health and vitality begins.',
  background_image_url text,
  cta_text text default 'Book Now',
  cta_link text default 'https://mf-sports-injury-rehab.au2.cliniko.com/bookings#service',
  updated_at timestamptz default now()
);

-- ABOUT SECTION
create table about (
  id uuid primary key default gen_random_uuid(),
  title text default 'About Us',
  content text,
  founder_name text default 'Mohammed Firdouse',
  founder_role text default 'Founder',
  founder_bio text,
  founder_image_url text,
  updated_at timestamptz default now()
);

-- TEAM MEMBERS (Aiesha Ahmad etc.)
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  image_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- SERVICES
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  image_url text,
  booking_link text default 'https://mf-sports-injury-rehab.au2.cliniko.com/bookings#service',
  display_order int default 0,
  created_at timestamptz default now()
);

-- CONDITIONS TREATED
create table conditions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- REVIEWS / TESTIMONIALS
create table reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int check (rating between 1 and 5) default 5,
  review_text text not null,
  review_date date default current_date,
  created_at timestamptz default now()
);

-- GALLERY (images + youtube video links)
create table gallery (
  id uuid primary key default gen_random_uuid(),
  media_type text check (media_type in ('image', 'video')) default 'image',
  url text not null, -- supabase storage url OR youtube embed link
  caption text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- INSURANCE LOGOS
create table insurance_logos (
  id uuid primary key default gen_random_uuid(),
  name text,
  image_url text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- CONTACT INFO (single row)
create table contact_info (
  id uuid primary key default gen_random_uuid(),
  phone_1 text default '0492 996 268',
  phone_2 text default '0426918548',
  email text default 'mfsportsinjuryrehab1@gmail.com',
  address text default '680, Hume Highway, Yagoona, NSW 2199',
  hours_weekdays text default 'All days 12pm to 1am',
  hours_friday text default 'Friday 4:00pm to 1am',
  map_embed_url text default 'https://maps.google.com/maps?q=680%2C%20Hume%20Highway%2C%20Yagoona%2C%20NSW%202199&t=m&z=10&output=embed&iwloc=near',
  updated_at timestamptz default now()
);

-- CONTACT FORM SUBMISSIONS (from website visitors)
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  phone text not null,
  email text,
  message text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- SITE SETTINGS (general / extensible key-value store for future flexibility)
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb,
  updated_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
-- Public can READ everything (it's a public website)
-- Only authenticated admin users can WRITE

alter table hero enable row level security;
alter table about enable row level security;
alter table team_members enable row level security;
alter table services enable row level security;
alter table conditions enable row level security;
alter table reviews enable row level security;
alter table gallery enable row level security;
alter table insurance_logos enable row level security;
alter table contact_info enable row level security;
alter table contact_submissions enable row level security;
alter table site_settings enable row level security;

-- Public read access
create policy "Public read access" on hero for select using (true);
create policy "Public read access" on about for select using (true);
create policy "Public read access" on team_members for select using (true);
create policy "Public read access" on services for select using (true);
create policy "Public read access" on conditions for select using (true);
create policy "Public read access" on reviews for select using (true);
create policy "Public read access" on gallery for select using (true);
create policy "Public read access" on insurance_logos for select using (true);
create policy "Public read access" on contact_info for select using (true);
create policy "Public read access" on site_settings for select using (true);

-- Authenticated full access (admin panel)
create policy "Authenticated full access" on hero for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on about for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on team_members for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on services for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on conditions for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on reviews for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on gallery for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on insurance_logos for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on contact_info for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on site_settings for all using (auth.role() = 'authenticated');

-- Contact submissions: anyone can INSERT (website visitors), only admin can read/manage
create policy "Anyone can submit contact form" on contact_submissions for insert with check (true);
create policy "Authenticated can view submissions" on contact_submissions for select using (auth.role() = 'authenticated');
create policy "Authenticated can update submissions" on contact_submissions for update using (auth.role() = 'authenticated');
create policy "Authenticated can delete submissions" on contact_submissions for delete using (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA (initial content from old site)
-- ============================================

insert into hero (heading, subheading) values
('Welcome to MF Sports Injury Rehab', 'Where your journey to optimal health and vitality begins.');

insert into about (title, content, founder_name, founder_role, founder_bio) values (
  'About Us',
  'At MF Sports Injury Rehab, we''re more than just physiotherapists—we''re your partners in recovery and performance enhancement. Our team brings together a unique blend of expertise, passion, and dedication to help you overcome injuries, optimize your physical abilities, and achieve your sporting goals.',
  'Mohammed Firdouse',
  'Founder, Sports Injury Therapist & Remedial Massage Therapist',
  'Trained as a physiotherapist overseas, then studied Remedial & Sports Massage Therapy in Sydney. Combines international training with local expertise.'
);

insert into team_members (name, role, bio, display_order) values
('Aiesha Ahmad', 'Remedial Massage Therapist', 'Background in pathology, holds a Diploma in Remedial Massage Therapy from Sydney, currently studying Bachelor''s in Physiotherapy. Female-only therapist.', 1);

insert into services (title, slug, display_order) values
('Assisted Stretching', 'assisted-stretching', 1),
('Electro Acupuncture', 'electro-acupuncture', 2),
('Remedial Massage Therapy', 'remedial-massage-therapy', 3),
('Sports Massage', 'sports-massage', 4),
('Myofascial Release', 'myofascial-release', 5),
('Dry Needling', 'dry-needling', 6),
('Cupping (Hijama) Therapy', 'cupping-therapy', 7),
('Mobilization', 'mobilization-therapy', 8),
('Manual Therapy', 'manual-therapy', 9),
('Sports Injury Management', 'sports-injury-management', 10),
('IASTM', 'iastm', 11),
('Laser Therapy', 'laser-therapy', 12),
('Shockwave Therapy', 'shockwave-therapy', 13);

insert into conditions (name, display_order) values
('Neck pain', 1),
('Shoulder pain', 2),
('Shoulder mobility', 3),
('Mid back pain', 4),
('Lower back pain', 5),
('Hip mobility', 6),
('Sciatica', 7),
('Knee pain', 8),
('Ankle pain', 9),
('Muscle pain', 10);

insert into contact_info (phone_1, phone_2, email, address, hours_weekdays, hours_friday) values
('0492 996 268', '0426918548', 'mfsportsinjuryrehab1@gmail.com', '680, Hume Highway, Yagoona, NSW 2199', 'All days 12pm to 9pm', 'Friday 4:00pm to 9pm');

-- Note: hours changed from "1am" to "9pm" as a placeholder - CONFIRM ACTUAL HOURS with brother-in-law before launch

insert into site_settings (key, value) values
('youtube_video_url', '"https://www.youtube.com/embed/xBM7Qbo2mxo"'),
('site_name', '"MF Sports Injury Rehab"'),
('domain', '"mfsportsinjuryrehab.com.au"');
