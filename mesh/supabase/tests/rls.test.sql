-- MESH RLS / integrity tests. Run via supabase/tests/run.sh (never on production).
\set ON_ERROR_STOP 1

create schema test;
grant usage on schema test to authenticated, anon;

create function test.as_user(p_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', coalesce(p_uid::text, ''), false);
  if p_uid is null then
    execute 'set role anon';
  else
    execute 'set role authenticated';
  end if;
end $$;

-- Asserts that running p_sql fails (any error). Returns the error message.
create function test.expect_fail(p_label text, p_sql text) returns void language plpgsql as $$
begin
  begin
    execute p_sql;
  exception when others then
    raise notice 'ok   - % (%)', p_label, sqlerrm;
    return;
  end;
  raise exception 'FAIL - % : statement unexpectedly succeeded', p_label;
end $$;

create function test.expect_eq(p_label text, p_actual bigint, p_expected bigint) returns void language plpgsql as $$
begin
  if p_actual is distinct from p_expected then
    raise exception 'FAIL - % : expected %, got %', p_label, p_expected, p_actual;
  end if;
  raise notice 'ok   - %', p_label;
end $$;

grant execute on all functions in schema test to authenticated, anon;

-- Fixtures (as superuser): four users. Profiles are created by the auth trigger.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'alice@example.test'),
  ('00000000-0000-0000-0000-00000000000b', 'bob@example.test'),
  ('00000000-0000-0000-0000-00000000000c', 'carol@example.test'),
  ('00000000-0000-0000-0000-00000000000d', 'dan@example.test');

select test.expect_eq('auth trigger creates profiles', (select count(*) from public.profiles), 4);

-- ---------------------------------------------------------------- anon
select test.as_user(null);
select test.expect_fail('anon cannot read projects', 'select * from public.projects');
select test.expect_fail('anon cannot read profiles', 'select * from public.profiles');
select test.expect_fail('anon cannot call discover', 'select * from public.discover_projects()');
reset role;

-- ---------------------------------------------------------------- onboarding
select test.as_user('00000000-0000-0000-0000-00000000000a');
select test.expect_fail('cannot onboard with missing essentials',
  $$update public.profiles set onboarded = true where id = auth.uid()$$);
update public.profiles set full_name = 'Alice', roles = '{founder}', availability = 'full_time',
  commitment = 'all_in', interests = '{climate}', skills = '{product}', onboarded = true
  where id = auth.uid();
select test.expect_eq('alice onboarded', (select count(*) from public.profiles where onboarded), 1);
select test.expect_fail('cannot use unknown role',
  $$update public.profiles set roles = '{wizard}' where id = auth.uid()$$);
update public.profiles set full_name = 'Hacked' where id = '00000000-0000-0000-0000-00000000000b';
reset role;
select test.expect_eq('cannot update another profile',
  (select count(*) from public.profiles where full_name = 'Hacked'), 0);

select test.as_user('00000000-0000-0000-0000-00000000000b');
update public.profiles set full_name = 'Bob', roles = '{builder}', availability = 'part_time',
  commitment = 'side_project', onboarded = true where id = auth.uid();
reset role;
select test.as_user('00000000-0000-0000-0000-00000000000c');
update public.profiles set full_name = 'Carol', roles = '{investor}', availability = 'advisory',
  commitment = 'exploring', onboarded = true where id = auth.uid();
-- carol sees onboarded profiles + her own, not dan (not onboarded)
select test.expect_eq('profiles visible to carol', (select count(*) from public.profiles), 3);
reset role;

-- ---------------------------------------------------------------- projects
select test.as_user('00000000-0000-0000-0000-00000000000a');
insert into public.projects (owner_id, title, problem, solution, industry, stage, roles_needed, location)
values (auth.uid(), 'Alice Public', 'A real problem statement', 'A real solution statement', 'climate', 'idea',
        '{engineer}', 'Paris, France');
insert into public.projects (owner_id, title, problem, solution, industry, stage, roles_needed, visibility)
values (auth.uid(), 'Alice Private', 'A real problem statement', 'A real solution statement', 'fintech', 'mvp',
        '{designer}', 'private');
select test.expect_fail('cannot create project for someone else',
  $$insert into public.projects (owner_id, title, problem, solution, industry, stage, roles_needed)
    values ('00000000-0000-0000-0000-00000000000b', 'Spoof', 'A real problem statement',
            'A real solution statement', 'climate', 'idea', '{engineer}')$$);
select test.expect_fail('cannot create demo project',
  $$insert into public.projects (owner_id, is_demo, title, problem, solution, industry, stage, roles_needed)
    values (auth.uid(), true, 'Fake demo', 'A real problem statement',
            'A real solution statement', 'climate', 'idea', '{engineer}')$$);
select test.expect_fail('cannot transfer ownership',
  $$update public.projects set owner_id = '00000000-0000-0000-0000-00000000000b' where title = 'Alice Public'$$);
select test.expect_fail('project needs at least one role',
  $$insert into public.projects (owner_id, title, problem, solution, industry, stage, roles_needed)
    values (auth.uid(), 'No roles', 'A real problem statement', 'A real solution statement', 'climate', 'idea', '{}')$$);
-- Alice's feed excludes her own projects; shows 6 demo projects
select test.expect_eq('alice feed excludes own', (select count(*) from public.discover_projects()), 6);
reset role;

select test.as_user('00000000-0000-0000-0000-00000000000b');
select test.expect_eq('bob sees public + demo, not private',
  (select count(*) from public.projects), 7);
select test.expect_eq('bob feed', (select count(*) from public.discover_projects()), 7);
select test.expect_eq('feed filter industry', (select count(*) from public.discover_projects(p_industry => 'climate')), 2);
select test.expect_eq('feed filter role', (select count(*) from public.discover_projects(p_role => 'engineer')), 3);
select test.expect_eq('feed filter location', (select count(*) from public.discover_projects(p_location => 'paris')), 1);
select test.expect_eq('feed location wildcard escaped', (select count(*) from public.discover_projects(p_location => '%')), 0);
update public.projects set title = 'Pwned' where title = 'Alice Public';
delete from public.projects where title = 'Alice Public';
reset role;
select test.expect_eq('bob cannot edit/delete alice project',
  (select count(*) from public.projects where title = 'Alice Public'), 1);

-- ---------------------------------------------------------------- passes
select test.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.passes (project_id) select id from public.projects where title = 'Demo · Gridnest';
select test.expect_eq('pass hides project from feed', (select count(*) from public.discover_projects()), 6);
reset role;
select test.as_user('00000000-0000-0000-0000-00000000000a');
select test.expect_fail('cannot pass own project',
  $$insert into public.passes (project_id) select id from public.projects where title = 'Alice Public'$$);
reset role;

-- ---------------------------------------------------------------- requests
select set_config('test.private_id', (select id::text from public.projects where title = 'Alice Private'), false);
select test.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.match_requests (project_id, note)
  select id, 'I would love to help' from public.projects where title = 'Alice Public';
select test.expect_eq('request created as pending',
  (select count(*) from public.match_requests where status = 'pending'
     and project_owner_id = '00000000-0000-0000-0000-00000000000a'), 1);
select test.expect_eq('requested project leaves feed', (select count(*) from public.discover_projects()), 5);
select test.expect_fail('duplicate request blocked',
  $$insert into public.match_requests (project_id) select id from public.projects where title = 'Alice Public'$$);
select test.expect_fail('demo projects cannot receive requests',
  $$insert into public.match_requests (project_id) select id from public.projects where title = 'Demo · Ledgerleaf'$$);
select test.expect_fail('cannot request private project by id',
  $$insert into public.match_requests (project_id) values (current_setting('test.private_id')::uuid)$$);
select test.expect_fail('cannot spoof sender',
  $$insert into public.match_requests (project_id, sender_id)
    select id, '00000000-0000-0000-0000-00000000000c' from public.projects where title = 'Alice Public'$$);
update public.match_requests set status = 'accepted';  -- RLS: silently matches 0 rows
reset role;
select test.expect_eq('still pending after sender update attempt',
  (select count(*) from public.match_requests where status = 'pending'), 1);

select test.as_user('00000000-0000-0000-0000-00000000000a');
select test.expect_fail('owner cannot request own project',
  $$insert into public.match_requests (project_id) select id from public.projects where title = 'Alice Public'$$);
select test.expect_eq('owner sees incoming request', (select count(*) from public.match_requests), 1);
select test.expect_fail('owner cannot rewrite note',
  $$update public.match_requests set note = 'edited'$$);
reset role;

-- carol requests too; alice will reject her
select test.as_user('00000000-0000-0000-0000-00000000000c');
insert into public.match_requests (project_id) select id from public.projects where title = 'Alice Public';
select test.expect_eq('carol cannot see bob request', (select count(*) from public.match_requests), 1);
reset role;

-- dan (not onboarded) — owners still see the profile of anyone who requested
select test.as_user('00000000-0000-0000-0000-00000000000d');
insert into public.match_requests (project_id) select id from public.projects where title = 'Alice Public';
reset role;
select test.as_user('00000000-0000-0000-0000-00000000000a');
select test.expect_eq('owner sees requester profile even if not onboarded',
  (select count(*) from public.profiles where id = '00000000-0000-0000-0000-00000000000d'), 1);
reset role;

select set_config('test.bob_match', (select id::text from public.match_requests
  where sender_id = '00000000-0000-0000-0000-00000000000b'), false);
-- ---------------------------------------------------------------- messaging gate
select test.as_user('00000000-0000-0000-0000-00000000000b');
select test.expect_fail('no messages before acceptance',
  $$insert into public.messages (match_id, body) select id, 'hi' from public.match_requests$$);
reset role;

select test.as_user('00000000-0000-0000-0000-00000000000a');
update public.match_requests set status = 'accepted' where sender_id = '00000000-0000-0000-0000-00000000000b';
update public.match_requests set status = 'rejected' where sender_id = '00000000-0000-0000-0000-00000000000c';
select test.expect_fail('decisions are final',
  $$update public.match_requests set status = 'pending' where sender_id = '00000000-0000-0000-0000-00000000000b'$$);
select test.expect_fail('cannot flip a rejection',
  $$update public.match_requests set status = 'accepted' where sender_id = '00000000-0000-0000-0000-00000000000c'$$);
insert into public.messages (match_id, body)
  select id, 'Welcome aboard!' from public.match_requests where sender_id = '00000000-0000-0000-0000-00000000000b';
reset role;
select test.expect_eq('responded_at stamped',
  (select count(*) from public.match_requests where responded_at is not null), 2);

select test.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.messages (match_id, body) select id, 'Thanks Alice!' from public.match_requests;
select test.expect_eq('bob reads thread', (select count(*) from public.messages), 2);
select test.expect_fail('cannot spoof message sender',
  $$insert into public.messages (match_id, body, sender_id)
    select id, 'spoof', '00000000-0000-0000-0000-00000000000a' from public.match_requests$$);
select test.expect_fail('empty message rejected',
  $$insert into public.messages (match_id, body) select id, '   ' from public.match_requests$$);
reset role;

select test.as_user('00000000-0000-0000-0000-00000000000c');
select test.expect_eq('rejected user cannot read thread', (select count(*) from public.messages), 0);
select test.expect_fail('rejected user cannot message',
  $$insert into public.messages (match_id, body) select id, 'please?' from public.match_requests$$);
select test.expect_fail('outsider cannot inject into other match',
  $$insert into public.messages (match_id, body)
    values (current_setting('test.bob_match')::uuid, 'intrude')$$);
reset role;

-- ---------------------------------------------------------------- private visibility after match
select test.as_user('00000000-0000-0000-0000-00000000000a');
update public.projects set visibility = 'private' where title = 'Alice Public';
reset role;
select test.as_user('00000000-0000-0000-0000-00000000000b');
select test.expect_eq('matched user still sees now-private project',
  (select count(*) from public.projects where title = 'Alice Public'), 1);
reset role;
select test.as_user('00000000-0000-0000-0000-00000000000c');
select test.expect_eq('rejected user cannot see private project',
  (select count(*) from public.projects where title = 'Alice Public'), 0);
reset role;

-- ---------------------------------------------------------------- withdraw
select test.as_user('00000000-0000-0000-0000-00000000000d');
delete from public.match_requests;
select test.expect_eq('sender can withdraw pending', (select count(*) from public.match_requests), 0);
reset role;
select test.as_user('00000000-0000-0000-0000-00000000000b');
delete from public.match_requests;
select test.expect_eq('accepted match cannot be withdrawn', (select count(*) from public.match_requests), 1);
reset role;
