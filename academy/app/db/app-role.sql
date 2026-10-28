-- Compte de connexion de l'application (Vercel) : lit et écrit les données de l'Academy, rien d'autre.
-- Pas de mot de passe ici : il est défini par Cellulift dans l'éditeur SQL de Supabase
--   alter role academy_app with password '...';
-- La structure (tables, migrations) reste gérée par le compte propriétaire.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'academy_app') then
    create role academy_app login noinherit;
  end if;
end $$;

grant usage on schema public to academy_app;
grant select, insert, update, delete on all tables in schema public to academy_app;
grant usage, select on all sequences in schema public to academy_app;
alter default privileges in schema public grant select, insert, update, delete on tables to academy_app;
alter default privileges in schema public grant usage, select on sequences to academy_app;

-- Le RLS ferme l'API automatique de Supabase ; ce compte-là y a accès complet (c'est le serveur de l'app).
do $$
declare t text;
begin
  foreach t in array array['users','auth_tokens','sessions','login_attempts','device_models','device_ownerships','presenters',
                           'programs','modules','lessons','documents','entitlements','lesson_progress','audit_log'] loop
    execute format('drop policy if exists academy_app_all on %I', t);
    execute format('create policy academy_app_all on %I for all to academy_app using (true) with check (true)', t);
  end loop;
end $$;
