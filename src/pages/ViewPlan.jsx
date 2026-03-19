import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import "../assets/styles/viewplan.css";
import Button from "../components/common/Button";
import DayPlanCard from "../components/meals/DayPlanCard";
import { IoCalendarOutline } from "react-icons/io5";

const DAYS = [
  "Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday","Sunday"
];

function ViewPlan() {
  const { weeklyPlan } = useContext(AppContext);
  const [activeDay, setActiveDay] = useState("Monday");

  const completedDays = DAYS.filter(
    (day) =>
      weeklyPlan[day]?.breakfast &&
      weeklyPlan[day]?.lunch &&
      weeklyPlan[day]?.dinner
  ).length;

  const progress = Math.round((completedDays / 7) * 100);

  return (
    <div className="viewPlanMainContainer">

      {/* ── Header ── */}
      <section className="viewPlanHeaderSection">
        <div className="viewplanLeftHeader">
          <h2 className="viewplanHeading">
            <IoCalendarOutline className="calenderIcon" />
            My weekly meal plan
          </h2>
          <p className="viewPlandate">Week of 18–24 March 2026</p>
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
          <Button className="button">Edit plan</Button>
          <Button className="inActive button">Print PDF</Button>
        </div>
      </section>

      {/* ── Day tabs ── */}
      <section className="dayTabSection">
        {DAYS.map((day) => {
          const d = weeklyPlan[day];
          const done =
            (d?.breakfast ? 1 : 0) +
            (d?.lunch ? 1 : 0) +
            (d?.dinner ? 1 : 0);
          return (
            <button
              key={day}
              className={`dayTab ${activeDay === day ? "dayTab--active" : ""}`}
              onClick={() => setActiveDay(day)}
            >
              <span className="dayTab__name">{day.slice(0, 3)}</span>
              <div className="dayTab__dots">
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <span
                    key={meal}
                    className={`dayTab__dot ${
                      weeklyPlan[day]?.[meal] ? "dayTab__dot--done" : ""
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </section>

      {/* ── Day card ── */}
      <section className="mealSection">
        <DayPlanCard
          day={activeDay}
          dayPlan={weeklyPlan[activeDay]}
        />
      </section>

      {/* ── Bottom action bar ── */}
      <section className="viewPlanActionBar">
        <div className="viewPlanActionLeft">
          <p className="viewPlanActionTitle">Ready to shop?</p>
          <p className="viewPlanActionSub">
            Generate your shopping list from this week's meals
          </p>
        </div>
        <Button className="inActive button">Mark today done</Button>
        <Button className="button">Generate shopping list</Button>
      </section>

    </div>
  );
}

export default ViewPlan;