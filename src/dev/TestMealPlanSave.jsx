import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveMealPlan } from "../services/database/mealPlanService";
import { useContext } from "react";
import { AppContext } from "../hooks/AppContext";
import { getMealPlanByWeek } from "../services/database/mealPlanService";
function TestMealPlanSave() {
  const { weeklyPlan } = useContext(AppContext);
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  async function handleTestSave() {
    if (!user) {
      return;
    }

    if (!weeklyPlan || Object.keys(weeklyPlan).length === 0) {
      return;
    }

    setIsSaving(true);
    const weekStartDate = "2026-03-16";

    await saveMealPlan(
      user.id,
      weekStartDate,
      weeklyPlan,
      "manual"
    );
    setIsSaving(false);
  }

  async function handleTestFetch() {
    if (!user) {
      return;
    }
    const weekStartDate = "2026-03-16";
    await getMealPlanByWeek(user.id, weekStartDate);
  }
  return (
    <div>
          <button onClick={handleTestSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Test Save Meal Plan"}
          </button>

          <button onClick={handleTestFetch}>
            Test get plan
          </button>
        </div>);

}

export default TestMealPlanSave;