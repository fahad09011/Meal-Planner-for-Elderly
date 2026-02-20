// with list
import React, { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import useNutrition from "../hooks/useNutrition";
import "../assets/styles/mealPlan.css";
import "../assets/styles/button.css";
import Button from "../components/common/Button";
import { useEffect } from "react";
import MealList from "../components/meals/MealList";
function MealPlan() {
  const meals = useNutrition();
  const [selectedDay, SetselectedDay] = useState("Monday");
  const [completedDay, setcompletedDay] = useState(3);
  const progress = Math.round((completedDay / 7) * 100);
  const filterMeals = useNutrition().filteredMeals;
  function handleSelectedDayOnclick(day) {
    SetselectedDay(day);
  }
  useEffect(() => {
    console.log(selectedDay);
  }, [selectedDay]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  function handlefiltereredMealsOnClick() {
    console.log(filterMeals);
  }
  const weeklyPlan = {
    Monday: { brealfast: null, lunch: null, dinner: null },
    Tuesday: { brealfast: null, lunch: null, dinner: null },
    Wednesday: { brealfast: null, lunch: null, dinner: null },
    Thursday: { brealfast: null, lunch: null, dinner: null },
    Friday: { brealfast: null, lunch: null, dinner: null },
    Saturday: { brealfast: null, lunch: null, dinner: null },
    Sunday: { brealfast: null, lunch: null, dinner: null },
  };
  return (
    <>
      {/* main  wrapper*/}
      <main className="mainWrapper ">
        {/* main  container*/}
        <main className="mealPlanMainContainer">
          {/* title container */}
          <div className="mealPlanMainContainerTitle">
            <h2>Generate Weekly Plan</h2>
          </div>

          {/* day selectior section */}
          <section className="daySelectSection">
            <ul className="dayListContainer">
              {days.map((day) => (
                <li key={day} className="dayList">
                  <Button
                    type="button"
                    className={selectedDay === day ? "button" : "inActive"}
                    onClick={() => handleSelectedDayOnclick(day)}
                  >
                    {day}
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          {/* progress bar section */}
          <section className="progressBarSection">
            <ProgressBar
              bgColor="#678B7A"
              height="40px"
              completed={progress}
              labelAlignment="center"
              customLabel={`${completedDay}/7 completed`}
              maxCompleted={100}
            />
          </section>
          {/* day title section */}
          <section className="dayTitleSection">
            <h2 className="dayTitle">{`Day ${days.indexOf(selectedDay) + 1} ${selectedDay}`}</h2>
            <h2 className="dayText">- Choose your for the Day</h2>
            {/* <button type="button" onClick={handlefiltereredMealsOnClick}>
              From Meal Plan
            </button> */}
          </section>
        </main>

        <MealList meals={filterMeals} />
      </main>
    </>
  );
}

export default MealPlan;
