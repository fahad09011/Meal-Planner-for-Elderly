// with list
import React from "react";
import useNutrition from "../hooks/useNutrition";
import "../assets/styles/mealPlan.css";
function MealPlan() {
  const meals = useNutrition();
  return (
    <>
      {/* main  wrapper*/}
      <main className="mainWrapper ">
        {/* main  container*/}
        <main className="mealPlanMainContainer">
          {/* title container */}
          <div className="mealPlanMainContainerTitle">
            <h2>Generat Weekly Plan</h2>
          </div>

          {/* day selectior section */}
          <section className="daySelectSection">
            <ul className="dayListContainer">
              <li className="dayList">
                  <a href="#" className="day">
                    Monady
                  </a>
              </li>
              <li className="dayList">
                 
                  <a href="#" className="day">
                    Tuesday
                  </a>
              </li>
              <li className="dayList">
                 
                  <a href="#" className="day">
                    Wednesday
                  </a>
              </li>
              <li className="dayList">
                 
                  <a href="#" className="day">
                    Thursday
                  </a>
              </li>
              <li className="dayList">
                 
                  <a href="#" className="day">
                    Friday
                  </a>
              </li>
              <li className="dayList">
                 
                  <a href="#" className="day">
                    Saturday
                  </a>
              </li>
              <li className="dayList">
                 
                  <a href="#" className="day">
                    Sunday
                  </a>
              </li>
            </ul>
          </section>
        </main>
      </main>
    </>
  );
}

export default MealPlan;
