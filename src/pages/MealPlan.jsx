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
  const mealsCount = useNutrition().count;

  {
    /* // random tags are optional discuss with supervisor */
  }
  // const getRandonMealTag = useNutrition().getRandonMealTag;
  const [selectedDay, SetselectedDay] = useState("Monday");
  const [completedDay, setcompletedDay] = useState(0);
  const progress = Math.round((completedDay / 7) * 100);
  const filterMeals = useNutrition().filteredMeals;

  function handleSelectedDayOnclick(day) {
    SetselectedDay(day);
    // console.log("from meal plan filter meals",filterMeals)
  }


  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [weeklyPlan, setWeeklyPlan] = useState({
    Monday: { breakfast: null, lunch: null, dinner: null },
    Tuesday: { breakfast: null, lunch: null, dinner: null },
    Wednesday: { breakfast: null, lunch: null, dinner: null },
    Thursday: { breakfast: null, lunch: null, dinner: null },
    Friday: { breakfast: null, lunch: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, dinner: null },
  })
 const [daySelection, setDaySelection] = useState({
  breakfast: null,
  lunch: null,
  dinner: null
});


 function selectMeal(meal) {
  setDaySelection(prev => ({
    ...prev,
    [meal.category]: {id: meal.id, name: meal.name}
  }));
}
  

   function handleSaveDayPlan() {
     const isNoMealSelected = Object.values(daySelection).some(value => value === null);
   if (isNoMealSelected) {
    alert("please select meals");
    return;
   } 
    setWeeklyPlan((prevState)=>{
      return{
        ...prevState,
        [selectedDay]:  daySelection
      }
    })
    setcompletedDay((prev)=>prev+1)
   }


  //  reset day meal selection for next day
     useEffect(() => {
      const savedMeals = weeklyPlan[selectedDay];
      const isEmpty = Object.values(savedMeals).every(value => value === null);
      if (isEmpty) {
        setDaySelection({
  breakfast: null,
  lunch: null,
  dinner: null
});
      } else {
        setDaySelection(savedMeals);
      }
    console.log("user select meal for day: ",selectedDay," meal: ",weeklyPlan);
  }, [selectedDay,weeklyPlan]);

  //   useEffect(() => {
  //   console.log(selectedDay);
  // }, [selectedDay]);
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
            <button type="button" onClick={selectMeal}>
              From Meal Plan
            </button>
          </section>
        </main>

        <MealList meals={filterMeals} mealsCount={mealsCount} selectMeal={selectMeal} weeklyPlan={weeklyPlan}   daySelection={daySelection}

selectedDay={selectedDay}

/>

        {/* // random tags are optional discuss with supervisor */}
        {/* <MealList meals={filterMeals} mealsCount={mealsCount} getRandonMealTag={getRandonMealTag}/> */}

        {/* button section */}
        <section className="action-buttons-section">
          <div className="day-actions">
            <Button className="save-day-btn" onClick={handleSaveDayPlan}>💾 Save for {selectedDay}</Button>

            <Button className="generate-plan-btn">
              ✅ Generate Weekly Plan
            </Button>
          </div>
        </section>
        
      </main>
    </>
  );
}

export default MealPlan;
