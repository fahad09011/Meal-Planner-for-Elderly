// with list
import React, { useContext, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import useNutrition from "../hooks/useNutrition";
import useMealPlan from "../hooks/useMealPlan";
import "../assets/styles/mealPlan.css";
import "../assets/styles/button.css";
import Button from "../components/common/Button";
import MealList from "../components/meals/MealList";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import AutoGenerateBanner from "../components/meals/AutoGenerateBanner";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

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
  const {
    weeklyPlan,
    setWeeklyPlan,
    saveWeeklyPlan,
    profileData,
    profileHydrated,
    saveCurrentMealPlan,
    mealPlanLoading,
  } = useContext(AppContext);
  const { authLoading } = useAuth();
  const mealsFetchReady = !authLoading && profileHydrated;
  
  const [selectedDay, SetselectedDay] = useState("Monday");

  const { apiMeals,
     loadingMeals,
      mealError,
       fetchApiMeals,
       daySelection,
    selectMeal,
    isDayCompleted,
    completedDay,
    handleSaveDayPlan,
    generateWeeklyPlan
   } = useMealPlan({ 
      days, 
      weeklyPlan, 
      setWeeklyPlan, 
      selectedDay, 
      setSelectedDay: SetselectedDay,
      saveWeeklyPlan, 
      profileData,
      mealsFetchReady,
      saveCurrentMealPlan });
    
    const { count, filteredMeals } = useNutrition(apiMeals);
    // ise fix krna hai, at a monet local meal file se mealtype calculate kr raha hai 
    const mealsCount = count;

  const progress = Math.round((completedDay / 7) * 100);
  
  function handleSelectedDayOnclick(day) {
    SetselectedDay(day);
    console.log("filtered meals from nutrition service: ",filteredMeals)
    // console.log("from meal plan filter meals",filterMeals)
  }

  return (
    <>
      
      {/* main  wrapper — meal-plan-page wraps layout so day strip can stick while scrolling meals */}
      <main className="mainWrapper meal-plan-page">
        <div className="mealPlanMainContainer">
          <div className="mealPlanMainContainerTitle">
            <h2>Generate Weekly Plan</h2>
          </div>
          <AutoGenerateBanner
            completedDay={completedDay}
            onGenerate={generateWeeklyPlan}
          />
          <section className="daySelectSection" aria-label="Choose day of week">
            <ul className="dayListContainer">
              {days.map((day) => (
                <li key={day} className="dayList">
                  <Button
                    type="button"
                    className={`dayButton ${selectedDay === day ? "button " : "inActive"}`}
                    onClick={() => handleSelectedDayOnclick(day)}
                  >
                    {day.slice(0,3)}
                    {isDayCompleted(weeklyPlan[day]) && (
                      <span className="mealCompleteBadge">
                        <IoMdCheckmarkCircleOutline />
                      </span>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
            <Button className="save-day-btn save-day-btn-top " onClick={handleSaveDayPlan}>
              💾 Save for {selectedDay}
            </Button>
          </section>

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
          <section className="dayTitleSection">
            <h2 className="dayTitle">{`Day ${days.indexOf(selectedDay) + 1} - ${selectedDay}`}</h2>
            <p className="dayText">Choose one meal per category</p>
            {/* Meals load automatically when this page opens (see useMealPlan). Manual fetch removed for simpler UX. */}
            {/* <button type="button" className="testButton" onClick={fetchApiMeals}>
              From Meal Plan
            </button> */}
          </section>

          {loadingMeals ? (
            <section className="loading-container">
              <div className="spinner-wrapper">
                <div className="spinner"></div>
                <p>Loading your meals...</p>
              </div>
            </section>
          ) : mealError ? (
            <section className="error-container">
              <p>{mealError}</p>
              <button type="button" onClick={fetchApiMeals}>Try Again</button>
            </section>
          ) : (
            <div className="cont">
              <MealList
                meals={filteredMeals}
                mealsCount={mealsCount}
                selectMeal={selectMeal}
                weeklyPlan={weeklyPlan}
                daySelection={daySelection}
                selectedDay={selectedDay}
              />
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
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default MealPlan;
