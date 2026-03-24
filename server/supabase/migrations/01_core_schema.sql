-- Enable PostGIS for Geo-spatial support
create extension if not exists postgis;

-- 1. Profiles Table (Linked to Auth)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  username text unique,
  role text check (role in ('NGO', 'Needy', 'Doctor', 'Admin')),
  language_pref text default 'en',
  lat_lng geography(POINT, 4326),
  avatar_url text
);

-- 2. Resources Table (Supplies)
create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  provider_id uuid references public.profiles(id) not null,
  title text not null,
  category text not null, -- food, med, water, etc.
  quantity numeric default 0,
  unit text,
  location geography(POINT, 4326) not null,
  status text default 'available' check (status in ('available', 'matched', 'collected', 'delivered')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Needs Table (Requests)
create table if not exists public.needs (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  urgency int default 1 check (urgency between 1 and 10),
  location geography(POINT, 4326) not null,
  status text default 'pending' check (status in ('pending', 'matched', 'fulfilled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Medical Consultations Table
create table if not exists public.medical_consultations (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references public.profiles(id) not null,
  doctor_id uuid references public.profiles(id), -- can be null until assigned
  room_id text, -- WebRTC Signaling Room ID
  status text default 'waiting' check (status in ('waiting', 'ongoing', 'completed')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Blood Inventory Table
create table if not exists public.blood_inventory (
  id uuid default gen_random_uuid() primary key,
  donor_id uuid references public.profiles(id) not null,
  blood_type text not null, -- O+, O-, A+, etc.
  last_donation_date date,
  is_available boolean default true,
  current_location geography(POINT, 4326),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.needs enable row level security;

-- Basic Policies (To be refined in Phase 2.2)
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);
create policy "Anyone can view resources." on public.resources for select using (true);
create policy "NGOs can insert their own resources." on public.resources for insert with check (auth.uid() = provider_id);
