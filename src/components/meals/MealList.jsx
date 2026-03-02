import React from "react";
import MealCard from "./MealCard";

function MealList({
  meals,
  mealsCount,
  selectMeal,
weeklyPlan,
selectedDay,
daySelection,
  /* // random tags are optional discuss with supervisor */
  getRandonMealTag,
}) {
  function handlefiltereredMealsOnClick(meals) {
    console.log("meal list: ", meals);
  }
  const breakfast = meals.filter((meal) => {
    return meal.category === "breakfast";
  });
  const lunch = meals.filter((meal) => {
    return meal.category === "lunch";
  });
  const dinner = meals.filter((meal) => {
    return meal.category === "dinner";
  });

  const categories = ["breakfast", "lunch", "dinner"];
  return (
    <div className="flex row mx-0  g-4 border border-danger">
      <h2>
        BreakFast{" "}
        <span className="badge bg-secondary">{mealsCount.breakfast}</span>
      </h2>
      {breakfast.length > 0 ? (
        breakfast.map((meal, index) => {
          return (
            <div className=" col-12 col-sm-6 col-xl-4 col-xxl-3" key={index}>
              <MealCard meals={meal} selectMeal={selectMeal} weeklyPlan={weeklyPlan}   daySelection={daySelection}

selectedDay={selectedDay}

/>

              {/* // random tags are optional discuss with supervisor */}
              {/* <MealCard meals={meal} getRandonMealTag={getRandonMealTag}/> */}
            </div>
          );
        })
      ) : (
        <p>no breakfast were found</p>
      )}
      <hr />
     <h2>
        Lunch{" "}
        <span className="badge bg-secondary">{mealsCount.lunch}</span>
      </h2>
      {lunch.length > 0 ? (
        lunch.map((meal, index) => {
          return (
            <div className="col-12 col-sm-6 col-xl-4 col-xxl-3" key={index}>
              <MealCard meals={meal} selectMeal={selectMeal} weeklyPlan={weeklyPlan}   daySelection={daySelection}

selectedDay={selectedDay}

/>

              {/* // random tags are optional discuss with supervisor */}
              {/* <MealCard meals={meal} getRandonMealTag={getRandonMealTag}/> */}
            </div>
          );
        })
      ) : (
        <p>no lunch were found</p>
      )}
      <hr />
      <h2>
        Dinner{" "}
        <span className="badge bg-secondary">{mealsCount.dinner}</span>
      </h2>
      {dinner.length > 0 ? (
        dinner.map((meal, index) => {
          return (
            <div className="col-12 col-sm-6 col-xl-4 col-xxl-3" key={index}>
              <MealCard meals={meal} selectMeal={selectMeal} weeklyPlan={weeklyPlan}  daySelection={daySelection}
 
selectedDay={selectedDay}

/>

              {/* // random tags are optional discuss with supervisor */}
              {/* <MealCard meals={meal} getRandonMealTag={getRandonMealTag}/> */}
            </div>
          );
        })
      ) : (
        <p>no dinner were found</p>
      )}
      <hr />
      {/* <button type="button" onClick={() => handlefiltereredMealsOnClick(meals)}>
        From Meal List
      </button> */}
    </div>
  );
}

export default MealList;
