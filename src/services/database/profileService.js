import { supabase } from "./supabaseClient";
import { normalizeAppRole } from "../../constants/appRoles";

function toNumOrNull(value) {
  if (value === "" || value == null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile: ", error);
    return { success: false, error };
  }
  return { success: true, data: data ?? null };
};

export const getAppRoleForUser = async (userId) => {
  if (!userId) {
    return { success: false, error: new Error("User id required"), data: null };
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getAppRoleForUser:", error);
    return { success: false, error, data: null };
  }
  return { success: true, data: data?.app_role ?? null };
};

export const createProfile = async (userId, profileData) => {
  const dbPayload = {
    user_id: userId,
    age: toNumOrNull(profileData.age),
    weight: toNumOrNull(profileData.weightKg),
    height: toNumOrNull(profileData.heightCm),
    gender: profileData.gender || null,
    activity_level: profileData.activityLevel || null,
    dietary: profileData.dietary,
    allergies: profileData.allergies,
    health_conditions: profileData.healthConditions,
    budget: profileData.budget,
    app_role: normalizeAppRole(profileData.appRole),
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert([dbPayload])
    .select()
    .single();

  if (error) {
    console.error("Error inserting profile in DB: ", error);
    return { success: false, error };
  }
  return { success: true, data };
};

export const updateProfile = async (userId, profileData) => {
  const dbPayload = {
    user_id: userId,
    age: toNumOrNull(profileData.age),
    weight: toNumOrNull(profileData.weightKg),
    height: toNumOrNull(profileData.heightCm),
    gender: profileData.gender || null,
    activity_level: profileData.activityLevel || null,
    dietary: profileData.dietary,
    allergies: profileData.allergies,
    health_conditions: profileData.healthConditions,
    budget: profileData.budget,
    app_role: normalizeAppRole(profileData.appRole),
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(dbPayload)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile in DB:", error);
    return { success: false, error };
  }
  return { success: true, data };
};
