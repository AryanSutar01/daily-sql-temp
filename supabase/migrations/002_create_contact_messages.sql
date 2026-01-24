create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'unread' not null
);

alter table contact_messages enable row level security;

-- Allow anyone (public/anon) to insert messages
create policy "Allow public to insert contact messages"
on contact_messages for insert
to public
with check (true);

-- Only allow service role (admins) to view messages (no public read access)
create policy "Allow service role to view contact messages"
on contact_messages for select
to service_role
using (true);
