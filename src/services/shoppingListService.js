import { supabase } from "./supabaseClient";

export const createOrGetShoppingList = async (mealPlanId) => {
  if (!mealPlanId) {
    return { success: false, error: new Error("Meal plan ID is required") };
  }
  const { data, error } = await supabase
    .from("shopping_lists")
    .upsert([{ meal_plan_id: mealPlanId }], { onConflict: "meal_plan_id" })
    .select()
    .single();
  if (error) {
    console.error("Error creating shopping list:", error);
    return { success: false, error };
  }
  return { success: true, data };
};


export const replaceShoppingListItems = async (shoppingListId, items, updatedBy)=>{
if(!shoppingListId){
return{ success: false, error: new Error("Shopping list ID is required") };
}
if(!Array.isArray(items)){
    return{ success: false, error: new Error("Items array is required and must not be empty") };
}
const { error: deleteError } = await supabase
  .from("shopping_list_items")
  .delete()
  .eq("shopping_list_id", shoppingListId);
  if (deleteError) {
    console.error("Error deleting shopping list items:", deleteError);
    return { success: false, error: deleteError };
  }
  if (items.length === 0) {
    return { success: true, data: [] };
  }
  const itemPayload = items.map((item) => ({
    shopping_list_id: shoppingListId,
    ingredient_name: item.name,
    category: item.category,
    aisle: item.aisle,
    amount: item.amount,
    unit: item.unit,
    checked: false,
    added_by_barcode: false,
    updated_by: updatedBy,
  }));
  const { data, error } = await supabase
  .from("shopping_list_items")
  .insert(itemPayload)
  .select();
  if (error) {
    console.error("Error inserting shopping list items:", error);
    return { success: false, error };
  }
  return { success: true, data };
};