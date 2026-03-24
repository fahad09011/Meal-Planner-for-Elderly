import { useState, useEffect } from "react";
import { getMealCompletions, setMealCompletion } from "../services/mealCompletionService";
import { useAuth } from "../context/AuthContext";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

const createEmptyTracking = () => {
  return DAYS.reduce((acc, day) => {
    acc[day] = { breakfast: false, lunch: false, dinner: false };
    return acc;
  }, {});
};


function useMealTracking( mealPlanId) {
  const { user } = useAuth();
  const [mealTracking, setMealTracking] = useState(createEmptyTracking());
  const [trackingLoading, setTrackingLoading] = useState(false);

  // ── Load tracking from DB when week changes ──
  useEffect(() => {
    if (!mealPlanId) {
      setMealTracking(createEmptyTracking());
      return;
    }

    async function fetchTracking() {
      setTrackingLoading(true);
      try {
        const result = await getMealCompletions(mealPlanId);
        if (!result.success || !result.data) {
          console.error("Error getting meal completions", result.error);
          return;
        }

        const tracking = createEmptyTracking();

        // DB rows can come in mixed enum casing depending on migration history.
        // Normalize keys before writing into our strict local shape.
        result.data.forEach((row) => {
          const dayKey = String(row.day_of_week ?? "").trim();
          const mealKey = String(row.meal_type ?? "").toLowerCase().trim();

          if (!DAYS.includes(dayKey) || !MEAL_TYPES.includes(mealKey)) return;
          tracking[dayKey][mealKey] = Boolean(row.completed);
        });

        setMealTracking(tracking);
      } catch (err) {
        console.error("Failed to load meal tracking:", err);
        setMealTracking(createEmptyTracking());
      } finally {
        setTrackingLoading(false);
      }
    }

    fetchTracking();
  }, [mealPlanId]);

  // ── Toggle one meal done/undone ──
  async function toggleMealDone(day, mealType) {
    if (!mealPlanId || !user) return;
    if (!DAYS.includes(day) || !MEAL_TYPES.includes(mealType)) return;

    const currentValue = mealTracking?.[day]?.[mealType] ?? false;
    const nextValue = !currentValue;

    // Persist first, then update UI.
    // This prevents showing "done" in UI when DB save actually fails.
    const result = await setMealCompletion(
      mealPlanId,
      day,
      mealType,
      nextValue,
      user.id,
    );
    if (!result.success) {
      console.error("Error setting meal completion", result.error);
      return;
    }

    // update local state
    setMealTracking((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: nextValue,
      },
    }));
  }

  // ── Mark all meals done for a day ──
  async function markDayDone(day) {
    if (!DAYS.includes(day) || !mealPlanId || !user) return;
  
    const results = await Promise.all(
      MEAL_TYPES.map((mealType) =>
        setMealCompletion(mealPlanId, day, mealType, true, user.id)
      )
    );
  
    const hasFailure = results.some((result) => !result.success);
  
    if (hasFailure) {
      console.error("Failed to mark full day done");
      return;
    }
  
    setMealTracking((prev) => ({
      ...prev,
      [day]: { breakfast: true, lunch: true, dinner: true },
    }));
  }

  // ── Derived values ──
  const completedDays = DAYS.filter(
    (day) => MEAL_TYPES.every((mealType) => mealTracking[day]?.[mealType]),
  ).length;

  const progress = Math.round((completedDays / 7) * 100);

  const isDayComplete = (day) =>
    MEAL_TYPES.every((mealType) => mealTracking[day]?.[mealType]);

  const isMealDone = (day, mealType) => mealTracking[day]?.[mealType] ?? false;

  return {
    mealTracking,
    trackingLoading,
    toggleMealDone,
    markDayDone,
    completedDays,
    progress,
    isDayComplete,
    isMealDone,
  };
}

export default useMealTracking;
