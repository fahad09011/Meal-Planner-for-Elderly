import React from 'react'
import MealCard from './MealCard'

function MealList({
    meals,
}) {
 function handlefiltereredMealsOnClick(meals) {
    console.log("meal list: ",meals);
  }
  const breakfast = meals.filter((meal)=>{
    return(
      meal.category === "breakfast"
    )
  })
  const lunch = meals.filter((meal)=>{
    return(
      meal.category === "lunch"
    )
  })
  const dinner = meals.filter((meal)=>{
    return(
      meal.category === "dinner"
    )
  })

  const categories =["breakfast","lunch","dinner"];
  return (
    <div className="row gx-3 mx-0  g-3">

      <h2>BreakFast</h2>
      {breakfast.length>0 ? breakfast.map((meal,index)=>{
        return(
            <div className="col-6 col-md-6 col-xl-6"  key={index}> 
            <MealCard meals={meal}/>
            </div>
        )
      }) : <p>no breakfast were found</p>
      }
      <hr />
      <h2>Lunch</h2>
      {lunch.map((meal,index)=>{
        return(
            <div className="col-6 col-md-6 col-xl-6"  key={index}> 
            <MealCard meals={meal}/>
            </div>
        )
      })}
      <hr />
            <h2>dinner</h2>

      {dinner.map((meal,index)=>{
        return(
            <div className="col-6 col-md-6 col-xl-6"  key={index}> 
            <MealCard meals={meal}/>
            </div>
        )
      })}
         <button type="button" onClick={()=>handlefiltereredMealsOnClick(meals)}>From Meal List</button>
    </div>
  )
}

export default MealList
