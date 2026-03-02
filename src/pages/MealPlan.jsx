// with list
import React, { useContext, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import useNutrition from "../hooks/useNutrition";
import "../assets/styles/mealPlan.css";
import "../assets/styles/button.css";
import Button from "../components/common/Button";
import { useEffect } from "react";
import MealList from "../components/meals/MealList";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Popup from "../components/common/PopUp";
import { AppContext } from "../context/AppContext";

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

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const {weeklyPlan, setWeeklyPlan,saveWeeklyPlan} = useContext(AppContext);
  // const [weeklyPlan, setWeeklyPlan] = useState({
  //   Monday: { breakfast: null, lunch: null, dinner: null },
  //   Tuesday: { breakfast: null, lunch: null, dinner: null },
  //   Wednesday: { breakfast: null, lunch: null, dinner: null },
  //   Thursday: { breakfast: null, lunch: null, dinner: null },
  //   Friday: { breakfast: null, lunch: null, dinner: null },
  //   Saturday: { breakfast: null, lunch: null, dinner: null },
  //   Sunday: { breakfast: null, lunch: null, dinner: null },
  // });
  const [daySelection, setDaySelection] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  function handleSelectedDayOnclick(day) {
    SetselectedDay(day);
    // console.log("from meal plan filter meals",filterMeals)
  }

  function isDayCompleted(day) {
    // const dayPlan=weeklyPlan[day];
    // let count =0
    // if(dayPlan.breakfast && dayPlan.lunch && dayPlan.dinner){
    //   count++;
    // };
    // console.log("testing dayyyyy ",day ," ",weeklyPlan[day])
    return day.breakfast && day.lunch && day.dinner;
  }
  function selectMeal(meal) {
    setDaySelection((prev) => ({
      ...prev,
      [meal.category]: { id: meal.id, name: meal.name },
    }));
  }

  function handleSaveDayPlan() {
    const isNoMealSelected = Object.values(daySelection).some(
      (value) => value === null,
    );
    if (isNoMealSelected) {
      alert("please select meals");
      return;
    }
    setWeeklyPlan((prevState) => {
      return {
        ...prevState,
        [selectedDay]: daySelection,
      };
    });
    // setcompletedDay((prev) => prev + 1);
  }


// save plan method
  // function saveWeeklyPlan() {
  //   localStorage.setItem("Plan", JSON.stringify(weeklyPlan))
  //   const savedPlanString = localStorage.getItem("Plan");
  //   const savedPlan = JSON.parse(savedPlanString)
  //   console.log("Saved weekly Plan:" ,savedPlan);
  // }





  function generateWeeklyPlan() {
    // console.log("test generate weekly plan button")
    // console.log("test generate weekly plan button")
    // setIsPopUpOpen(true);
    // console.log(
    //  "popup: ",isPopUpOpen
    // );
    saveWeeklyPlan(weeklyPlan);
    alert("Weekly Plan is generated Successfuly");
    console.log("Weekly Plan is generated Successfuly", weeklyPlan);
  }
  //  reset day meal selection for next day
  useEffect(() => {
    const savedMeals = weeklyPlan[selectedDay];
    const isEmpty = Object.values(savedMeals).every((value) => value === null);
    if (isEmpty) {
      setDaySelection({
        breakfast: null,
        lunch: null,
        dinner: null,
      });
    } else {
      setDaySelection(savedMeals);
    }
    console.log(
      "user select meal for day: ",
      selectedDay,
      " meal: ",
      weeklyPlan,
    );
    let count = days.filter((day) => isDayCompleted(weeklyPlan[day])).length;
    setcompletedDay(count);
    console.log("day comletes: ", completedDay);
    console.log("day count as complete: ", count, "popup: ", isPopUpOpen);
  }, [selectedDay, weeklyPlan]);







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
            {/* <button type="button" onClick={selectMeal}>
              From Meal Plan
            </button> */}
          </section>
        </main>

        <MealList
          meals={filterMeals}
          mealsCount={mealsCount}
          selectMeal={selectMeal}
          weeklyPlan={weeklyPlan}
          daySelection={daySelection}
          selectedDay={selectedDay}
        />

        {/* // random tags are optional discuss with supervisor */}
        {/* <MealList meals={filterMeals} mealsCount={mealsCount} getRandonMealTag={getRandonMealTag}/> */}

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
          <div className="popUp">{isPopUpOpen ? <Popup /> : ""}</div>
        </section>
      </main>
    </>
  );
}

export default MealPlan;
