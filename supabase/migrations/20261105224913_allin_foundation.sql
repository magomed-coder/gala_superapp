-- Основа ALLIN. Публичный каталог отделён от приватных данных аккаунтов.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 160),
  phone text not null default '' check (char_length(phone) <= 32),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.sellers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete restrict,
  name text not null check (char_length(btrim(name)) between 1 and 160),
  kind text not null check (kind in ('store', 'specialist', 'team')),
  description text not null default '' check (char_length(description) <= 4000),
  location text not null check (char_length(btrim(location)) between 1 and 300),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.categories (
  id text primary key,
  name text not null,
  sort_order integer not null default 0
);
create table public.subcategories (
  id text primary key,
  category_id text not null references public.categories(id) on delete restrict,
  name text not null,
  sort_order integer not null default 0
);
create index subcategories_category_idx on public.subcategories(category_id, sort_order);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete restrict,
  subcategory_id text not null references public.subcategories(id) on delete restrict,
  kind text not null check (kind in ('product', 'service')),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 4000),
  location text not null default '' check (char_length(location) <= 300),
  purchase_mode text not null check (purchase_mode in ('purchase', 'negotiation', 'both')),
  unit_price numeric(12,2),
  unit_label text not null default 'ед.' check (char_length(btrim(unit_label)) between 1 and 40),
  currency text not null default 'RUB' check (currency = 'RUB'),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listing_price_valid check (
    (unit_price is null or (unit_price > 0 and unit_price < 10000000000)) and
    (purchase_mode = 'negotiation' or unit_price is not null)
  ),
  constraint listing_published_description check (status <> 'published' or char_length(btrim(description)) > 0)
);
create index listings_seller_idx on public.listings(seller_id, created_at desc);
create index listings_subcategory_idx on public.listings(subcategory_id, status, created_at desc);
create index listings_published_idx on public.listings(created_at desc) where status = 'published';
create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null unique,
  sort_order integer not null default 0 check (sort_order >= 0),
  unique(listing_id, sort_order)
);
create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, listing_id)
);
create index favorites_listing_idx on public.favorites(listing_id);
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'home' check (label in ('home', 'work', 'other')),
  city text not null check (char_length(btrim(city)) between 1 and 160),
  street text not null check (char_length(btrim(street)) between 1 and 500),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index addresses_user_idx on public.addresses(user_id);
create unique index addresses_one_default_idx on public.addresses(user_id) where is_default;

-- Заказы изменяются только через проверенные RPC, клиент не задаёт цену или покупателя.
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  seller_id uuid not null references public.sellers(id) on delete restrict,
  request_id uuid not null,
  request_payload jsonb not null,
  status text not null default 'pending' check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  total_amount numeric(15,2) not null check (total_amount > 0),
  currency text not null default 'RUB' check (currency = 'RUB'),
  delivery_address jsonb,
  buyer_note text not null default '' check (char_length(buyer_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(buyer_id, request_id)
);
create index orders_seller_idx on public.orders(seller_id, created_at desc);
create index orders_buyer_created_idx on public.orders(buyer_id, created_at desc);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete restrict,
  title text not null,
  unit_label text not null,
  quantity integer not null check (quantity between 1 and 999),
  unit_price numeric(12,2) not null check (unit_price > 0),
  total_amount numeric(15,2) generated always as (quantity * unit_price) stored
);
create index order_items_order_idx on public.order_items(order_id);
create index order_items_listing_idx on public.order_items(listing_id);
create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete restrict,
  status text not null check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  created_at timestamptz not null default now()
);
create index order_events_order_idx on public.order_events(order_id, created_at);
create index order_events_actor_idx on public.order_events(actor_id);
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  seller_id uuid not null references public.sellers(id) on delete restrict,
  listing_id uuid not null references public.listings(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(buyer_id, listing_id)
);
create index conversations_seller_idx on public.conversations(seller_id, created_at desc);
create index conversations_listing_idx on public.conversations(listing_id);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete restrict,
  body text not null check (char_length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index messages_conversation_idx on public.messages(conversation_id, created_at, id);
create index messages_sender_idx on public.messages(sender_id);

-- Триггер не доверяет метаданным как роли: имя используется только для отображения.
create function private.create_profile() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, full_name) values(new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 160));
  return new;
end;
$$;
revoke all on function private.create_profile() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.create_profile();
insert into public.profiles(id, full_name)
select id, left(coalesce(raw_user_meta_data ->> 'full_name', ''), 160) from auth.users on conflict (id) do nothing;

create function private.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
revoke all on function private.touch_updated_at() from public, anon, authenticated;
create trigger profiles_updated before update on public.profiles for each row execute function private.touch_updated_at();
create trigger sellers_updated before update on public.sellers for each row execute function private.touch_updated_at();
create trigger listings_updated before update on public.listings for each row execute function private.touch_updated_at();
create trigger orders_updated before update on public.orders for each row execute function private.touch_updated_at();

-- RLS и grants отделены: нет прямого изменения владельцев, цен заказов или статусов.
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
revoke all on public.profiles, public.sellers, public.categories, public.subcategories, public.listings, public.listing_images, public.favorites, public.addresses, public.orders, public.order_items, public.order_events, public.conversations, public.messages from anon, authenticated;
grant select on public.sellers, public.categories, public.subcategories, public.listings, public.listing_images to anon, authenticated;
grant select on public.profiles, public.favorites, public.addresses, public.orders, public.order_items, public.order_events, public.conversations, public.messages to authenticated;
grant update(full_name, phone, avatar_path) on public.profiles to authenticated;
grant insert on public.sellers, public.listings, public.listing_images, public.addresses, public.favorites, public.conversations, public.messages to authenticated;
grant update(name, kind, description, location, is_published) on public.sellers to authenticated;
grant update(subcategory_id, kind, title, description, location, purchase_mode, unit_price, unit_label, status) on public.listings to authenticated;
grant update(sort_order, storage_path) on public.listing_images to authenticated;
grant update(label, city, street, is_default) on public.addresses to authenticated;
grant delete on public.listing_images, public.favorites, public.addresses to authenticated;

create policy profile_owner_read on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profile_owner_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy seller_visible on public.sellers for select to anon, authenticated using (is_published or owner_id = (select auth.uid()));
create policy seller_owner_insert on public.sellers for insert to authenticated with check (owner_id = (select auth.uid()));
create policy seller_owner_update on public.sellers for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy categories_public_read on public.categories for select to anon, authenticated using (true);
create policy subcategories_public_read on public.subcategories for select to anon, authenticated using (true);
create policy listing_visible on public.listings for select to anon, authenticated using (
  exists(select 1 from public.sellers s where s.id = seller_id and ((status = 'published' and s.is_published) or s.owner_id = (select auth.uid())))
);
create policy listing_owner_insert on public.listings for insert to authenticated with check (exists(select 1 from public.sellers s where s.id = seller_id and s.owner_id = (select auth.uid())));
create policy listing_owner_update on public.listings for update to authenticated using (exists(select 1 from public.sellers s where s.id = seller_id and s.owner_id = (select auth.uid()))) with check (exists(select 1 from public.sellers s where s.id = seller_id and s.owner_id = (select auth.uid())));
create policy image_visible on public.listing_images for select to anon, authenticated using (exists(select 1 from public.listings l where l.id = listing_id));
create policy image_owner_insert on public.listing_images for insert to authenticated with check (
  (string_to_array(storage_path, '/'))[1] = (select auth.uid())::text and
  exists(select 1 from public.listings l join public.sellers s on s.id = l.seller_id where l.id = listing_id and s.owner_id = (select auth.uid()))
);
create policy image_owner_update on public.listing_images for update to authenticated using (exists(select 1 from public.listings l join public.sellers s on s.id = l.seller_id where l.id = listing_id and s.owner_id = (select auth.uid()))) with check ((string_to_array(storage_path, '/'))[1] = (select auth.uid())::text and exists(select 1 from public.listings l join public.sellers s on s.id = l.seller_id where l.id = listing_id and s.owner_id = (select auth.uid())));
create policy image_owner_delete on public.listing_images for delete to authenticated using (exists(select 1 from public.listings l join public.sellers s on s.id = l.seller_id where l.id = listing_id and s.owner_id = (select auth.uid())));
create policy favorite_owner_read on public.favorites for select to authenticated using (user_id = (select auth.uid()));
create policy favorite_owner_insert on public.favorites for insert to authenticated with check (user_id = (select auth.uid()) and exists(select 1 from public.listings l where l.id = listing_id));
create policy favorite_owner_delete on public.favorites for delete to authenticated using (user_id = (select auth.uid()));
create policy address_owner_read on public.addresses for select to authenticated using (user_id = (select auth.uid()));
create policy address_owner_insert on public.addresses for insert to authenticated with check (user_id = (select auth.uid()));
create policy address_owner_update on public.addresses for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy address_owner_delete on public.addresses for delete to authenticated using (user_id = (select auth.uid()));
create policy order_participant_read on public.orders for select to authenticated using (buyer_id = (select auth.uid()) or exists(select 1 from public.sellers s where s.id = seller_id and s.owner_id = (select auth.uid())));
create policy order_item_participant_read on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id = order_id));
create policy order_event_participant_read on public.order_events for select to authenticated using (exists(select 1 from public.orders o where o.id = order_id));
create policy conversation_participant_read on public.conversations for select to authenticated using (buyer_id = (select auth.uid()) or exists(select 1 from public.sellers s where s.id = seller_id and s.owner_id = (select auth.uid())));
create policy conversation_buyer_insert on public.conversations for insert to authenticated with check (
  buyer_id = (select auth.uid()) and exists(
    select 1 from public.listings l join public.sellers s on s.id = l.seller_id
    where l.id = listing_id and l.seller_id = conversations.seller_id and l.status = 'published'
      and l.purchase_mode in ('negotiation','both') and s.is_published and s.owner_id <> (select auth.uid())
  )
);
create policy message_participant_read on public.messages for select to authenticated using (exists(select 1 from public.conversations c where c.id = conversation_id));
create policy message_participant_insert on public.messages for insert to authenticated with check (sender_id = (select auth.uid()) and exists(select 1 from public.conversations c where c.id = conversation_id));

-- Приватная функция с явной проверкой пользователя нужна для атомарной записи защищённых таблиц заказа.
create function private.place_order(p_listing_id uuid, p_quantity integer, p_request_id uuid, p_address_id uuid, p_note text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  item public.listings%rowtype;
  shop public.sellers%rowtype;
  existing public.orders%rowtype;
  order_id uuid;
  address_snapshot jsonb;
begin
  if actor is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_request_id is null or p_quantity is null or p_quantity not between 1 and 999 or char_length(coalesce(p_note,'')) > 2000 then raise exception 'Invalid order parameters' using errcode = '22023'; end if;
  -- Один ключ запроса сериализует повторы, включая одновременную отправку с разных устройств.
  perform pg_advisory_xact_lock(hashtextextended(actor::text || ':' || p_request_id::text, 0));
  select * into existing from public.orders where buyer_id = actor and request_id = p_request_id;
  if found then
    if existing.request_payload <> jsonb_build_object('listing_id',p_listing_id,'quantity',p_quantity,'address_id',p_address_id,'note',coalesce(p_note,'')) then
      raise exception 'Request key already used for another order' using errcode = '22023';
    end if;
    return existing.id;
  end if;
  select * into item from public.listings where id = p_listing_id for share;
  if not found or item.status <> 'published' or item.purchase_mode not in ('purchase','both') or item.unit_price is null then raise exception 'Listing is not available for purchase' using errcode = '22023'; end if;
  select * into shop from public.sellers where id = item.seller_id for share;
  if not shop.is_published or shop.owner_id = actor then raise exception 'Seller is not available' using errcode = '22023'; end if;
  if p_address_id is not null then
    select jsonb_build_object('city', city, 'street', street) into address_snapshot from public.addresses where id = p_address_id and user_id = actor;
    if not found then raise exception 'Address is not available' using errcode = '42501'; end if;
  end if;
  insert into public.orders(buyer_id, seller_id, request_id, request_payload, total_amount, delivery_address, buyer_note)
  values(actor, item.seller_id, p_request_id, jsonb_build_object('listing_id',p_listing_id,'quantity',p_quantity,'address_id',p_address_id,'note',coalesce(p_note,'')), item.unit_price * p_quantity, address_snapshot, coalesce(p_note,'')) returning id into order_id;
  insert into public.order_items(order_id, listing_id, title, unit_label, quantity, unit_price) values(order_id, item.id, item.title, item.unit_label, p_quantity, item.unit_price);
  insert into public.order_events(order_id, actor_id, status) values(order_id, actor, 'pending');
  return order_id;
end;
$$;
revoke all on function private.place_order(uuid, integer, uuid, uuid, text) from public, anon;
grant execute on function private.place_order(uuid, integer, uuid, uuid, text) to authenticated;
create function public.place_order(p_listing_id uuid, p_quantity integer, p_request_id uuid, p_address_id uuid default null, p_note text default '')
returns uuid language sql security invoker set search_path = '' as $$ select private.place_order(p_listing_id,p_quantity,p_request_id,p_address_id,p_note); $$;
revoke all on function public.place_order(uuid, integer, uuid, uuid, text) from public, anon;
grant execute on function public.place_order(uuid, integer, uuid, uuid, text) to authenticated;

create function private.change_order_status(p_order_id uuid, p_status text) returns void language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); target public.orders%rowtype; seller_owner uuid;
begin
  if actor is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  select * into target from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order is not available' using errcode = '42501'; end if;
  select owner_id into seller_owner from public.sellers where id = target.seller_id;
  if actor <> target.buyer_id and actor <> seller_owner then raise exception 'Order is not available' using errcode = '42501'; end if;
  if target.status = p_status then return; end if;
  if not (
    (p_status = 'cancelled' and target.status in ('pending','confirmed')) or
    (actor = seller_owner and ((target.status = 'pending' and p_status = 'confirmed') or (target.status = 'confirmed' and p_status = 'in_progress') or (target.status = 'in_progress' and p_status = 'completed')))
  ) then raise exception 'Invalid order transition' using errcode = '22023'; end if;
  update public.orders set status = p_status where id = target.id;
  insert into public.order_events(order_id, actor_id, status) values(target.id, actor, p_status);
end;
$$;
revoke all on function private.change_order_status(uuid, text) from public, anon;
grant execute on function private.change_order_status(uuid, text) to authenticated;
create function public.change_order_status(p_order_id uuid, p_status text) returns void language sql security invoker set search_path = '' as $$ select private.change_order_status(p_order_id,p_status); $$;
revoke all on function public.change_order_status(uuid, text) from public, anon;
grant execute on function public.change_order_status(uuid, text) to authenticated;

-- Медиа закрыто по умолчанию; чтение фото разрешено только через доступную строку listing_images.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('listing-images','listing-images',false,10485760,array['image/jpeg','image/png','image/webp']);
create policy listing_media_read on storage.objects for select to anon, authenticated using (bucket_id = 'listing-images' and exists(select 1 from public.listing_images i where i.storage_path = name));
create policy listing_media_owner_read on storage.objects for select to authenticated using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy listing_media_insert on storage.objects for insert to authenticated with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy listing_media_update on storage.objects for update to authenticated using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text) with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy listing_media_delete on storage.objects for delete to authenticated using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
