CREATE OR REPLACE FUNCTION public.create_caregiver_link(p_elderly_user_id uuid)
RETURNS TABLE (id uuid, elderly_user_id uuid, created_at timestamp without time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '28000';
  END IF;
  IF p_elderly_user_id IS NULL OR p_elderly_user_id = auth.uid() THEN
    RAISE EXCEPTION 'invalid_elderly_id' USING ERRCODE = '23514';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = p_elderly_user_id) THEN
    RAISE EXCEPTION 'elderly_has_no_profile' USING ERRCODE = '23514';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND app_role IN ('caregiver', 'both')
  ) AND coalesce(auth.jwt() -> 'user_metadata' ->> 'app_role', 'elderly') NOT IN ('caregiver', 'both') THEN
    RAISE EXCEPTION 'not_a_caregiver_account' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  INSERT INTO public.caregiver_links (caregiver_user_id, elderly_user_id)
  VALUES (auth.uid(), p_elderly_user_id)
  RETURNING caregiver_links.id, caregiver_links.elderly_user_id, caregiver_links.created_at;
END;
$$;

REVOKE ALL ON FUNCTION public.create_caregiver_link(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_caregiver_link(uuid) TO authenticated;
