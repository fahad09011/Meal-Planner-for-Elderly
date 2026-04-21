import React, { useContext, useState } from "react";
import { generateAutoWeeklyPlan } from "../utils/generateAutoWeeklyPlan";
import ProgressBar from "@ramonak/react-progress-bar";
import useNutrition from "../hooks/useNutrition";
import useMealPlan from "../hooks/useMealPlan";
import "../assets/styles/mealPlan.css";
import "../assets/styles/viewplan.css";
import "../assets/styles/button.css";
import Button from "../components/common/Button";
import MealList from "../components/meals/MealList";
import AutoGenerateBanner from "../components/meals/AutoGenerateBanner";
import { AppContext } from "../hooks/AppContext";
import { useAuth } from "../context/AuthContext";

function MealPlan() {
  const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"];


  const {
    mealPlanDraft,
    setMealPlanDraft,
    profileData,
    profileHydrated,
    saveCurrentMealPlan
  } = useContext(AppContext);

  const { authLoading, user } = useAuth();
  const mealsFetchReady = !authLoading && profileHydrated;

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [generationMode, setGenerationMode] = useState("manual");

  const {
    apiMeals,
    loadingMeals,
    mealsRequested,
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
    mealPlanDraft,
    setMealPlanDraft,
    selectedDay,
    setSelectedDay,
    profileData,
    mealsFetchReady,
    saveCurrentMealPlan,
    user
  });

  const { count, filteredMeals } = useNutrition(apiMeals);
  const mealsCount = count;

  function handleAutoGenerateWeeklyPlan() {
    if (!filteredMeals.length) {
      alert(
        "There are no recipes to use yet. Wait for the list to finish loading, or check your filters."
      );
      return;
    }

    const generatedPlan = generateAutoWeeklyPlan(filteredMeals);
    setMealPlanDraft(generatedPlan);
    setGenerationMode("auto");
    setSelectedDay("Monday");
  }

  function handleManualSaveDayPlan() {
    handleSaveDayPlan();
    setGenerationMode("manual");
  }

  async function handleFinalGenerateWeeklyPlan() {
    await generateWeeklyPlan(generationMode);
  }

  const progress = Math.round(completedDay / 7 * 100);

  function handleDayTabClick(day) {
    setSelectedDay(day);
  }

  return (
    <>
      <main className="mainWrapper meal-plan-page" id="meal-plan-main">
        <div className="mealPlanMainContainer">
          <header className="meal-plan-page-header">
            <h1 className="meal-plan-page-title">Your weekly meals</h1>
            <p className="meal-plan-page-lede">
              Pick a day below, choose breakfast, lunch and dinner, then save. Or use the shortcuts at
              the top to fill the week or save your plan when you are done.
            </p>
          </header>

          <AutoGenerateBanner
            completedDay={completedDay}
            onAutoWeeklyPlan={handleAutoGenerateWeeklyPlan}
            onGenerate={handleFinalGenerateWeeklyPlan} />
          

          <section className="daySelectSection" aria-label="Step 1: choose a day of the week">
            <div className="daySelectSection-tabsWrap">
              <div className="view-plan-day-tabs meal-plan-day-tabs" role="tablist">
                {days.map((day) => {
                  const dayPlan = mealPlanDraft[day];
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
                      onClick={() => handleDayTabClick(day)}>
                      
                      <span className="view-plan-day-tab-name">{day.slice(0, 3)}</span>
                      <div className="view-plan-day-tab-dots">
                        {["breakfast", "lunch", "dinner"].map((mealSlot) =>
                        <span
                          key={mealSlot}
                          className={`view-plan-day-tab-dot ${
                          dayPlan?.[mealSlot] ? "view-plan-day-tab-dot--planned" : ""} ${

                          dayComplete && dayPlan?.[mealSlot] ?
                          "view-plan-day-tab-dot--done" :
                          ""}`
                          } />

                        )}
                      </div>
                    </button>);

                })}
              </div>
            </div>

            <Button
              className="save-day-btn save-day-btn-top"
              onClick={handleManualSaveDayPlan}
              aria-label={`Save breakfast, lunch and dinner for ${selectedDay}`}>
              
              Save this day
            </Button>
          </section>

          <section className="progressBarSection">
            <ProgressBar
              bgColor="#4a6b5c"
              height="48px"
              completed={progress}
              labelAlignment="center"
              customLabel={` Week progress: ${completedDay} of 7 days `}
              maxCompleted={100} />
            
          </section>

          <section className="dayTitleSection" aria-labelledby="meal-plan-day-heading">
            <h2 id="meal-plan-day-heading" className="dayTitle">
              {selectedDay} · day {days.indexOf(selectedDay) + 1} of 7
            </h2>
            <p className="dayText">
              Tap one meal for breakfast, one for lunch, and one for dinner. Large cards below—take
              your time. Recipe ideas load automatically when this page opens.
            </p>

            {!mealsFetchReady ?
            <p className="meal-plan-fetch-hint meal-plan-fetch-hint--below-day" role="status">
                Your profile is still loading. Please wait a moment.
              </p> :
            null}
          </section>

          {loadingMeals ?
          <section className="loading-container" aria-busy="true" aria-live="polite">
              <div className="spinner-wrapper">
                <div className="spinner"></div>
                <p>Loading recipe ideas…</p>
              </div>
            </section> :
          mealError ?
          <section className="error-container" role="alert">
              <p className="error-container__message">{mealError}</p>
              <button type="button" className="meal-plan-retry-btn" onClick={() => fetchApiMeals()}>
                Try again
              </button>
            </section> :
          !mealsRequested ?
          <section className="meal-plan-prompt-placeholder" aria-live="polite">
              <p className="meal-plan-prompt-placeholder__text">Getting recipe ideas ready…</p>
            </section> :

          <div className="cont">
              <MealList
              meals={filteredMeals}
              mealsCount={mealsCount}
              selectMeal={selectMeal}
              weeklyPlan={mealPlanDraft}
              daySelection={daySelection}
              selectedDay={selectedDay} />
            

              <section className="action-buttons-section" aria-label="Save day or whole plan">
                <div className="day-actions">
                  <Button
                  className="save-day-btn"
                  onClick={handleManualSaveDayPlan}
                  aria-label={`Save meals for ${selectedDay}`}>
                  
                    Save this day
                  </Button>

                  <Button
                  className="generate-plan-btn"
                  disabled={completedDay < 7}
                  onClick={handleFinalGenerateWeeklyPlan}
                  aria-label="Save the full week to your account. Available when all seven days are filled.">
                  
                    Save plan to account
                  </Button>
                </div>
              </section>
            </div>
          }
        </div>
      </main>
    </>);

}

export default MealPlan;