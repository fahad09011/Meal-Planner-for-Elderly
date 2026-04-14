
import './App.css'
import Home from './pages/Home';
import MealPlan from './pages/MealPlan';
// import BrowseMeal from './pages/BrowseMeal'; // Iteration 2 — browse not implemented yet
import Shopping from './pages/Shopping';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/common/Navbar';
import Profile from './pages/Profile';
import ViewPlan from './pages/ViewPlan';
import LoginForm from './pages/LoginForm';
import Caregiving from './pages/Caregiving';
import MealDetails from './pages/MealDetails';
import { AppProvider } from './context/AppContext';
// import TestMealPlanSave from './dev/TestMealPlanSave';
// import TestAuth from './dev/TestAauth';

function App() {
  return (
    <>
    <AppProvider>
      <Router>

    <div className="mainAppContainer">
      <Navbar/>
        <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/mealPlan" element={<MealPlan/>}/>
      {/* <Route path="/browseMeals" element={<BrowseMeal/>}/> — Iteration 2 */}
      <Route path="/viewPlan" element={<ViewPlan/>}/>
      <Route path="/mealDetails/:mealId" element={<MealDetails/>}/>
      <Route path="/shopping" element={<Shopping/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/caregiving" element={<Caregiving/>}/>
      <Route path="/login" element={<LoginForm/>}/>
   
  </Routes>
    </div>
    </Router>
    {/* <TestMealPlanSave /> — import from ./dev/TestMealPlanSave when debugging */}
        {/* <TestAuth/> */}
        </AppProvider>
    </>
  )
}

export default App
