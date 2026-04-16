-- Caregivers cannot read other users' Auth from the client. Expose display labels only for
-- users explicitly linked in `caregiver_links` (same pattern as `create_caregiver_link`).
-- Display name matches Supabase Auth user metadata: full_name, name, display_name, username.

CREATE OR REPLACE FUNCTION public.get_care_recipient_display_names_for_caregiver()
RETURNS TABLE (elderly_user_id uuid, display_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT
    cl.elderly_user_id,
    NULLIF(
      trim(
        coalesce(
          u.raw_user_meta_data ->> 'full_name',
          u.raw_user_meta_data ->> 'name',
          u.raw_user_meta_data ->> 'display_name',
          u.raw_user_meta_data ->> 'username',
          ''
        )
      ),
      ''
    ) AS display_name
  FROM public.caregiver_links cl
  INNER JOIN auth.users u ON u.id = cl.elderly_user_id
  WHERE cl.caregiver_user_id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_care_recipient_display_names_for_caregiver() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_care_recipient_display_names_for_caregiver() TO authenticated;
