import React from 'react'
import MealCard from './MealCard'

function MealList({
    meals,
}) {
 function handlefiltereredMealsOnClick() {
    console.log(meals);
  }

  return (
    <div className="row gx-3 mx-0  g-3">
      {meals.map((meals,index)=>{
        return(
            <div className="col-6 col-md-6 col-xl-6"  key={index}> 
            <MealCard meals={meals}/>
            </div>
        )
      })}
         <button type="button" onClick={handlefiltereredMealsOnClick}>From Meal List</button>
    </div>
  )
}

export default MealList
