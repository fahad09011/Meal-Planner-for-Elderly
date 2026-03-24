import React from 'react'
import { useContext, useEffect, useState } from 'react';
import { buildShoppingItemsFromWeeklyPlan } from '../utils/buildShoppingItemsFromWeeklyPlan';
import { AppContext } from '../context/AppContext';
function Shopping() {
  const { weeklyPlan } = useContext(AppContext);
  const[shoppingItems, setShoppingItems] = useState([]);
  useEffect(() => {
    if (!weeklyPlan) return;
  
    const items = buildShoppingItemsFromWeeklyPlan(weeklyPlan);
  
    console.log("Shopping Items:", items);
  
    setShoppingItems(items);
  
  }, [weeklyPlan]);
  return (
    <div>
      <h1>Start working on Shopping List</h1>
    </div>
  )
}

export default Shopping
