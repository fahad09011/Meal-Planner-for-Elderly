import { useState, useEffect } from "react";
import fetchMeals from "../services/spoonacularService";

const useMealPlan = ({
  days,
  weeklyPlan,
  setWeeklyPlan,
  selectedDay,
  saveWeeklyPlan,
}) => {
  const defaultDaySelection = {
    breakfast: null,
    lunch: null,
    dinner: null,
  };
  const [apiMeals, setApiMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [mealError, setMealError] = useState("");
  const [daySelection, setDaySelection] = useState(defaultDaySelection);
  const selectMeal = (meal) => {
    setDaySelection((prev) => ({
      ...prev,
      [meal.mealType]: { id: meal.id, title: meal.title },
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

  const handleSaveDayPlan =()=> {
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
  }

  const generateWeeklyPlan=()=> {
    saveWeeklyPlan(weeklyPlan);
    alert("Weekly Plan is generated Successfuly");
    console.log("Weekly Plan is generated Successfuly", weeklyPlan);
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
    console.log(
            "user select meal for day: ",
            selectedDay,
            " meal: ",
            weeklyPlan,
          );
  }, [selectedDay, weeklyPlan]);

  const fetchApiMeals = async () => {
    try {
      setLoadingMeals(true);
      setMealError("");

      const data = await fetchMeals();
      setApiMeals(data);

      console.log("API meal in useMealPlan hook  ", data);
    } catch (error) {
      console.error("Spoonacular API:", error.message);
      setMealError(error.message || "Failed to load API meals");
    } finally {
      setLoadingMeals(false);
    }
  };

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
