-- =====================================================================
-- Correctif sécurité Compta+ (lot 1) — À EXÉCUTER SUR TEST UNIQUEMENT
-- Projet TEST uniquement. Vérifiez l'identifiant du projet dans l'URL
-- avant de coller ce script. Ne pas exécuter sur PROD avant validation.
-- Exécuter tout le script d'un coup ; en cas d'erreur, rien n'est appliqué
-- (transaction).
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Droits du rôle anonyme (non connecté)
--    Par défaut Supabase donne à anon tous les droits sur les tables.
--    On retire tout, puis on rend seulement ce qui sert aux visiteurs.
-- ---------------------------------------------------------------------
revoke all on all tables in schema public from anon;

-- Vue publique des tarifs (page de prix, lecture sans connexion)
grant select on public.prix_forfaits_publics to anon, authenticated;

-- Inscriptions échouées : l'insertion anonyme est limitée par trigger
grant insert on public.signup_failures to anon;

-- Fonctions d'appartenance : inutiles pour un visiteur non connecté
revoke execute on function public.is_company_member(uuid)       from anon;
revoke execute on function public.is_company_admin(uuid)        from anon;
revoke execute on function public.compta_can_edit(uuid)         from anon;
revoke execute on function public.compta_can_adjust(uuid)       from anon;
revoke execute on function public.compta_is_member(uuid)        from anon;
revoke execute on function public.my_company_role(uuid)         from anon;
revoke execute on function public.get_my_company_ids()          from anon;
revoke execute on function public.get_my_admin_company_ids()    from anon;
revoke execute on function public.get_my_editor_company_ids()   from anon;
revoke execute on function public.my_owned_group_ids()          from anon;
revoke execute on function public.my_owned_group_company_ids()  from anon;
revoke execute on function public.is_management_collaborator()  from anon;

-- ---------------------------------------------------------------------
-- 2. Vente : un membre en « Lecture seule » ne peut pas décrémenter le stock
--    (contrôle ajouté, reste identique à la version actuelle)
-- ---------------------------------------------------------------------
create or replace function public.commit_sale_stock(target_company_id uuid, sale_lines jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public', 'pg_temp'
as $function$
declare
  current_data jsonb;
  current_version int;
  line jsonb;
  prod jsonb;
  prod_stock numeric;
  insufficient jsonb := '[]'::jsonb;
  updated_data jsonb;
begin
  if not is_company_member(target_company_id) then
    raise exception 'Accès refusé';
  end if;
  if my_company_role(target_company_id) = 'Lecture seule' then
    raise exception 'Accès refusé : rôle en lecture seule';
  end if;

  select (value::jsonb -> 'data'), coalesce((value::jsonb ->> 'v')::int, 0)
  into current_data, current_version
  from kv_store
  where key = 'compta-products' and company_id = target_company_id
  for update;

  if current_data is null then
    raise exception 'Catalogue introuvable pour cette entreprise';
  end if;

  for line in select * from jsonb_array_elements(sale_lines)
  loop
    select elem into prod
    from jsonb_array_elements(current_data) elem
    where (elem->>'id')::bigint = (line->>'productId')::bigint;

    if prod is not null and (prod->>'type') = 'marchandise' then
      prod_stock := coalesce((prod->>'stock')::numeric, 0);
      if prod_stock < (line->>'qty')::numeric then
        insufficient := insufficient || jsonb_build_object(
          'productId', (line->>'productId')::bigint,
          'name', prod->>'name',
          'available', prod_stock,
          'requested', (line->>'qty')::numeric
        );
      end if;
    end if;
  end loop;

  if jsonb_array_length(insufficient) > 0 then
    return jsonb_build_object('ok', false, 'insufficient', insufficient);
  end if;

  select jsonb_agg(
    case
      when exists (
        select 1 from jsonb_array_elements(sale_lines) l
        where (l->>'productId')::bigint = (elem->>'id')::bigint
      )
      then jsonb_set(
        elem, '{stock}',
        to_jsonb(
          greatest(0, coalesce((elem->>'stock')::numeric, 0) - (
            select coalesce(sum((l->>'qty')::numeric), 0)
            from jsonb_array_elements(sale_lines) l
            where (l->>'productId')::bigint = (elem->>'id')::bigint
          ))
        )
      )
      else elem
    end
  )
  into updated_data
  from jsonb_array_elements(current_data) elem;

  update kv_store
  set value = jsonb_set(jsonb_set(value::jsonb, '{data}', updated_data), '{v}', to_jsonb(current_version + 1))
  where key = 'compta-products' and company_id = target_company_id;

  return jsonb_build_object('ok', true);
end;
$function$;

create or replace function public.commit_sale_stock(target_company_id uuid, sale_lines jsonb, p_invoice_id bigint, p_invoice_number text, p_date text)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public', 'pg_temp'
as $function$
declare
  current_data jsonb;
  current_version int;
  line jsonb;
  prod jsonb;
  prod_stock numeric;
  insufficient jsonb := '[]'::jsonb;
  updated_data jsonb;
  new_movements jsonb := '[]'::jsonb;
  mv_data jsonb;
  mv_version int;
  base_id bigint := (extract(epoch from clock_timestamp()) * 1000)::bigint;
  i int := 0;
begin
  if not is_company_member(target_company_id) then
    raise exception 'Accès refusé';
  end if;
  if my_company_role(target_company_id) = 'Lecture seule' then
    raise exception 'Accès refusé : rôle en lecture seule';
  end if;

  select (value::jsonb -> 'data'), coalesce((value::jsonb ->> 'v')::int, 0)
  into current_data, current_version
  from kv_store
  where key = 'compta-products' and company_id = target_company_id
  for update;

  if current_data is null then
    raise exception 'Catalogue introuvable pour cette entreprise';
  end if;

  for line in select * from jsonb_array_elements(sale_lines)
  loop
    select elem into prod
    from jsonb_array_elements(current_data) elem
    where (elem->>'id')::bigint = (line->>'productId')::bigint;

    if prod is not null and (prod->>'type') = 'marchandise' then
      prod_stock := coalesce((prod->>'stock')::numeric, 0);
      if prod_stock < (line->>'qty')::numeric then
        insufficient := insufficient || jsonb_build_object(
          'productId', (line->>'productId')::bigint,
          'name', prod->>'name',
          'available', prod_stock,
          'requested', (line->>'qty')::numeric
        );
      end if;
    end if;
  end loop;

  if jsonb_array_length(insufficient) > 0 then
    return jsonb_build_object('ok', false, 'insufficient', insufficient);
  end if;

  select jsonb_agg(
    case
      when exists (
        select 1 from jsonb_array_elements(sale_lines) l
        where (l->>'productId')::bigint = (elem->>'id')::bigint
      )
      then jsonb_set(
        elem, '{stock}',
        to_jsonb(
          greatest(0, coalesce((elem->>'stock')::numeric, 0) - (
            select coalesce(sum((l->>'qty')::numeric), 0)
            from jsonb_array_elements(sale_lines) l
            where (l->>'productId')::bigint = (elem->>'id')::bigint
          ))
        )
      )
      else elem
    end
  )
  into updated_data
  from jsonb_array_elements(current_data) elem;

  update kv_store
  set value = jsonb_set(jsonb_set(value::jsonb, '{data}', updated_data), '{v}', to_jsonb(current_version + 1))
  where key = 'compta-products' and company_id = target_company_id;

  for line in select * from jsonb_array_elements(sale_lines)
  loop
    select elem into prod
    from jsonb_array_elements(current_data) elem
    where (elem->>'id')::bigint = (line->>'productId')::bigint;

    if prod is not null and (prod->>'type') = 'marchandise' then
      new_movements := new_movements || jsonb_build_object(
        'id', base_id + i,
        'invoiceId', p_invoice_id,
        'date', p_date,
        'productId', (line->>'productId')::bigint,
        'productName', prod->>'name',
        'type', 'sortie',
        'qty', (line->>'qty')::numeric,
        'reason', 'Vente ' || p_invoice_number
      );
      i := i + 1;
    end if;
  end loop;

  if jsonb_array_length(new_movements) > 0 then
    select (value::jsonb -> 'data'), coalesce((value::jsonb ->> 'v')::int, 0)
    into mv_data, mv_version
    from kv_store
    where key = 'compta-movements' and company_id = target_company_id
    for update;

    update kv_store
    set value = jsonb_set(jsonb_set(value::jsonb, '{data}', coalesce(mv_data, '[]'::jsonb) || new_movements), '{v}', to_jsonb(mv_version + 1))
    where key = 'compta-movements' and company_id = target_company_id;
  end if;

  return jsonb_build_object('ok', true);
end;
$function$;

-- ---------------------------------------------------------------------
-- 3. billing_settings : les membres ne lisent plus la table complète
--    (coordonnées de paiement, modèles de relance). Les tarifs passent
--    par la vue prix_forfaits_publics. Les administrateurs de plateforme
--    gardent leur accès (politique « platform admins billing_settings »).
-- ---------------------------------------------------------------------
drop policy if exists "members read billing_settings" on public.billing_settings;

-- Vue pour l'espace entreprise (onglet Abonnement et factures, administrateur) :
-- émetteur, informations de paiement et tarifs, sans les modèles de relance.
create or replace view public.billing_issuer_public as
select id, issuer_name, issuer_address, issuer_phone, issuer_email, issuer_nif,
       logo, thanks, payment_info, vat_enabled, vat_rate, rate_htg_per_usd,
       prices, grid, brh_rate, brh_rate_date
from public.billing_settings
where id = 1;

grant select on public.billing_issuer_public to authenticated;

commit;

-- =====================================================================
-- RETOUR ARRIÈRE (si un test échoue sur TEST) — à exécuter séparément
-- =====================================================================
-- grant all on all tables in schema public to anon;
-- create policy "members read billing_settings" on public.billing_settings
--   for select to public using (auth.uid() is not null);
-- grant execute on function public.is_company_member(uuid), public.is_company_admin(uuid),
--   public.compta_can_edit(uuid), public.compta_can_adjust(uuid), public.compta_is_member(uuid),
--   public.my_company_role(uuid), public.get_my_company_ids(), public.get_my_admin_company_ids(),
--   public.get_my_editor_company_ids(), public.my_owned_group_ids(), public.my_owned_group_company_ids(),
--   public.is_management_collaborator() to anon;

-- =====================================================================
-- CONTRÔLES À FAIRE SUR TEST APRÈS EXÉCUTION
-- =====================================================================
-- 1. Page de prix visible sans connexion (vue prix_forfaits_publics).
-- 2. Inscription d'un nouveau compte (signup_failures en cas d'échec).
-- 3. Connexion d'un administrateur d'entreprise : ses factures d'abonnement
--    s'affichent-elles avec les coordonnées de l'émetteur ? Si non, il faut
--    prévoir une vue dédiée (colonnes de l'émetteur) avant PROD.
-- 4. Vente avec un compte Vendeur : la vente et les écritures sont créées.
-- 5. Vente avec un compte « Lecture seule » : le serveur refuse.
-- 6. Super Admin > Facturation : les réglages s'ouvrent et s'enregistrent.
-- 7. Le module Groupe s'affiche (appartenance via is_company_member, etc.).
