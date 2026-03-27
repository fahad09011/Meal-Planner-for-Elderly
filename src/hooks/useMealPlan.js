import { useState, useEffect } from "react";
import fetchMeals from "../services/spoonacularService";
import { getWeekStartDate } from "../utils/helpers";

const GUEST_SAVE_MESSAGE =
  "To save your meal plan you need an account. Please sign in or create one from the login page.";

const useMealPlan = ({
  days,
  mealPlanDraft,
  setMealPlanDraft,
  selectedDay,
  setSelectedDay,
  profileData,
  saveCurrentMealPlan,
  mealsFetchReady = true,
  user = null,
}) => {
  const defaultDaySelection = {
    breakfast: null,
    lunch: null,
    dinner: null,
  };

  const [apiMeals, setApiMeals] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [mealError, setMealError] = useState("");
  const [mealsRequested, setMealsRequested] = useState(false);
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
    if (!day) return false;
    return Boolean(day.breakfast && day.lunch && day.dinner);
  };

  const safeDraft = mealPlanDraft || {};
  const completedDay = days.filter((day) =>
    isDayCompleted(safeDraft[day])
  ).length;

  const handleSaveDayPlan = () => {
    const isNoMealSelected = Object.values(daySelection).some(
      (value) => value === null
    );

    if (isNoMealSelected) {
      alert("Please choose breakfast, lunch and dinner before saving this day.");
      return;
    }

    setMealPlanDraft((prevState) => ({
      ...prevState,
      [selectedDay]: daySelection,
    }));

    const idx = days.indexOf(selectedDay);
    if (setSelectedDay && idx >= 0 && idx < days.length - 1) {
      setSelectedDay(days[idx + 1]);
    }

    console.log("daySelection: ", daySelection);
  };

  const generateWeeklyPlan = async (generationMode = "manual") => {
    if (!user) {
      alert(GUEST_SAVE_MESSAGE);
      return;
    }

    const weekStartDate = getWeekStartDate();
    const result = await saveCurrentMealPlan(weekStartDate, generationMode);

    if (result.success) {
      alert("Weekly Plan is generated Successfully");
      if (setSelectedDay) setSelectedDay("Monday");
    } else {
      alert("Error generating weekly plan");
      console.error("Error generating weekly plan", result.error);
    }
  };

  useEffect(() => {
    const savedMeals = mealPlanDraft?.[selectedDay] || defaultDaySelection;

    const isEmpty = Object.values(savedMeals).every((value) => value === null);

    if (isEmpty) {
      setDaySelection(defaultDaySelection);
    } else {
      setDaySelection(savedMeals);
    }
  }, [selectedDay, mealPlanDraft]);

  useEffect(() => {
    if (!mealsFetchReady) return;

    let cancelled = false;

    (async () => {
      setMealsRequested(true);
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

  async function fetchApiMeals() {
    if (!mealsFetchReady) return;

    setMealsRequested(true);

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

  const loadingMeals = internalLoading;

  return {
    apiMeals,
    fetchApiMeals,
    loadingMeals,
    mealsRequested,
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