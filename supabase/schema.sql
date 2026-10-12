-- ===========================================================================
--  Stea Masala - blog schema
--
--  How to apply
--  -------------
--  1. Supabase dashboard -> SQL Editor -> New query
--  2. Paste this whole file and press Run. It is safe to re-run.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null check (char_length(title) between 1 and 200),
  slug          text        not null unique
                            check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt       text        not null default '',
  content       text        not null default '',
  cover_image   text,
  cover_alt     text,
  author        text        not null default 'Sadaf',
  category      text        not null default 'Masala Chai',
  tags          text[]      not null default '{}',
  status        text        not null default 'draft'
                            check (status in ('draft', 'published')),
  featured      boolean     not null default false,
  meta_title       text,
  meta_description text,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.blog_posts is 'Blog posts created from the Stea Masala admin panel.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists blog_posts_published_idx
  on public.blog_posts (published_at desc)
  where status = 'published';

create index if not exists blog_posts_status_idx
  on public.blog_posts (status);

create index if not exists blog_posts_tags_idx
  on public.blog_posts using gin (tags);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_posts_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The website reads published posts with the anon key. Everything else is
-- written with the service role key from the server, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts_public_read_published" on public.blog_posts;
create policy "blog_posts_public_read_published"
  on public.blog_posts
  for select
  using (status = 'published' and published_at is not null);

-- ---------------------------------------------------------------------------
-- Storage bucket for cover images and in-article images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('blog', 'blog', true, 10485760) -- 10 MB
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit;

drop policy if exists "blog_images_public_read" on storage.objects;
create policy "blog_images_public_read"
  on storage.objects
  for select
  using (bucket_id = 'blog');

-- Uploads are performed server-side with the service role key, which bypasses
-- these policies. They exist so the bucket is safe if the anon key is ever
-- used directly. Uploads must target a path that starts with a folder.
drop policy if exists "blog_images_admin_insert" on storage.objects;
create policy "blog_images_admin_insert"
  on storage.objects
  for insert
  with check (
    bucket_id = 'blog'
    and (storage.foldername(name))[1] is not null
  );

drop policy if exists "blog_images_admin_update" on storage.objects;
create policy "blog_images_admin_update"
  on storage.objects
  for update
  using (bucket_id = 'blog');

drop policy if exists "blog_images_admin_delete" on storage.objects;
create policy "blog_images_admin_delete"
  on storage.objects
  for delete
  using (bucket_id = 'blog');

-- ===========================================================================
--  Stea Masala - products schema
--
--  Powers the "Shop Our Products" grid on the home page. Products are created
--  and edited from the admin panel (/admin/products) using the service role
--  key; the website reads the active ones with the anon key.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null check (char_length(name) between 1 and 120),
  category       text        not null default 'Tea',
  size           text        not null default '',
  description    text        not null default '',
  price          integer     not null check (price >= 0),
  original_price integer     check (original_price is null or original_price >= 0),
  image          text,
  image_alt      text,
  badge          text,
  discount_label text,
  active         boolean     not null default true,
  sort_order     integer     not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.products is 'Product catalogue managed from the Stea Masala admin panel.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists products_active_idx
  on public.products (active, sort_order);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row
  execute function public.set_products_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active"
  on public.products
  for select
  using (active = true);
