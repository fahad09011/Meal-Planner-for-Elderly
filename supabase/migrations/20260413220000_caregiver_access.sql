-- Idempotent caregiver access (run once per environment; safe to re-run after drops).
CREATE UNIQUE INDEX IF NOT EXISTS caregiver_links_caregiver_elderly_uidx
  ON public.caregiver_links (caregiver_user_id, elderly_user_id)
  WHERE caregiver_user_id IS NOT NULL AND elderly_user_id IS NOT NULL;

DROP POLICY IF EXISTS "caregiver_links_insert" ON public.caregiver_links;
DROP POLICY IF EXISTS "caregiver_links_select_as_caregiver" ON public.caregiver_links;
DROP POLICY IF EXISTS "caregiver_links_select_as_elderly" ON public.caregiver_links;
DROP POLICY IF EXISTS "caregiver_links_delete_caregiver" ON public.caregiver_links;
DROP POLICY IF EXISTS "caregiver_links_delete_elderly" ON public.caregiver_links;
DROP POLICY IF EXISTS "profiles_select_for_linked_caregiver" ON public.profiles;
DROP POLICY IF EXISTS "Caregiver manage linked shopping_lists" ON public.shopping_lists;
DROP POLICY IF EXISTS "Caregiver manage linked_shopping_list_items" ON public.shopping_list_items;
DROP POLICY IF EXISTS "Caregiver manage linked_meal_plan_items" ON public.meal_plan_items;

CREATE POLICY "caregiver_links_insert"
  ON public.caregiver_links FOR INSERT TO authenticated
  WITH CHECK (
    caregiver_user_id = auth.uid()
    AND elderly_user_id IS NOT NULL
    AND elderly_user_id <> auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = elderly_user_id)
  );

CREATE POLICY "caregiver_links_select_as_caregiver"
  ON public.caregiver_links FOR SELECT TO authenticated
  USING (caregiver_user_id = auth.uid());

CREATE POLICY "caregiver_links_select_as_elderly"
  ON public.caregiver_links FOR SELECT TO authenticated
  USING (elderly_user_id = auth.uid());

CREATE POLICY "caregiver_links_delete_caregiver"
  ON public.caregiver_links FOR DELETE TO authenticated
  USING (caregiver_user_id = auth.uid());

CREATE POLICY "caregiver_links_delete_elderly"
  ON public.caregiver_links FOR DELETE TO authenticated
  USING (elderly_user_id = auth.uid());

CREATE POLICY "profiles_select_for_linked_caregiver"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_links cl
      WHERE cl.caregiver_user_id = auth.uid()
        AND cl.elderly_user_id = profiles.user_id
    )
  );

DROP POLICY IF EXISTS "Caregiver access shopping list items" ON public.shopping_list_items;
DROP POLICY IF EXISTS "Caregiver access shopping lists" ON public.shopping_lists;
DROP POLICY IF EXISTS "Caregiver access meal plan items" ON public.meal_plan_items;

CREATE POLICY "Caregiver manage linked shopping_lists"
  ON public.shopping_lists FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.meal_plans mp
      INNER JOIN public.caregiver_links cl
        ON cl.elderly_user_id = mp.user_id AND cl.caregiver_user_id = auth.uid()
      WHERE mp.id = shopping_lists.meal_plan_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meal_plans mp
      INNER JOIN public.caregiver_links cl
        ON cl.elderly_user_id = mp.user_id AND cl.caregiver_user_id = auth.uid()
      WHERE mp.id = shopping_lists.meal_plan_id
    )
  );

CREATE POLICY "Caregiver manage linked_shopping_list_items"
  ON public.shopping_list_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists sl
      INNER JOIN public.meal_plans mp ON mp.id = sl.meal_plan_id
      INNER JOIN public.caregiver_links cl
        ON cl.elderly_user_id = mp.user_id AND cl.caregiver_user_id = auth.uid()
      WHERE sl.id = shopping_list_items.shopping_list_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shopping_lists sl
      INNER JOIN public.meal_plans mp ON mp.id = sl.meal_plan_id
      INNER JOIN public.caregiver_links cl
        ON cl.elderly_user_id = mp.user_id AND cl.caregiver_user_id = auth.uid()
      WHERE sl.id = shopping_list_items.shopping_list_id
    )
  );

CREATE POLICY "Caregiver manage linked_meal_plan_items"
  ON public.meal_plan_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.meal_plans mp
      INNER JOIN public.caregiver_links cl
        ON cl.elderly_user_id = mp.user_id AND cl.caregiver_user_id = auth.uid()
      WHERE mp.id = meal_plan_items.meal_plan_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meal_plans mp
      INNER JOIN public.caregiver_links cl
        ON cl.elderly_user_id = mp.user_id AND cl.caregiver_user_id = auth.uid()
      WHERE mp.id = meal_plan_items.meal_plan_id
    )
  );
