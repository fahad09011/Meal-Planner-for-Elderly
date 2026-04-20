import { supabase } from "./supabaseClient";

export const saveMealPlan = async (
userId,
weekStartDate,
weeklyPlan,
generationMode = "manual") =>
{
  const mealPlanPayload = {
    user_id: userId,
    week_start_date: weekStartDate,
    weekly_plan: weeklyPlan,
    generation_mode: generationMode,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.
  from("meal_plans").
  upsert([mealPlanPayload], {
    onConflict: "user_id,week_start_date"
  }).
  select().
  single();
  if (error) {
    console.error("Error saving plan in DB: ", error);
    return { success: false, error };
  }
  return { success: true, data };
};

export const getMealPlanByWeek = async (userId, weekStartDate) => {
  const { data, error } = await supabase.
  from("meal_plans").
  select("*").
  eq("user_id", userId).
  eq("week_start_date", weekStartDate).
  maybeSingle();
  if (error) {
    console.error("Error getting  plan from DB: ", error);
    return { success: false, error };
  }
  return { success: true, data: data ?? null };
};