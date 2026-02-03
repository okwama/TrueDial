
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  loyalty_points integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. BRANDS
create table brands (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CATEGORIES
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCTS (Enhanced)
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  name text not null,
  slug text not null unique,
  description text,
  
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  
  price numeric not null check (price >= 0),
  compare_at_price numeric check (compare_at_price > price),
  
  stock_quantity integer default 1 not null check (stock_quantity >= 0),
  status text default 'active' check (status in ('active', 'draft', 'archived', 'sold')),
  
  condition text default 'New' check (condition in ('New', 'Excellent', 'Very Good', 'Good', 'Fair')),
  movement text default 'Automatic' check (movement in ('Automatic', 'Quartz', 'Manual', 'Solar')),
  case_size text, -- e.g. "40mm"
  water_resistance text, -- e.g. "100m"
  
  featured boolean default false
);

-- 5. PRODUCT IMAGES (Multiple images per product)
create table product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDERS
create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete set null, -- Null for guest checkouts
  
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  
  status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric not null default 0,
  
  shipping_address text,
  notes text,
  order_source text default 'whatsapp' -- whatsapp, website
);

-- 7. ORDER ITEMS
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  
  quantity integer default 1 not null,
  unit_price numeric not null, -- Price at time of purchase
  total_price numeric generated always as (quantity * unit_price) stored
);

-- 8. LOYALTY TRANSACTIONS
create table loyalty_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  points integer not null, -- positive for earn, negative for spend
  type text not null check (type in ('purchase', 'redemption', 'bonus')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES --

-- Enable RLS
alter table profiles enable row level security;
alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table loyalty_transactions enable row level security;

-- PUBLIC READ ACCESS
create policy "Public can view active products" on products for select using (status = 'active');
create policy "Public can view brands" on brands for select using (true);
create policy "Public can view categories" on categories for select using (true);
create policy "Public can view product images" on product_images for select using (true);

-- PROFILES: Users can view their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);

-- LOYALTY: Users can view their own transactions
create policy "Users can view own loyalty history" on loyalty_transactions for select using (auth.uid() = user_id);

-- ADMIN ACCESS (For simplicity, using built-in authentication check or profile role)
-- NOTE: Needs a trigger to create profile on signup. For now, we assume authenticated users with specific emails are admins, 
-- or we just allow all authenticated users to manage for this demo (as requested "simple").
-- We will restrict write access to authenticated users.

create policy "Admins can manage brands" on brands for all to authenticated using (true);
create policy "Admins can manage categories" on categories for all to authenticated using (true);
create policy "Admins can manage products" on products for all to authenticated using (true);
create policy "Admins can manage product images" on product_images for all to authenticated using (true);
create policy "Admins can view all orders" on orders for select to authenticated using (true);

-- Allow guests (public) to create orders
create policy "Public can create orders" on orders for insert with check (true);
create policy "Public can create order items" on order_items for insert with check (true);

-- TRIGGERS --
-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_products_updated_at
before update on products
for each row
execute procedure update_updated_at_column();
