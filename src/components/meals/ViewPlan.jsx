import React, { useContext } from 'react'
import { AppContext } from "../../context/AppContext";

function ViewPlan() {
   const {weeklyPlan} = useContext(AppContext);
   function checkplan() {
    console.log("check view plan",weeklyPlan);
   }
  return (
    <div>
      <button onClick={checkplan}>text view plan</button>
      {/* <h2>{weeklyPlan.Monday.breakFast}</h2> */}
      <h2>{Object.entries(weeklyPlan).map(([day,value])=>(
       <div  key={day}> 
          <h2>{day}</h2>
          <p>BreakFast: {value.breakfast?.name}</p>
          <p>Lunch: {value.lunch?.name}</p>
          <p>Dinner: {value.dinner?.name}</p>
          </div>
      )
    )}</h2>
    </div>
  )
}

export default ViewPlan
