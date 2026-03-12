// with list
import React, { useContext, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import useNutrition from "../hooks/useNutrition";
import useMealPlan from "../hooks/useMealPlan";
import "../assets/styles/mealPlan.css";
import "../assets/styles/button.css";
import Button from "../components/common/Button";
import { useEffect } from "react";
import MealList from "../components/meals/MealList";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { AppContext } from "../context/AppContext";

function MealPlan() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const { weeklyPlan, setWeeklyPlan, saveWeeklyPlan } = useContext(AppContext);
  
  const [selectedDay, SetselectedDay] = useState("Monday");

  const { apiMeals, loadingMeals, mealError, fetchApiMeals,daySelection,
    selectMeal,setDaySelection,isDayCompleted,completedDay,handleSaveDayPlan,generateWeeklyPlan } = useMealPlan({days,weeklyPlan,setWeeklyPlan,selectedDay,saveWeeklyPlan});

    // ise fix krna hai, at a monet local meal file se mealtype calculate kr raha hai 
    const mealsCount = useNutrition().count;

  const progress = Math.round((completedDay / 7) * 100);
  

  
  
  // const [daySelection, setDaySelection] = useState({
  //   breakfast: null,
  //   lunch: null,
  //   dinner: null,
  // });
  function handleSelectedDayOnclick(day) {
    SetselectedDay(day);
    // console.log("from meal plan filter meals",filterMeals)
  }

  // function isDayCompleted(day) {
  //   return day.breakfast && day.lunch && day.dinner;
  // }

  // function selectMeal(meal) {
  //   setDaySelection((prev) => ({
  //     ...prev,
  //     [meal.mealType]: { id: meal.id, name: meal.title },
  //   }));
  // }

  

  // function handleSaveDayPlan() {
  //   const isNoMealSelected = Object.values(daySelection).some(
  //     (value) => value === null,
  //   );
  //   if (isNoMealSelected) {
  //     alert("please select meals");
  //     return;
  //   }
  //   setWeeklyPlan((prevState) => {
  //     return {
  //       ...prevState,
  //       [selectedDay]: daySelection,
  //     };
  //   });
  // }

  // function generateWeeklyPlan() {
  //   saveWeeklyPlan(weeklyPlan);
  //   alert("Weekly Plan is generated Successfuly");
  //   console.log("Weekly Plan is generated Successfuly", weeklyPlan);
  // }

  //  reset day meal selection for next day
  // useEffect(() => {
  //   const savedMeals = weeklyPlan[selectedDay];
  //   const isEmpty = Object.values(savedMeals).every((value) => value === null);
  //   if (isEmpty) {
  //     setDaySelection({
  //       breakfast: null,
  //       lunch: null,
  //       dinner: null,
  //     });
  //   } else {
  //     setDaySelection(savedMeals);
  //   }
  //   console.log(
  //     "user select meal for day: ",
  //     selectedDay,
  //     " meal: ",
  //     weeklyPlan,
  //   );

  //   // let count = days.filter((day) => isDayCompleted(weeklyPlan[day])).length;
  //   // setcompletedDay(count);
  //   console.log("day comletes: ", completedDay);
  //   // console.log("day count as complete: ", count);
    
  // }, [selectedDay, weeklyPlan]);





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
                    {isDayCompleted(weeklyPlan[day]) && (
                      <span className="mealCompleteBadge">
                        <IoMdCheckmarkCircleOutline />
                      </span>
                    )}
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
            <button type="button" onClick={fetchApiMeals}>
              From Meal Plan
            </button>
          </section>
        </main>
              {loadingMeals && <p>Loading Meals</p>}
              {mealError && <p>{mealError}</p>}
        <MealList
          meals={apiMeals}
          mealsCount={mealsCount}
          selectMeal={selectMeal}
          weeklyPlan={weeklyPlan}
          daySelection={daySelection}
          selectedDay={selectedDay}
        />

        {/* button section */}
        <section className="action-buttons-section">
          <div className="day-actions">
            <Button className="save-day-btn" onClick={handleSaveDayPlan}>
              💾 Save for {selectedDay}
            </Button>

            <Button
              className="generate-plan-btn"
              disabled={completedDay === 7 ? false : true}
              onClick={generateWeeklyPlan}
            >
              ✅ Generate Weekly Plan
            </Button>
          </div>
          
        </section>
      </main>
    </>
  );
}

export default MealPlan;
