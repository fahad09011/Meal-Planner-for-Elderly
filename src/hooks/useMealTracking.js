import { useState, useEffect } from "react";
import { getMealCompletions, setMealCompletion } from "../services/database/mealCompletionService";
import { useAuth } from "../context/AuthContext";

const DAYS = [
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday",
"Sunday"];


const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

const createEmptyTracking = () => {
  return DAYS.reduce((acc, day) => {
    acc[day] = { breakfast: false, lunch: false, dinner: false };
    return acc;
  }, {});
};

function useMealTracking(mealPlanId, trackingEpoch = 0) {
  const { user } = useAuth();
  const [mealTracking, setMealTracking] = useState(createEmptyTracking());
  const [trackingLoading, setTrackingLoading] = useState(false);

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
          return;
        }

        const tracking = createEmptyTracking();



        result.data.forEach((row) => {
          const dayKey = String(row.day_of_week ?? "").trim();
          const mealKey = String(row.meal_type ?? "").toLowerCase().trim();

          if (!DAYS.includes(dayKey) || !MEAL_TYPES.includes(mealKey)) return;
          tracking[dayKey][mealKey] = Boolean(row.completed);
        });

        setMealTracking(tracking);
      } catch {
        setMealTracking(createEmptyTracking());
      } finally {
        setTrackingLoading(false);
      }
    }

    fetchTracking();
  }, [mealPlanId, trackingEpoch]);

  async function toggleMealDone(day, mealType) {
    if (!mealPlanId || !user) return;
    if (!DAYS.includes(day) || !MEAL_TYPES.includes(mealType)) return;

    const currentValue = mealTracking?.[day]?.[mealType] ?? false;
    const nextValue = !currentValue;

    const result = await setMealCompletion(
      mealPlanId,
      day,
      mealType,
      nextValue,
      user.id
    );
    if (!result.success) {
      return;
    }


    setMealTracking((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: nextValue
      }
    }));
  }

  async function markDayDone(day) {
    if (!DAYS.includes(day) || !mealPlanId || !user) return;

    const results = await Promise.all(
      MEAL_TYPES.map((mealType) =>
      setMealCompletion(mealPlanId, day, mealType, true, user.id)
      )
    );

    const hasFailure = results.some((result) => !result.success);

    if (hasFailure) {
      return;
    }

    setMealTracking((prev) => ({
      ...prev,
      [day]: { breakfast: true, lunch: true, dinner: true }
    }));
  }

  const completedDays = DAYS.filter(
    (day) => MEAL_TYPES.every((mealType) => mealTracking[day]?.[mealType])
  ).length;

  const progress = Math.round(completedDays / 7 * 100);

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
    isMealDone
  };
}

export default useMealTracking;