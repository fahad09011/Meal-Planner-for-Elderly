import { supabase } from "./supabaseClient";

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

export const createProfile = async (userId, profileData) => {
  const dbPayload = {
    user_id: userId,
    age_group: profileData.ageGroup,
    dietary: profileData.dietary,
    allergies: profileData.allergies,
    health_conditions: profileData.healthConditions,
    budget: profileData.budget,
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


export const updateProfile = async (userId , profileData)=>{
    const dbPayload = {
        user_id: userId,
        age_group: profileData.ageGroup,
        dietary: profileData.dietary,
        allergies: profileData.allergies,
        health_conditions: profileData.healthConditions,
        budget: profileData.budget,
      };
      const {data , error} = await supabase.from("profiles")
      .update(dbPayload)
      .eq("user_id", userId)
      .select()
      .single();

      if(error){
        console.error("Error updating profile in DB: ",error);
        return{success: false, error};
      }
      return{success: true, data};

}
