-- Keep a readable label on `public.profiles` in sync with Supabase Auth user metadata
-- (`raw_user_meta_data`: full_name / name / display_name). Caregivers can SELECT linked
-- elderly profile rows (see `profiles_select_for_linked_caregiver`) but cannot read Auth
-- for other users from the browser client.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text;

CREATE OR REPLACE FUNCTION public.extract_auth_display_name(p_meta jsonb)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NULLIF(
    trim(
      coalesce(
        p_meta ->> 'full_name',
        p_meta ->> 'name',
        p_meta ->> 'display_name',
        p_meta ->> 'username',
        ''
      )
    ),
    ''
  );
$$;

CREATE OR REPLACE FUNCTION public.sync_profile_full_name_from_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_name text;
BEGIN
  v_name := public.extract_auth_display_name(NEW.raw_user_meta_data);
  IF v_name IS NULL THEN
    RETURN NEW;
  END IF;

  UPDATE public.profiles p
  SET full_name = v_name
  WHERE p.user_id = NEW.id
    AND (p.full_name IS DISTINCT FROM v_name);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_full_name_sync_on_auth_users ON auth.users;
CREATE TRIGGER profiles_full_name_sync_on_auth_users
AFTER INSERT OR UPDATE OF raw_user_meta_data ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.sync_profile_full_name_from_auth();

CREATE OR REPLACE FUNCTION public.sync_my_profile_full_name_from_auth()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_name text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '28000';
  END IF;

  SELECT public.extract_auth_display_name(u.raw_user_meta_data)
  INTO v_name
  FROM auth.users u
  WHERE u.id = auth.uid();

  IF v_name IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.profiles p
  SET full_name = v_name
  WHERE p.user_id = auth.uid()
    AND (p.full_name IS DISTINCT FROM v_name);
END;
$$;

REVOKE ALL ON FUNCTION public.sync_my_profile_full_name_from_auth() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_my_profile_full_name_from_auth() TO authenticated;
