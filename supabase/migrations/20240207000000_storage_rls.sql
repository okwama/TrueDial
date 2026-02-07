
-- 1. Ensure the 'watches' bucket exists and is public
insert into storage.buckets (id, name, public)
values ('watches', 'watches', true)
on conflict (id) do update
set public = true;

-- 2. Drop existing policies to prevent conflicts
drop policy if exists "Public view watches" on storage.objects;
drop policy if exists "Authenticated upload watches" on storage.objects;
drop policy if exists "Authenticated update watches" on storage.objects;
drop policy if exists "Authenticated delete watches" on storage.objects;

-- 3. Set policies for 'watches' bucket

-- Allow public to view images
create policy "Public view watches"
on storage.objects for select
to public
using ( bucket_id = 'watches' );

-- Allow authenticated users (Admins) to upload
create policy "Authenticated upload watches"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'watches' );

-- Allow authenticated users to update their own uploads or all in this bucket
create policy "Authenticated update watches"
on storage.objects for update
to authenticated
using ( bucket_id = 'watches' );

-- Allow authenticated users to delete
create policy "Authenticated delete watches"
on storage.objects for delete
to authenticated
using ( bucket_id = 'watches' );
