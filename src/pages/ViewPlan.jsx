import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "../assets/styles/viewPlan.css";
// import "../../assets/styles/viewPlan.css";
import calender from "../assets/icons/calender.png";
import Button from "../components/common/Button";
import DayPlanCard from "../components/meals/DayPlanCard";
function ViewPlan() {
  const { weeklyPlan } = useContext(AppContext);
  function checkplan() {
    console.log("check view plan", weeklyPlan);
  }
  return (
    <div>
      <main className="viewPlanMainContainer">
        <section className="viewPlanHeaderSection">
          <div className="viewplanLeftHeader">
            <p className="viewplanHeading">
              <img src={calender} alt="icon" className="calenderIcon" />
              Your Weekly Meal Plan
            </p>
            <p className="viewPlandate">Week of March 2 to 8, 2026</p>
          </div>

          <div className="viewplanRightHeader">
            {/* <Button className="save-day-btn" onClick={handleSaveDayPlan}>
              💾 Save for {selectedDay}
            </Button> */}
            <Button>Edit plan</Button>
            <p className="viewPlanProgress">Progress: 5/7 days complete</p>
            {/* <Button>Shopping List</Button> */}
          </div>
        </section>

        <section className="mealSection">

       
        <DayPlanCard weeklyPlan={weeklyPlan} />
 </section>
        {/* <button onClick={checkplan}>text view plan</button> */}
       
      </main>
    </div>
  );
}

export default ViewPlan;
