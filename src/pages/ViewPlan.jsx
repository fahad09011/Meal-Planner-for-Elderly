import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useMealTracking from "../hooks/useMealTracking";
import "../assets/styles/viewplan.css";
import Button from "../components/common/Button";
import DayPlanCard from "../components/meals/DayPlanCard";
import { getWeekStartDate, getWeekLastDate } from "../utils/helpers";
import { getMealCompletions } from "../services/mealCompletionService";
const DAYS = [
  "Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday","Sunday"
];

function ViewPlan() {
  const { authLoading } = useAuth();
  const { weeklyPlan, loadMealPlanForWeek, mealPlanLoading, mealPlanId	 } = useContext(AppContext);
  const [activeDay, setActiveDay] = useState("Monday");
  const navigate = useNavigate();

  const weekStartDate = getWeekStartDate();
  const weekEndDate   = getWeekLastDate();
  async function fetchMealCompletionsForTest() {
    if (!mealPlanId) {
      console.log("No mealPlanId yet");
      return;
    }
  
    const result = await getMealCompletions(mealPlanId);
    console.log("Meal completions from DB:", result.data);
  }
  useEffect(() => {
    fetchMealCompletionsForTest();
  }, [mealPlanId]);

  // ── Tracking is completely separate from planning ──
  const {
    mealTracking,
    trackingLoading,
    toggleMealDone,
    markDayDone,
    completedDays,
    progress,
    isDayComplete,
    isMealDone,
  } = useMealTracking(mealPlanId);

  // ── Load the saved meal plan ──
  useEffect(() => {
    if (authLoading) return;
    const fetch = async () => {
      const result = await loadMealPlanForWeek(weekStartDate);
      console.log("weeklyPlan from DB:", result);
    };
    fetch();
  }, [authLoading, weekStartDate]);

  if (mealPlanLoading || authLoading || trackingLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-wrapper">
          <div className="spinner" />
          <p>Loading your meal plan…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-plan-page">

      {/* ── Header ── */}
      <section className="view-plan-header">
        <div className="view-plan-header-left">
          <h2 className="view-plan-title">My weekly meal plan</h2>
          <p className="view-plan-date">
            {`Week ${weekStartDate} to ${weekEndDate}`}
          </p>
        </div>

        <div className="view-plan-header-right">
          <div className="view-plan-progress">
            <div className="view-plan-progress-track">
              <div
                className="view-plan-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="view-plan-progress-text">
              {completedDays}/7 days eaten
            </span>
          </div>
          <Button className="inActive button">Print PDF</Button>
          <Button
            className="button"
            onClick={() => navigate("/shoppingList")}
          >
            Shopping list
          </Button>
        </div>
      </section>

      {/* ── Day tabs ── */}
      <section className="view-plan-day-tabs">
        {DAYS.map((day) => {
          const d = weeklyPlan[day];
          return (
            <button
              key={day}
              className={`view-plan-day-tab ${
                activeDay === day ? "view-plan-day-tab--active" : ""
              }`}
              onClick={() => setActiveDay(day)}
            >
              <span className="view-plan-day-tab-name">{day.slice(0, 3)}</span>
              <div className="view-plan-day-tab-dots">
                {["breakfast","lunch","dinner"].map((m) => (
                  <span
                    key={m}
                    className={`view-plan-day-tab-dot ${
                      // dot = meal is planned (not eaten)
                      d?.[m] ? "view-plan-day-tab-dot--planned" : ""
                    } ${
                      // dot filled = meal is eaten
                      isMealDone(day, m) ? "view-plan-day-tab-dot--done" : ""
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </section>

      {/* ── Day card ── */}
      <section className="view-plan-content">
        <DayPlanCard
          day={activeDay}
          dayPlan={weeklyPlan[activeDay]}
          isMealDone={isMealDone}
          toggleMealDone={toggleMealDone}
          markDayDone={markDayDone}
          isDayComplete={isDayComplete}
        />
      </section>

    </div>
  );
}

export default ViewPlan;