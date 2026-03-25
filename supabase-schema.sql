-- ============================================================
-- Elena Care — Supabase Schema
-- Run this in Supabase SQL Editor (supabase.com → project → SQL Editor)
-- ============================================================

-- MESSAGES (feed items: text, voice, file, handoff)
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  type text not null default 'text' check (type in ('text', 'voice', 'file', 'handoff', 'system')),
  content text,
  file_url text,
  transcript text,
  sender text not null,
  created_at timestamptz default now()
);

-- TASKS (max 5 enforced client-side)
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  done boolean default false,
  owner text,
  created_at timestamptz default now()
);

-- PATIENT INFO (single row, editable)
create table if not exists patient_info (
  id int default 1 primary key check (id = 1),
  name text default 'Elena Valdez',
  dob text default 'August 11, 1951',
  hospital text default '',
  nurse_station text default '',
  case_manager text default '',
  case_manager_phone text default '',
  insurance text default '',
  phase text default 'hospital' check (phase in ('hospital', 'surgery', 'mobility', 'discharge', 'rehab')),
  current_shift text default '',
  updated_at timestamptz default now()
);

-- Insert default patient row
insert into patient_info (id) values (1) on conflict do nothing;

-- INDEXES
create index if not exists idx_messages_created on messages (created_at desc);
create index if not exists idx_tasks_done on tasks (done, created_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- For family use: open access with anon key (no auth needed)
-- If you want auth later, replace these with proper policies
-- ============================================================

alter table messages enable row level security;
alter table tasks enable row level security;
alter table patient_info enable row level security;

create policy "Allow all on messages" on messages for all using (true) with check (true);
create policy "Allow all on tasks" on tasks for all using (true) with check (true);
create policy "Allow all on patient_info" on patient_info for all using (true) with check (true);

-- ============================================================
-- REALTIME
-- Enable realtime for messages and tasks
-- ============================================================

alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table tasks;

-- ============================================================
-- STORAGE
-- Create bucket for file uploads (photos, PDFs, voice recordings)
-- ============================================================
-- Run this in Supabase Dashboard → Storage → New Bucket:
--   Name: care-files
--   Public: true
--
-- Or via SQL:
insert into storage.buckets (id, name, public) values ('care-files', 'care-files', true)
on conflict do nothing;

-- Storage policy: allow anonymous uploads and reads
create policy "Allow public read on care-files" on storage.objects
  for select using (bucket_id = 'care-files');

create policy "Allow public insert on care-files" on storage.objects
  for insert with check (bucket_id = 'care-files');
