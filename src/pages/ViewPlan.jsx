import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import "../assets/styles/viewplan.css";
import Button from "../components/common/Button";
import DayPlanCard from "../components/meals/DayPlanCard";
import { useNavigate } from "react-router-dom";
import { getWeekStartDate,getWeekLastDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
const DAYS = [
  "Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday","Sunday"
];

function ViewPlan() {
  const { authLoading } = useAuth();
  const weekStartDate = getWeekStartDate();
  const weekEndDate = getWeekLastDate();

  const { weeklyPlan, loadMealPlanForWeek, mealPlanLoading } = useContext(AppContext);
  const [activeDay, setActiveDay] = useState("Monday");
  const navigate = useNavigate();

  const completedDays = DAYS.filter((day) =>
    weeklyPlan[day]?.breakfast &&
    weeklyPlan[day]?.lunch &&
    weeklyPlan[day]?.dinner
  ).length;

  const progress = Math.round((completedDays / 7) * 100);

 

  useEffect(()=>{
    // loadMealPlanForWeek(weekStartDate);
    if(authLoading) return;
    
    const fetchSavemealPlan = async ()=>{
      const result = await loadMealPlanForWeek(weekStartDate)
      console.log("weeklyPlan from DB", result);
    };
  fetchSavemealPlan();
  },[authLoading,weekStartDate]);

  useEffect(() => {
    console.log("weeklyPlan from context:", weeklyPlan);
  }, [weeklyPlan]);


  if (mealPlanLoading || authLoading) {
    return <div>Loading saved meal plan...</div>;
  }
  return (
    
    <div className="viewPlanMainContainer">

      {/* ── Header ── */}
      <section className="viewPlanHeaderSection">
        <div className="viewplanLeftHeader">
          <h2 className="viewplanHeading">My weekly meal plan</h2>
          <p className="viewPlandate">{`Week ${weekStartDate} To ${weekEndDate}`}</p>
        </div>
        <div className="viewplanRightHeader">
          <div className="viewPlanProgressWrap">
            <div className="viewPlanProgressBar">
              <div
                className="viewPlanProgressFill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="viewPlanProgressLabel">
              {completedDays}/7 days complete
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
      <section className="dayTabSection">
        {DAYS.map((day) => {
          const d = weeklyPlan[day];
          const meals = ["breakfast","lunch","dinner"];
          return (
            <button
              key={day}
              className={`dayTab ${activeDay === day ? "dayTab--active" : ""}`}
              onClick={() => setActiveDay(day)}
            >
              <span className="dayTab__name">{day.slice(0,3)}</span>
              <div className="dayTab__dots">
                {meals.map((m) => (
                  <span
                    key={m}
                    className={`dayTab__dot ${d?.[m] ? "dayTab__dot--done" : ""}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </section>

      {/* ── Day cards ── */}
      <section className="mealSection">
        <DayPlanCard
          day={activeDay}
          dayPlan={weeklyPlan[activeDay]}
        />
      </section>

    </div>
  );
}

export default ViewPlan;