import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
  createProfile,
  updateProfile,
  getProfile,
  getProfileForSessionUser,
  getAppRoleForUser } from
"../services/database/profileService";
import { normalizeAppRole, canProvideCare } from "../constants/appRoles";
import {
  createCaregiverLink,
  deleteCaregiverLink,
  getRecipientNamesByUserIds,
  listOutgoingCaregiverLinks } from
"../services/database/caregiverService";
import { saveMealPlan, getMealPlanByWeek } from "../services/database/mealPlanService";
import { deleteMealCompletionsForMealPlan } from "../services/database/mealCompletionService";
import { useAuth } from "../context/AuthContext";
import { getWeekStartDate } from "../utils/helpers";

export const AppContext = createContext();

const defaultProfile = {
  age: "",
  weightKg: "",
  heightCm: "",
  gender: "",
  activityLevel: "",
  dietary: [],
  allergies: [],
  healthConditions: [],
  budget: "",
  appRole: "elderly"
};

function isProfileComplete(profile) {
  const ageYears = Number(profile.age);
  const weightKg = Number(profile.weightKg);
  const heightCm = Number(profile.heightCm);
  return (
    Number.isFinite(ageYears) &&
    ageYears >= 18 &&
    ageYears <= 120 &&
    Number.isFinite(weightKg) &&
    weightKg > 0 &&
    Number.isFinite(heightCm) &&
    heightCm > 0 &&
    profile.gender !== "" &&
    profile.activityLevel !== "");

}

const defaultWeeklyPlan = {
  Monday: { breakfast: null, lunch: null, dinner: null },
  Tuesday: { breakfast: null, lunch: null, dinner: null },
  Wednesday: { breakfast: null, lunch: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, dinner: null },
  Friday: { breakfast: null, lunch: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, dinner: null }
};

function emptyWeeklyPlanClone() {
  return JSON.parse(JSON.stringify(defaultWeeklyPlan));
}

export function AppProvider({ children }) {
  const { user, authLoading } = useAuth();
  const selectionHydratedRef = useRef(false);
  const [careRecipients, setCareRecipients] = useState([]);
  const [selectedClientUserId, setSelectedClientUserIdState] = useState(null);
  const [careLinksLoaded, setCareLinksLoaded] = useState(false);
  const [ownAppRole, setOwnAppRole] = useState("elderly");


  const activeDataUserId = user?.id ? selectedClientUserId ?? user.id : null;
  const viewingOwnProfile = Boolean(user?.id && activeDataUserId === user.id);

  const [mealPlanId, setMealPlanId] = useState(null);

  const [recipeSearchCache, setRecipeSearchCache] = useState({
    key: null,
    meals: []
  });
  const [profileData, setProfileData] = useState(defaultProfile);

  const [profileHydrated, setProfileHydrated] = useState(false);
  const hasProfile = isProfileComplete(profileData);


  const lastMealPlanLoadKeyRef = useRef(null);
  const mealPlanLoadInflightRef = useRef(null);


  const [shoppingListSessionCache, setShoppingListSessionCache] = useState({
    mealPlanId: null,
    items: []
  });

  useEffect(() => {
    selectionHydratedRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setCareRecipients([]);
      setCareLinksLoaded(true);
      setSelectedClientUserIdState(null);
      return;
    }
    let cancelled = false;
    setCareLinksLoaded(false);
    (async () => {
      const res = await listOutgoingCaregiverLinks(user.id);
      if (cancelled) return;
      if (!res.success) {
        setCareRecipients([]);
        setCareLinksLoaded(true);
        return;
      }
      const links = res.data ?? [];
      const nameRes = await getRecipientNamesByUserIds(
        links.map((l) => l.elderly_user_id)
      );
      if (cancelled) return;
      const nameMap = nameRes.success ? nameRes.data : {};
      setCareRecipients(
        links.map((row) => ({
          ...row,
          elderly_name: nameMap[row.elderly_user_id] || ""
        }))
      );
      setCareLinksLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !careLinksLoaded) return;
    if (selectionHydratedRef.current) return;
    selectionHydratedRef.current = true;
    const key = `mealcare-selected-client-${user.id}`;
    const raw = localStorage.getItem(key);
    if (!raw || raw === "self") {
      setSelectedClientUserIdState(null);
      return;
    }
    if (careRecipients.some((l) => l.elderly_user_id === raw)) {
      setSelectedClientUserIdState(raw);
    } else {
      localStorage.setItem(key, "self");
      setSelectedClientUserIdState(null);
    }
  }, [user?.id, careLinksLoaded, careRecipients]);

  useEffect(() => {
    if (!user?.id || authLoading) {
      setOwnAppRole("elderly");
      return;
    }
    let cancelled = false;
    (async () => {
      const { success, data } = await getAppRoleForUser(user.id);
      if (cancelled) return;
      const fromMeta = user.user_metadata?.app_role;
      if (success && data) {
        setOwnAppRole(normalizeAppRole(data));
      } else if (fromMeta) {
        setOwnAppRole(normalizeAppRole(fromMeta));
      } else {
        setOwnAppRole("elderly");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading, user?.user_metadata?.app_role]);

  useEffect(() => {
    setRecipeSearchCache({ key: null, meals: [] });
    setShoppingListSessionCache({ mealPlanId: null, items: [] });
    lastMealPlanLoadKeyRef.current = null;
  }, [activeDataUserId, user?.id]);

  const setSelectedClientUserId = useCallback(
    (elderlyIdOrNull) => {
      setSelectedClientUserIdState(elderlyIdOrNull);
      if (user?.id) {
        localStorage.setItem(
          `mealcare-selected-client-${user.id}`,
          elderlyIdOrNull ?? "self"
        );
      }
    },
    [user?.id]
  );

  const addCareRecipientByUserId = useCallback(
    async (elderlyUserId) => {
      if (!user?.id) {
        return { success: false, error: new Error("Not signed in") };
      }
      if (!canProvideCare(ownAppRole)) {
        return {
          success: false,
          error: new Error(
            "Only accounts registered as caregiver (or both) can add care recipients. That is chosen when you create your account."
          )
        };
      }
      const result = await createCaregiverLink(user.id, elderlyUserId);
      if (!result.success) return result;
      const resList = await listOutgoingCaregiverLinks(user.id);
      if (resList.success) {
        const links = resList.data ?? [];
        const nameRes = await getRecipientNamesByUserIds(
          links.map((l) => l.elderly_user_id)
        );
        const nameMap = nameRes.success ? nameRes.data : {};
        setCareRecipients(
          links.map((row) => ({
            ...row,
            elderly_name: nameMap[row.elderly_user_id] || ""
          }))
        );
      } else {
        setCareRecipients([]);
      }
      if (result.data?.elderly_user_id) {
        setSelectedClientUserIdState(result.data.elderly_user_id);
        localStorage.setItem(
          `mealcare-selected-client-${user.id}`,
          result.data.elderly_user_id
        );
      }
      return { success: true };
    },
    [user?.id, ownAppRole]
  );

  const removeCareRecipientByLinkId = useCallback(
    async (linkId) => {
      if (!user?.id) {
        return { success: false, error: new Error("Not signed in") };
      }
      const removed = careRecipients.find((l) => l.id === linkId);
      const result = await deleteCaregiverLink(linkId);
      if (!result.success) return result;
      const resList = await listOutgoingCaregiverLinks(user.id);
      if (resList.success) {
        const links = resList.data ?? [];
        const nameRes = await getRecipientNamesByUserIds(
          links.map((l) => l.elderly_user_id)
        );
        const nameMap = nameRes.success ? nameRes.data : {};
        setCareRecipients(
          links.map((row) => ({
            ...row,
            elderly_name: nameMap[row.elderly_user_id] || ""
          }))
        );
      } else {
        setCareRecipients([]);
      }
      if (removed && selectedClientUserId === removed.elderly_user_id) {
        setSelectedClientUserIdState(null);
        localStorage.setItem(`mealcare-selected-client-${user.id}`, "self");
      }
      return { success: true };
    },
    [user?.id, careRecipients, selectedClientUserId]
  );

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user?.id || !activeDataUserId) {
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


    setProfileData(defaultProfile);

    (async () => {
      try {
        const { success, data } = await (user.id === activeDataUserId ?
        getProfileForSessionUser() :
        getProfile(activeDataUserId));
        if (cancelled) return;
        if (success && data) {
          setProfileData({
            age: data.age != null ? String(data.age) : "",
            weightKg:
            data.weight != null ?
            String(data.weight) :
            data.weight_kg != null ?
            String(data.weight_kg) :
            "",
            heightCm:
            data.height != null ?
            String(data.height) :
            data.height_cm != null ?
            String(data.height_cm) :
            "",
            gender: data.gender ?? "",
            activityLevel: data.activity_level ?? "",
            dietary: data.dietary ?? [],
            allergies: data.allergies ?? [],
            healthConditions: data.health_conditions ?? [],
            budget: data.budget ?? "",
            appRole: normalizeAppRole(
              data.app_role ?? user?.user_metadata?.app_role ?? "elderly"
            )
          });
        } else if (success && !data && user?.user_metadata?.app_role) {
          setProfileData({
            ...defaultProfile,
            appRole: normalizeAppRole(user.user_metadata.app_role)
          });
        }
      } finally {
        if (!cancelled) setProfileHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.user_metadata?.app_role, activeDataUserId, authLoading]);
  const saveProfile = async (profileLoad) => {
    try {
      if (!user) {
        return { success: false, error: new Error("User not authenticated") };
      }
      if (activeDataUserId !== user.id) {
        return {
          success: false,
          error: new Error("You can only edit your own profile. Switch to “Myself” in the navbar.")
        };
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
      setOwnAppRole(normalizeAppRole(profileLoad.appRole));
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

  const [mealPlanDraft, setMealPlanDraft] = useState(emptyWeeklyPlanClone);

  const [mealPlanTrackingEpoch, setMealPlanTrackingEpoch] = useState(0);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);

  function saveWeeklyPlan(plan) {
    setWeeklyPlan(plan);
  }

  const saveCurrentMealPlan = async (
  weekStartDate,
  generationMode = "manual") =>
  {
    if (!user || !activeDataUserId) {
      return { success: false, error: new Error("User not authenticated") };
    }
    setMealPlanLoading(true);
    try {
      const result = await saveMealPlan(
        activeDataUserId,
        weekStartDate,
        mealPlanDraft,
        generationMode
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
      setShoppingListSessionCache({ mealPlanId: null, items: [] });

      return result;
    } catch (error) {
      console.error("Error saving meal plan", error);
      return { success: false, error: error };
    } finally {
      setMealPlanLoading(false);
    }
  };

  const loadMealPlanForWeek = useCallback(
    async (weekStartDate, options = {}) => {
      const { force = false } = options;
      if (!user || !activeDataUserId) {
        return { success: false, error: new Error("User not authenticated") };
      }
      const key = `${activeDataUserId}:${weekStartDate}`;
      if (!force && lastMealPlanLoadKeyRef.current === key) {
        return { success: true, cached: true };
      }
      if (mealPlanLoadInflightRef.current?.key === key) {
        return mealPlanLoadInflightRef.current.promise;
      }

      const promise = (async () => {
        setMealPlanLoading(true);
        try {
          const result = await getMealPlanByWeek(activeDataUserId, weekStartDate);
          if (result.success && result.data) {
            setWeeklyPlan(result?.data?.weekly_plan || defaultWeeklyPlan);
            setMealPlanId(result?.data?.id || null);
          } else {
            setWeeklyPlan(defaultWeeklyPlan);
            setMealPlanId(null);
          }
          lastMealPlanLoadKeyRef.current = key;
          return result;
        } catch (error) {
          console.error("Error loading meal plan", error);
          setWeeklyPlan(defaultWeeklyPlan);
          setMealPlanId(null);
          return { success: false, error: error };
        } finally {
          setMealPlanLoading(false);
          mealPlanLoadInflightRef.current = null;
        }
      })();

      mealPlanLoadInflightRef.current = { key, promise };
      return promise;
    },
    [user, activeDataUserId]
  );


  useEffect(() => {
    if (authLoading || !user?.id || !activeDataUserId) return;
    loadMealPlanForWeek(getWeekStartDate());
  }, [authLoading, user?.id, activeDataUserId, loadMealPlanForWeek]);


  useEffect(() => {
    if (!activeDataUserId) return;
    setMealPlanDraft(emptyWeeklyPlanClone());
  }, [activeDataUserId]);

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
        activeDataUserId,
        recipeSearchCache,
        setRecipeSearchCache,
        shoppingListSessionCache,
        setShoppingListSessionCache,
        viewingOwnProfile,
        careRecipients,
        careLinksLoaded,
        selectedClientUserId,
        setSelectedClientUserId,
        addCareRecipientByUserId,
        removeCareRecipientByLinkId,
        ownAppRole,
        canActAsCaregiver: canProvideCare(ownAppRole)
      }}>
      
      {children}
    </AppContext.Provider>);

}