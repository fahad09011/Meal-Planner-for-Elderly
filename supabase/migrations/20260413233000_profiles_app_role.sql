-- Account type: who may create caregiver_links (caregiver or both only)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS app_role text NOT NULL DEFAULT 'elderly';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_app_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_app_role_check
  CHECK (app_role IN ('elderly', 'caregiver', 'both'));

UPDATE public.profiles
SET app_role = 'elderly'
WHERE app_role IS NULL OR app_role NOT IN ('elderly', 'caregiver', 'both');

DROP POLICY IF EXISTS "caregiver_links_insert" ON public.caregiver_links;

CREATE POLICY "caregiver_links_insert"
  ON public.caregiver_links FOR INSERT TO authenticated
  WITH CHECK (
    caregiver_user_id = auth.uid()
    AND elderly_user_id IS NOT NULL
    AND elderly_user_id <> auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = elderly_user_id)
    AND EXISTS (
      SELECT 1 FROM public.profiles cg
      WHERE cg.user_id = auth.uid()
        AND cg.app_role IN ('caregiver', 'both')
    )
  );
