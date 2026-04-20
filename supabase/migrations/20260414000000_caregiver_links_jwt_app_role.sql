DROP POLICY IF EXISTS "caregiver_links_insert" ON public.caregiver_links;

CREATE POLICY "caregiver_links_insert"
  ON public.caregiver_links FOR INSERT TO authenticated
  WITH CHECK (
    caregiver_user_id = auth.uid()
    AND elderly_user_id IS NOT NULL
    AND elderly_user_id <> auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = elderly_user_id)
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles cg
        WHERE cg.user_id = auth.uid()
          AND cg.app_role IN ('caregiver', 'both')
      )
      OR coalesce(auth.jwt() -> 'user_metadata' ->> 'app_role', 'elderly') IN ('caregiver', 'both')
    )
  );
