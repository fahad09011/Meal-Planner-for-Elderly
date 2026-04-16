import { supabase } from "./supabaseClient";
import { buildShoppingItemsFromWeeklyPlan } from "../../utils/buildShoppingItemsFromWeeklyPlan";

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


export const replaceShoppingListItems = async (shoppingListId, items, updatedBy) => {
  if (!shoppingListId) {
    return { success: false, error: new Error("Shopping list ID is required") };
  }
  if (!Array.isArray(items)) {
    return { success: false, error: new Error("Items must be an array") };
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



export const syncShoppingListFromWeeklyPlan = async (mealPlanId, weeklyPlan, userId) => {
  if (!mealPlanId || !userId) {
    return { success: false, error: new Error("Meal plan ID and user ID are required") };
  }
  const parent = await createOrGetShoppingList(mealPlanId);
  if (!parent.success || !parent.data?.id) {
    return { success: false, error: parent.error || new Error("Could not create shopping list") };
  }
  const items = buildShoppingItemsFromWeeklyPlan(weeklyPlan || {});
  return replaceShoppingListItems(parent.data.id, items, userId);
};

export const getShoppingListItems = async (mealPlanId) => {
  if (!mealPlanId) {
    return { success: false, error: new Error("Meal plan ID is required") };
  }

  const { data: shoppingList, error: listError } = await supabase
    .from("shopping_lists")
    .select("*")
    .eq("meal_plan_id", mealPlanId)
    .maybeSingle();

  if (listError) {
    console.error("Error loading shopping list:", listError);
    return { success: false, error: listError };
  }
  if (!shoppingList) {
    return { success: true, data: [] };
  }

  const { data, error } = await supabase
    .from("shopping_list_items")
    .select("*")
    .eq("shopping_list_id", shoppingList.id);

  if (error) {
    console.error("Error loading shopping list items:", error);
    return { success: false, error };
  }
  return { success: true, data };
};

export const updateShoppingListItemChecked = async (itemId, checked) => {
  if (!itemId) {
    return { success: false, error: new Error("Item ID is required") };
  }
  const { data, error } = await supabase
    .from("shopping_list_items")
    .update({ checked })
    .eq("id", itemId)
    .select()
    .single();
  if (error) {
    console.error("Error updating shopping list item", error);
    return { success: false, error };
  }
  return { success: true, data };
};

/** Inserts one row from a barcode lookup (Open Food Facts, etc.). */
export const addShoppingListItemFromBarcodeProduct = async (mealPlanId, userId, product) => {
  if (!mealPlanId || !userId) {
    return {
      success: false,
      error: new Error("Meal plan and user are required to add a shopping item."),
    };
  }
  const name = String(product?.name ?? "").trim();
  if (!name) {
    return { success: false, error: new Error("Product name is missing.") };
  }

  const parent = await createOrGetShoppingList(mealPlanId);
  if (!parent.success || !parent.data?.id) {
    return {
      success: false,
      error: parent.error || new Error("Could not create or load shopping list."),
    };
  }

  const payload = {
    shopping_list_id: parent.data.id,
    ingredient_name: name,
    category: "Other",
    aisle: "",
    amount: 1,
    unit: "item",
    checked: false,
    added_by_barcode: true,
    updated_by: userId,
  };

  const { data, error } = await supabase
    .from("shopping_list_items")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error inserting barcode shopping item:", error);
    return { success: false, error };
  }
  return { success: true, data };
};
