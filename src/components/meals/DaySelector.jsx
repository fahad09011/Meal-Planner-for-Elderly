import React from "react";
import Button from "../common/Button";
import "../../assets/styles/mealPlan.css";
import "../../assets/styles/viewplan.css";
import "../../assets/styles/button.css";

function DaySelector({ days, selectedDay, onDayClick, onSave, weeklyPlan, isDayCompleted }) {
  return (
    <section className="daySelectSection">
      <div className="daySelectSection-tabsWrap">
        <div className="view-plan-day-tabs meal-plan-day-tabs" role="tablist">
          {days.map((day) => {
            const dayPlan = weeklyPlan[day];
            const dayComplete = isDayCompleted(dayPlan);
            return (
              <button
                key={day}
                type="button"
                role="tab"
                aria-selected={selectedDay === day}
                className={`view-plan-day-tab ${
                selectedDay === day ? "view-plan-day-tab--active" : ""}`
                }
                onClick={() => onDayClick(day)}>
                
                <span className="view-plan-day-tab-name">{day.slice(0, 3)}</span>
                <div className="view-plan-day-tab-dots">
                  {["breakfast", "lunch", "dinner"].map((mealSlot) =>
                  <span
                    key={mealSlot}
                    className={`view-plan-day-tab-dot ${
                    dayPlan?.[mealSlot] ? "view-plan-day-tab-dot--planned" : ""} ${

                    dayComplete && dayPlan?.[mealSlot] ? "view-plan-day-tab-dot--done" : ""}`
                    } />

                  )}
                </div>
              </button>);

          })}
        </div>
      </div>

      <Button className="save-day-btn save-day-btn-top" onClick={onSave}>
        💾 Save for {selectedDay}
      </Button>
    </section>);

}

export default DaySelector;