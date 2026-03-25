import { useState, useEffect } from "react";
import fetchMeals from "../services/spoonacularService";
import {getWeekStartDate} from "../utils/helpers";
const useMealPlan = ({
  days,
  weeklyPlan,
  setWeeklyPlan,
  selectedDay,
  setSelectedDay,
  saveWeeklyPlan,
  profileData,
  saveCurrentMealPlan,
  /** Wait for auth + Supabase profile load so we don’t hit Spoonacular with empty profile or race in-flight requests. */
  mealsFetchReady = true,
  // weekStartDate,
}) => {
  const defaultDaySelection = {
    breakfast: null,
    lunch: null,
    dinner: null,
  };
  const [apiMeals, setApiMeals] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [mealError, setMealError] = useState("");
  const [daySelection, setDaySelection] = useState(defaultDaySelection);
  const selectMeal = (meal) => {
    setDaySelection((prev) => ({
      ...prev,
      [meal.mealType]: { 
         id: meal.id,
         title: meal.title,
         image: meal.image,
         summary: meal.summary,
         readyInMinutes: meal.readyInMinutes,
         servings: meal.servings,
         pricePerServing: meal.pricePerServing,
         nutrition: meal.nutrition,
         diets: meal.diets,
         mealType: meal.mealType,
         ingredients: meal.ingredients,
         instructions: meal.instructions,
         },
    }));
  };

  const isDayCompleted = (day) => {
    if (!day) {
      return false;
    }
    return Boolean(day.breakfast && day.lunch && day.dinner);
  };

  const safeWeeklyPlan = weeklyPlan || {};
  const completedDay = days.filter((day) =>
    isDayCompleted(safeWeeklyPlan[day]),
  ).length;

  const handleSaveDayPlan = () => {
    const isNoMealSelected = Object.values(daySelection).some(
      (value) => value === null,
    );
    if (isNoMealSelected) {
      alert("please select meals");
      return;
    }
    setWeeklyPlan((prevState) => {
      return {
        ...prevState,
        [selectedDay]: daySelection,
      };
    });
    const idx = days.indexOf(selectedDay);
    if (setSelectedDay && idx >= 0 && idx < days.length - 1) {
      setSelectedDay(days[idx + 1]);
    }
    console.log("daySelection: ", daySelection);
  };

  const generateWeeklyPlan= async ()=> {
    const weekStartDate = getWeekStartDate();
    const result = await saveCurrentMealPlan(weekStartDate , "manual");
    if (result.success) {
alert("Weekly Plan is generated Successfuly");      
    } else {
      alert("Error generating weekly plan", result.error);
      console.error("Error generating weekly plan", result.error);

    }
  }

  useEffect(() => {
    const savedMeals = weeklyPlan?.[selectedDay] || [];
    if (!savedMeals) {
      setDaySelection(defaultDaySelection);
    }

    const isEmpty = Object.values(savedMeals).every((value) => value === null);

    if (isEmpty) {
      setDaySelection(defaultDaySelection);
    } else {
      setDaySelection(savedMeals);
    }
  }, [selectedDay, weeklyPlan]);

  /** Manual retry (e.g. “Try again”). Same steps as the effect below, without cancellation. */
  async function fetchApiMeals() {
    if (!mealsFetchReady) return;
    try {
      setInternalLoading(true);
      setMealError("");
      const data = await fetchMeals(profileData);
      setApiMeals(data);
    } catch (error) {
      console.error("Spoonacular API:", error.message);
      setMealError(error.message || "Failed to load API meals");
    } finally {
      setInternalLoading(false);
    }
  }

  /**
   * One in-flight request: cleanup marks stale so overlapping fetches don’t all apply results.
   * Runs when Meal Plan should fetch (auth + profile ready) or profile edits after that.
   */
  useEffect(() => {
    if (!mealsFetchReady) return;

    let cancelled = false;

    (async () => {
      try {
        setInternalLoading(true);
        setMealError("");
        const data = await fetchMeals(profileData);
        if (!cancelled) setApiMeals(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Spoonacular API:", error.message);
          setMealError(error.message || "Failed to load API meals");
        }
      } finally {
        if (!cancelled) setInternalLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mealsFetchReady, profileData]);

  const loadingMeals = internalLoading || !mealsFetchReady;

  return {
    apiMeals,
    fetchApiMeals,
    loadingMeals,
    mealError,
    daySelection,
    selectMeal,
    isDayCompleted,
    completedDay,
    handleSaveDayPlan,
    generateWeeklyPlan,
  };
};

export default useMealPlan;
