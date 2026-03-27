import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useMealTracking from "../hooks/useMealTracking";
import "../assets/styles/viewplan.css";
import Button from "../components/common/Button";
import DayPlanCard from "../components/meals/DayPlanCard";
import { getWeekStartDate, getWeekLastDate } from "../utils/helpers";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function ViewPlan() {
  const { authLoading } = useAuth();
  const {
    weeklyPlan,
    loadMealPlanForWeek,
    mealPlanLoading,
    mealPlanId,
    mealPlanTrackingEpoch,
  } = useContext(AppContext);
  const [activeDay, setActiveDay] = useState("Monday");
  const navigate = useNavigate();

  const weekStartDate = getWeekStartDate();
  const weekEndDate = getWeekLastDate();

  const {
    trackingLoading,
    toggleMealDone,
    markDayDone,
    completedDays,
    progress,
    isDayComplete,
    isMealDone,
  } = useMealTracking(mealPlanId, mealPlanTrackingEpoch);

  useEffect(() => {
    if (authLoading) return;
    loadMealPlanForWeek(weekStartDate);
  }, [authLoading, weekStartDate]);

  if (mealPlanLoading || authLoading || trackingLoading) {
    return (
      <div className="loading-container" aria-busy="true" aria-live="polite">
        <div className="spinner-wrapper">
          <div className="spinner" />
          <p>Loading your meal plan…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="view-plan-page" id="view-plan-main">
      <header className="view-plan-page-intro">
        <h1 className="view-plan-title view-plan-title--page">This week&apos;s meals</h1>
        <p className="view-plan-lede">
          Tap a day to see what is planned. Mark meals when you have eaten them. Green dots show
          progress.
        </p>
      </header>

      <section className="view-plan-header" aria-label="Week and shortcuts">
        <div className="view-plan-header-left">
          <p className="view-plan-date view-plan-date--emphasis">
            Week of <time dateTime={weekStartDate}>{weekStartDate}</time> to{" "}
            <time dateTime={weekEndDate}>{weekEndDate}</time>
          </p>
        </div>

        <div className="view-plan-header-right">
          <div className="view-plan-progress" aria-label={`Eaten: ${completedDays} of 7 days`}>
            <div className="view-plan-progress-track">
              <div
                className="view-plan-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="view-plan-progress-text">
              {completedDays} of 7 days eaten
            </span>
          </div>
          <Button type="button" className="inActive button view-plan-header-btn" disabled>
            Print (soon)
          </Button>
          <Button
            type="button"
            className="button view-plan-header-btn"
            onClick={() => navigate("/shopping")}
            aria-label="Open shopping list"
          >
            Shopping list
          </Button>
        </div>
      </section>

      <section
        className="view-plan-day-tabs"
        role="tablist"
        aria-label="Choose a day of the week"
      >
        {DAYS.map((day) => {
          const d = weeklyPlan[day];
          const selected = activeDay === day;
          return (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`view-plan-tab-${day}`}
              aria-controls={`view-plan-panel-${day}`}
              className={`view-plan-day-tab ${selected ? "view-plan-day-tab--active" : ""}`}
              onClick={() => setActiveDay(day)}
            >
              <span className="view-plan-day-tab-name">{day.slice(0, 3)}</span>
              <div className="view-plan-day-tab-dots" aria-hidden="true">
                {["breakfast", "lunch", "dinner"].map((m) => (
                  <span
                    key={m}
                    className={`view-plan-day-tab-dot ${
                      d?.[m] ? "view-plan-day-tab-dot--planned" : ""
                    } ${isMealDone(day, m) ? "view-plan-day-tab-dot--done" : ""}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </section>

      <section
        className="view-plan-content"
        role="tabpanel"
        id={`view-plan-panel-${activeDay}`}
        aria-labelledby={`view-plan-tab-${activeDay}`}
      >
        <DayPlanCard
          day={activeDay}
          dayPlan={weeklyPlan[activeDay]}
          isMealDone={isMealDone}
          toggleMealDone={toggleMealDone}
          markDayDone={markDayDone}
          isDayComplete={isDayComplete}
        />
      </section>
    </main>
  );
}

export default ViewPlan;
