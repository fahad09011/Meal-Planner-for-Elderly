import { createContext, useEffect, useState } from "react";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "../services/profileService";
import { saveMealPlan, getMealPlanByWeek } from "../services/mealPlanService";
import { useAuth } from "./AuthContext";

export const AppContext = createContext();
export function AppProvider({ children }) {
  const { user } = useAuth();
  const defaultProfile = {
    ageGroup: "",
    dietary: [],
    allergies: [],
    healthConditions: [],
    budget: "",
  };
  const [profileData, setProfileData] = useState(defaultProfile);
  const hasProfile = profileData.ageGroup !== "";

  useEffect(() => {
    if (!user) {
      return;
    }
    const loadProfile = async () => {
      const { success, data } = await getProfile(user.id);
      if (success && data) {
        setProfileData({
          ageGroup: data.age_group,
          dietary: data.dietary,
          allergies: data.allergies,
          healthConditions: data.health_conditions,
          budget: data.budget,
        });
      }
    };
    loadProfile();
  }, [user]);
  const saveProfile = async (profileLoad) => {
    try {
      if (!user) {
        return { success: false, error: new Error("User not authenticated") };
      }
      let result;
      if (hasProfile) {
        result = await updateProfile(user.id, profileLoad);
        if (result.success) {
          console.log("updated method called");
          setProfileData(profileLoad);
        } else {
          return { success: false, error: result.error };
        }
      } else {
        result = await createProfile(user.id, profileLoad);
        if (result.success) {
          console.log("created method called");

          setProfileData(profileLoad);
        } else {
          return { success: false, error: result.error };
        }
      }
      console.log("Profile saved successfully", profileLoad);
      return { success: true, error: null };
    } catch (error) {
      console.error("Error saving profile", error);
      return { success: false, error: error };
    }
  };

  function clearProfile() {
    setProfileData(defaultProfile);
  }
  const defaultWeeklyPlan = {
    Monday: { breakfast: null, lunch: null, dinner: null },
    Tuesday: { breakfast: null, lunch: null, dinner: null },
    Wednesday: { breakfast: null, lunch: null, dinner: null },
    Thursday: { breakfast: null, lunch: null, dinner: null },
    Friday: { breakfast: null, lunch: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, dinner: null },
  };

  const [weeklyPlan, setWeeklyPlan] = useState(defaultWeeklyPlan);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);

  function saveWeeklyPlan(plan) {
    setWeeklyPlan(plan);
  }

  const saveCurrentMealPlan = async (
    weekStartDate,
    generationMode = "manual",
  ) => {
    if (!user) {
      return { success: false, error: new Error("User not authenticated") };
    }
    setMealPlanLoading(true);
    try {
      const result = await saveMealPlan(
        user.id,
        weekStartDate,
        weeklyPlan,
        generationMode,
      );
      if (!result.success) {
        console.error("Error saving meal plan", result.error);
      }
      return result;
    } catch (error) {
      console.error("Error saving meal plan", error);
      return { success: false, error: error };
    } finally {
      setMealPlanLoading(false);
    }
  };

  const loadMealPlanForWeek = async (weekStartDate) => {
    if (!user) {
      return { success: false, error: new Error("User not authenticated") };
    }
    setMealPlanLoading(true);

    try {
      const result = await getMealPlanByWeek(user.id, weekStartDate);
      if (result.success && result.data) {
        setWeeklyPlan(result?.data?.weekly_plan || defaultWeeklyPlan);
      }
      return result;
    } catch (error) {
      console.error("Error loading meal plan", error);
      setWeeklyPlan(defaultWeeklyPlan);
      return { success: false, error: error };
    } finally {
      setMealPlanLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        weeklyPlan,
        setWeeklyPlan,
        setProfileData,
        profileData,
        saveProfile,
        clearProfile,
        hasProfile,
        saveWeeklyPlan,
        defaultProfile,
        mealPlanLoading,
        loadMealPlanForWeek,
        saveCurrentMealPlan,
        defaultWeeklyPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
