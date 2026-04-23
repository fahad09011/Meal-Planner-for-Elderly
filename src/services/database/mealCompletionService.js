import { supabase } from "./supabaseClient";

export const setMealCompletion = async (
mealPlanId,
dayOfWeek,
mealType,
completed,
updatedBy) =>
{
  const completionPayload = {
    meal_plan_id: mealPlanId,
    day_of_week: dayOfWeek,
    meal_type: mealType,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy
  };

  const { data, error } = await supabase.
  from("meal_completions").
  upsert([completionPayload], {
    onConflict: "meal_plan_id,day_of_week,meal_type"
  }).
  select().
  single();

  if (error) {
    return { success: false, error };
  }
  return { success: true, data };
};

export const getMealCompletions = async (mealPlanId) => {
  const { data, error } = await supabase.
  from("meal_completions").
  select("*").
  eq("meal_plan_id", mealPlanId);

  if (error) {
    return { success: false, error };
  }
  return { success: true, data };
};


export const deleteMealCompletionsForMealPlan = async (mealPlanId) => {
  if (!mealPlanId) {
    return { success: true, data: null };
  }
  const { error } = await supabase.
  from("meal_completions").
  delete().
  eq("meal_plan_id", mealPlanId);
  if (error) {
    return { success: false, error };
  }
  return { success: true, data: null };
};