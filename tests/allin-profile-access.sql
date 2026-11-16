begin;
create temporary table qa_profile_user(id uuid);
insert into qa_profile_user values(gen_random_uuid());
grant select on qa_profile_user to authenticated;
insert into auth.users(id) select id from qa_profile_user;
select set_config('request.jwt.claim.sub',(select id::text from qa_profile_user),true);
set local role authenticated;
insert into allin.profiles(id,full_name) select id,'QA self-created' from qa_profile_user;
do $$ begin
 if (select count(*) from allin.profiles) <> 1 then raise exception 'Self-created profile is unavailable'; end if;
 begin
  insert into allin.profiles(id,full_name) values(gen_random_uuid(),'Wrong owner');
  raise exception 'Foreign profile creation allowed';
 exception when insufficient_privilege then null;
 end;
end; $$;
reset role;
rollback;
