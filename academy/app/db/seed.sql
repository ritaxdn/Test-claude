-- Données d'exemple pour le développement et les tests (ne pas appliquer en production).
insert into device_models (name, family) values
  ('HANOVER 5G', 'Lasers'), ('LA QUEEN', 'Lasers'), ('SEVENWAVES', 'Lasers'), ('DERMABRASIF 6G', 'Rajeunissement cutané'), ('SLIMAX LIPO 7', 'Amincissement')
on conflict (name) do nothing;

insert into programs (slug, title, summary, device_model_id, published)
select 'hanover-5g', 'HANOVER 5G — Programme opérateur',
       'De la physique au protocole : des traitements sûrs et reproductibles avec la plateforme HANOVER 5G. (Contenu d''exemple.)',
       id, true from device_models where name = 'HANOVER 5G'
on conflict (slug) do nothing;

with p as (select id from programs where slug = 'hanover-5g')
insert into modules (program_id, position, title)
select p.id, x.pos, x.title from p, (values (1, 'Prise en main'), (2, 'Protocoles')) as x(pos, title)
where not exists (select 1 from modules m where m.program_id = p.id);

with m as (select m.id, m.position from modules m join programs p on p.id = m.program_id where p.slug = 'hanover-5g')
insert into lessons (module_id, position, title, video_ref, duration_sec, body)
select m.id, x.pos, x.title, x.video, 12, x.body from m join (values
  (1, 1, 'Bienvenue et déroulé du parcours', 'lecon-1.webm', 'Ce parcours suit l''ordre des leçons : chacune s''ouvre lorsque la précédente est terminée.'),
  (1, 2, 'Sécurité et préparation de la salle', 'lecon-2.webm', 'Lunettes adaptées à la longueur d''onde pour toutes les personnes présentes, contrôle quotidien de l''appareil.'),
  (2, 1, 'Protocole et paramètres par phototype', 'lecon-3.webm', 'Test préalable, lecture de la réaction, adaptation des paramètres au phototype.')
) as x(mpos, pos, title, video, body) on x.mpos = m.position
where not exists (select 1 from lessons l where l.module_id = m.id);

insert into documents (program_id, title, storage_key, mime_type)
select p.id, 'Fiche protocole HANOVER 5G (exemple)', 'exemple/fiche-protocole.pdf', 'application/pdf' from programs p
where p.slug = 'hanover-5g' and not exists (select 1 from documents d where d.program_id = p.id);

-- Leçons d'exemple présentées par le Dr Dadoun (contenu d'exemple, à remplacer par les vraies vidéos).
update lessons l set presenter_id = (select id from presenters where name = 'Dr Mohamed Dadoun')
  from modules m join programs p on p.id = m.program_id
 where l.module_id = m.id and p.slug = 'hanover-5g' and l.presenter_id is null;
