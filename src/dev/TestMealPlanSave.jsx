import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveMealPlan } from "../services/database/mealPlanService";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { getMealPlanByWeek } from "../services/database/mealPlanService";
function TestMealPlanSave() {
    const { weeklyPlan } = useContext(AppContext);
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    async function handleTestSave() {
        if (!user) {
            console.error("No logged-in user found.");
            return;
          }
          
          if (!weeklyPlan || Object.keys(weeklyPlan).length === 0) {
            console.error("No weekly plan data available to save.");
            return;
          }
          
          setIsSaving(true);
          const weekStartDate = "2026-03-16";
       
          const result = await saveMealPlan(
            user.id,
            weekStartDate,
            weeklyPlan,
            "manual"
          );
          console.log("Save meal plan result:", result);
          setIsSaving(false);
    }

    async function handleTestFetch() {
      if (!user) {
        console.error("No logged-in user found.");
        return;
      }
      const weekStartDate = "2026-03-16";
      const result = await getMealPlanByWeek(user.id , weekStartDate);
      console.log("Fetch meal plan result:", result);
console.log("Fetched weekly plan:", result?.data?.weekly_plan);
    }
    return (
        <div>
          <button onClick={handleTestSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Test Save Meal Plan"}
          </button>

          <button onClick={handleTestFetch} >
            Test get plan
          </button>
        </div>
      );
}

export default TestMealPlanSave;
