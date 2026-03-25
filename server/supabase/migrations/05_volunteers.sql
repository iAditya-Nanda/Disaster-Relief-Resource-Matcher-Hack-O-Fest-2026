-- 1. Volunteers Table
create table if not exists public.volunteers (
  id uuid default gen_random_uuid() primary key,
  ngo_id uuid references public.profiles(id) not null,
  name text not null,
  skills text,
  status text default 'available' check (status in ('available', 'deployed', 'inactive')),
  location geography(POINT, 4326),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.volunteers enable row level security;

-- 3. Policies
create policy "Anyone can view volunteers." on public.volunteers for select using (true);
create policy "NGOs can insert their own volunteers." on public.volunteers for insert with check (auth.uid() = ngo_id);
create policy "NGOs can update their own volunteers." on public.volunteers for update using (auth.uid() = ngo_id);
create policy "NGOs can delete their own volunteers." on public.volunteers for delete using (auth.uid() = ngo_id);
