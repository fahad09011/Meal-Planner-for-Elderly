import { createContext, useCallback, useEffect, useState } from "react";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "../services/profileService";
import { saveMealPlan, getMealPlanByWeek } from "../services/mealPlanService";
import { deleteMealCompletionsForMealPlan } from "../services/mealCompletionService";
import { useAuth } from "./AuthContext";
import { getWeekStartDate } from "../utils/helpers";

export const AppContext = createContext();

const defaultProfile = {
  ageGroup: "",
  dietary: [],
  allergies: [],
  healthConditions: [],
  budget: "",
};

const defaultWeeklyPlan = {
  Monday: { breakfast: null, lunch: null, dinner: null },
  Tuesday: { breakfast: null, lunch: null, dinner: null },
  Wednesday: { breakfast: null, lunch: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, dinner: null },
  Friday: { breakfast: null, lunch: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, dinner: null },
};

function emptyWeeklyPlanClone() {
  return JSON.parse(JSON.stringify(defaultWeeklyPlan));
}

export function AppProvider({ children }) {
  const { user, authLoading } = useAuth();
  const [mealPlanId, setMealPlanId] = useState(null);
  const [profileData, setProfileData] = useState(defaultProfile);
  /** True after we know whether a logged-in user has Supabase profile rows (avoids meal API spam before hydration). */
  const [profileHydrated, setProfileHydrated] = useState(false);
  const hasProfile = profileData.ageGroup !== "";

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user?.id) {
      setProfileData(defaultProfile);
      setProfileHydrated(true);
      setMealPlanId(null);
      setWeeklyPlan(defaultWeeklyPlan);
      setMealPlanDraft(emptyWeeklyPlanClone());
      setMealPlanTrackingEpoch(0);
      return;
    }

    let cancelled = false;
    setProfileHydrated(false);
    // Clear previous user's profile from UI immediately so we never show stale data
    // while loading, or if the new user has no profile row yet.
    setProfileData(defaultProfile);

    (async () => {
      try {
        const { success, data } = await getProfile(user.id);
        if (cancelled) return;
        if (success && data) {
          setProfileData({
            ageGroup: data.age_group,
            dietary: data.dietary ?? [],
            allergies: data.allergies ?? [],
            healthConditions: data.health_conditions ?? [],
            budget: data.budget ?? "",
          });
        }
      } finally {
        if (!cancelled) setProfileHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);
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

  const [weeklyPlan, setWeeklyPlan] = useState(defaultWeeklyPlan);
  /** Local builder only; not loaded from DB. Saved plan lives in `weeklyPlan` after generate. */
  const [mealPlanDraft, setMealPlanDraft] = useState(emptyWeeklyPlanClone);
  /** Bumps when completions are cleared so View Plan refetches tracking without changing mealPlanId. */
  const [mealPlanTrackingEpoch, setMealPlanTrackingEpoch] = useState(0);
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
        mealPlanDraft,
        generationMode,
      );
      if (!result.success) {
        console.error("Error saving meal plan", result.error);
        return { success: false, error: result.error };
      }

      const savedRow = result.data;
      if (savedRow?.weekly_plan) {
        setWeeklyPlan(savedRow.weekly_plan);
      }
      setMealPlanId(savedRow?.id || null);

      if (savedRow?.id) {
        const cleared = await deleteMealCompletionsForMealPlan(savedRow.id);
        if (!cleared.success) {
          console.error("Saved plan but failed to reset tracking", cleared.error);
        }
      }
      setMealPlanDraft(emptyWeeklyPlanClone());
      setMealPlanTrackingEpoch((epoch) => epoch + 1);

      return result;
    } catch (error) {
      console.error("Error saving meal plan", error);
      return { success: false, error: error };
    } finally {
      setMealPlanLoading(false);
    }
  };

  const loadMealPlanForWeek = useCallback(
    async (weekStartDate) => {
      if (!user) {
        return { success: false, error: new Error("User not authenticated") };
      }
      setMealPlanLoading(true);

      try {
        const result = await getMealPlanByWeek(user.id, weekStartDate);
        if (result.success && result.data) {
          setWeeklyPlan(result?.data?.weekly_plan || defaultWeeklyPlan);
          setMealPlanId(result?.data?.id || null);
        } else {
          setWeeklyPlan(defaultWeeklyPlan);
          setMealPlanId(null);
        }
        return result;
      } catch (error) {
        console.error("Error loading meal plan", error);
        setWeeklyPlan(defaultWeeklyPlan);
        setMealPlanId(null);
        return { success: false, error: error };
      } finally {
        setMealPlanLoading(false);
      }
    },
    [user?.id],
  );

  /** Restore meal plan id + weekly plan after full page reload (in-memory state is lost). */
  useEffect(() => {
    if (authLoading || !user?.id) return;
    loadMealPlanForWeek(getWeekStartDate());
  }, [authLoading, user?.id, loadMealPlanForWeek]);

  /** Builder always starts empty for this user; saved week stays in `weeklyPlan` from DB. */
  useEffect(() => {
    if (!user?.id) return;
    setMealPlanDraft(emptyWeeklyPlanClone());
  }, [user?.id]);

  return (
    <AppContext.Provider
      value={{
        weeklyPlan,
        setWeeklyPlan,
        mealPlanDraft,
        setMealPlanDraft,
        mealPlanTrackingEpoch,
        setProfileData,
        profileData,
        profileHydrated,
        saveProfile,
        clearProfile,
        hasProfile,
        saveWeeklyPlan,
        defaultProfile,
        mealPlanLoading,
        loadMealPlanForWeek,
        saveCurrentMealPlan,
        defaultWeeklyPlan,
        mealPlanId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
