-- Запускается одной транзакцией: все фикстуры, аккаунты и заказы откатываются.
begin;
create temporary table qa_ids (owner uuid, buyer uuid, stranger uuid, seller uuid, listing uuid, draft uuid, request uuid, conversation uuid, order_id uuid);
insert into qa_ids values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),null);
grant select, update on qa_ids to authenticated, anon;
insert into auth.users(id, raw_user_meta_data)
select owner, '{"full_name":"QA seller","role":"admin"}'::jsonb from qa_ids union all
select buyer, '{"full_name":"QA buyer"}'::jsonb from qa_ids union all
select stranger, '{"full_name":"QA stranger"}'::jsonb from qa_ids;
insert into public.categories(id,name) values('__qa_category','QA');
insert into public.subcategories(id,category_id,name) values('__qa_subcategory','__qa_category','QA');
insert into public.sellers(id,owner_id,name,kind,location,is_published) select seller,owner,'QA shop','store','QA',true from qa_ids;
insert into public.listings(id,seller_id,subcategory_id,kind,title,description,purchase_mode,unit_price,status)
select listing,seller,'__qa_subcategory','product','QA product','QA description','both',19.99,'published' from qa_ids union all
select draft,seller,'__qa_subcategory','service','QA draft','QA description','negotiation',null,'draft' from qa_ids;
insert into public.addresses(id,user_id,city,street) select listing,buyer,'QA','Buyer address' from qa_ids union all select draft,owner,'QA','Private seller address' from qa_ids;

set local role anon;
do $$ begin
  if (select count(*) from public.listings where id in (select listing from qa_ids union all select draft from qa_ids)) <> 1 then raise exception 'Anon can see private listing'; end if;
  begin perform count(*) from public.profiles; raise exception 'Anon profile leak'; exception when insufficient_privilege then null; end;
  begin perform public.place_order((select listing from qa_ids),1,(select request from qa_ids)); raise exception 'Anonymous order allowed'; exception when insufficient_privilege then null; end;
end; $$;
reset role;
select set_config('request.jwt.claim.sub',(select buyer::text from qa_ids),true);
set local role authenticated;
do $$ declare created uuid; repeated uuid; begin
  if (select count(*) from public.profiles) <> 1 then raise exception 'Private profiles leaked'; end if;
  if (select count(*) from public.addresses where id in (select listing from qa_ids union all select draft from qa_ids)) <> 1 then raise exception 'Other address leaked'; end if;
  begin perform public.place_order((select listing from qa_ids),1,gen_random_uuid(),(select draft from qa_ids)); raise exception 'Foreign address used'; exception when insufficient_privilege then null; end;
  begin insert into public.favorites(user_id,listing_id) select owner,listing from qa_ids; raise exception 'Other favorites changed'; exception when insufficient_privilege then null; end;
  update public.profiles set full_name='intruder' where id=(select owner from qa_ids);
  if found then raise exception 'Other profile updated'; end if;
  begin insert into public.sellers(owner_id,name,kind,location) values((select owner from qa_ids),'Hijack','store','QA'); raise exception 'Seller ownership hijack'; exception when insufficient_privilege then null; end;
  begin update public.listings set unit_price=1 where id=(select listing from qa_ids); if found then raise exception 'Buyer changed price'; end if; exception when insufficient_privilege then null; end;
  begin perform public.place_order((select listing from qa_ids),0,gen_random_uuid()); raise exception 'Zero quantity allowed'; exception when invalid_parameter_value then null; end;
  begin perform public.place_order((select listing from qa_ids),1000,gen_random_uuid()); raise exception 'Excess quantity allowed'; exception when invalid_parameter_value then null; end;
  begin perform public.place_order((select draft from qa_ids),1,gen_random_uuid()); raise exception 'Draft purchased'; exception when invalid_parameter_value then null; end;
  created := public.place_order((select listing from qa_ids),3,(select request from qa_ids));
  repeated := public.place_order((select listing from qa_ids),3,(select request from qa_ids));
  if created <> repeated then raise exception 'Duplicate order'; end if;
  update qa_ids set order_id=created;
  if (select total_amount from public.orders where id=created) <> 59.97 then raise exception 'Incorrect total'; end if;
  if (select count(*) from public.order_items where order_id=created) <> 1 then raise exception 'Duplicate order items'; end if;
  begin perform public.place_order((select listing from qa_ids),4,(select request from qa_ids)); raise exception 'Idempotency key reused for other request'; exception when invalid_parameter_value then null; end;
  begin update public.orders set total_amount=1 where id=created; raise exception 'Order price overwritten'; exception when insufficient_privilege then null; end;
  begin perform public.change_order_status(created,'completed'); raise exception 'Buyer completed order'; exception when invalid_parameter_value then null; end;
  insert into public.conversations(id,buyer_id,seller_id,listing_id) select conversation,buyer,seller,listing from qa_ids;
  insert into public.messages(conversation_id,sender_id,body) select conversation,buyer,'Hello seller' from qa_ids;
  begin insert into public.messages(conversation_id,sender_id,body) select conversation,owner,'Forged sender' from qa_ids; raise exception 'Message sender spoofed'; exception when insufficient_privilege then null; end;
end; $$;
reset role;
select set_config('request.jwt.claim.sub',(select stranger::text from qa_ids),true);
set local role authenticated;
do $$ begin
  if exists(select 1 from public.orders where id=(select order_id from qa_ids)) then raise exception 'Other order leaked'; end if;
  if exists(select 1 from public.order_items where order_id=(select order_id from qa_ids)) then raise exception 'Order items leaked'; end if;
  if exists(select 1 from public.messages where conversation_id=(select conversation from qa_ids)) then raise exception 'Messages leaked'; end if;
  begin insert into public.messages(conversation_id,sender_id,body) select conversation,stranger,'Unauthorized message' from qa_ids; raise exception 'Stranger sent message'; exception when insufficient_privilege then null; end;
  begin perform public.change_order_status((select order_id from qa_ids),'cancelled'); raise exception 'Stranger cancelled order'; exception when insufficient_privilege then null; end;
end; $$;
reset role;
select set_config('request.jwt.claim.sub',(select owner::text from qa_ids),true);
set local role authenticated;
do $$ begin
  if not exists(select 1 from public.listings where id=(select draft from qa_ids)) then raise exception 'Seller lost own draft'; end if;
  if not exists(select 1 from public.orders where id=(select order_id from qa_ids)) then raise exception 'Seller cannot see order'; end if;
  if not exists(select 1 from public.messages where conversation_id=(select conversation from qa_ids)) then raise exception 'Seller cannot read messages'; end if;
  update public.listings set unit_price=99 where id=(select listing from qa_ids);
  begin update public.listings set unit_price='NaN'::numeric where id=(select listing from qa_ids); raise exception 'NaN price allowed'; exception when check_violation then null; end;
  if (select unit_price from public.order_items where order_id=(select order_id from qa_ids)) <> 19.99 then raise exception 'Price snapshot changed'; end if;
  begin perform public.place_order((select listing from qa_ids),1,gen_random_uuid()); raise exception 'Seller bought own listing'; exception when invalid_parameter_value then null; end;
  perform public.change_order_status((select order_id from qa_ids),'confirmed');
  perform public.change_order_status((select order_id from qa_ids),'in_progress');
  perform public.change_order_status((select order_id from qa_ids),'completed');
  begin perform public.change_order_status((select order_id from qa_ids),'pending'); raise exception 'Invalid reverse transition'; exception when invalid_parameter_value then null; end;
  if (select count(*) from public.order_events where order_id=(select order_id from qa_ids)) <> 4 then raise exception 'Missing order audit'; end if;
end; $$;
reset role;
rollback;
