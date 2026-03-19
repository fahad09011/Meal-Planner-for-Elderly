import React from "react";
import Button from "../common/Button";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

function DaySelector({ days, selectedDay, onDayClick, onSave, weeklyPlan, isDayCompleted }) {
  return (
    <section className="daySelectSection">
      <ul className="dayListContainer">
        {days.map((day) => (
          <li key={day} className="dayList">
            <Button
              type="button"
              className={`dayButton ${selectedDay === day ? "button" : "inActive"}`}
              onClick={() => onDayClick(day)}
            >
              {day.slice(0, 3)}
              {isDayCompleted(weeklyPlan[day]) && (
                <span className="mealCompleteBadge">
                  <IoMdCheckmarkCircleOutline />
                </span>
              )}
            </Button>
          </li>
        ))}
      </ul>

      <Button
        className="save-day-btn save-day-btn-top"
        onClick={onSave}
      >
        💾 Save for {selectedDay}
      </Button>
    </section>
  );
}

export default DaySelector;