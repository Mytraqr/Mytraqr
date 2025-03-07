-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid references auth.users primary key,
  email text unique not null,
  role text not null check (role in ('player', 'coach')),
  name text,
  coach_id uuid references users(id),
  pairing_code text unique,
  preferences jsonb default '{"units": "yards"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses table
create table courses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  name text not null,
  holes jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Rounds table
create table rounds (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  course_id uuid references courses(id) not null,
  date date not null,
  condition text check (condition in ('poor', 'fair', 'good', 'excellent')),
  holes jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stats table for caching calculated stats
create table stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  stats_type text not null,
  period text not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, stats_type, period)
);

-- Row Level Security Policies
alter table users enable row level security;
alter table courses enable row level security;
alter table rounds enable row level security;
alter table stats enable row level security;

-- Users policies
create policy "Users can read their own data"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on users for update
  using (auth.uid() = id);

-- Courses policies
create policy "Users can read their own courses"
  on courses for select
  using (auth.uid() = user_id);

create policy "Users can create their own courses"
  on courses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own courses"
  on courses for update
  using (auth.uid() = user_id);

-- Rounds policies
create policy "Users can read their own rounds"
  on rounds for select
  using (auth.uid() = user_id);

create policy "Users can create their own rounds"
  on rounds for insert
  with check (auth.uid() = user_id);

create policy "Coaches can read their players' rounds"
  on rounds for select
  using (exists (
    select 1 from users
    where users.id = rounds.user_id
    and users.coach_id = auth.uid()
  ));

-- Stats policies
create policy "Users can read their own stats"
  on stats for select
  using (auth.uid() = user_id);

create policy "Users can update their own stats"
  on stats for update
  using (auth.uid() = user_id);

create policy "Coaches can read their players' stats"
  on stats for select
  using (exists (
    select 1 from users
    where users.id = stats.user_id
    and users.coach_id = auth.uid()
  )); 