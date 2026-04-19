
import './App.css'
import Home from './pages/Home';
import MealPlan from './pages/MealPlan';

import Shopping from './pages/Shopping';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/common/Navbar';
import Profile from './pages/Profile';
import ViewPlan from './pages/ViewPlan';
import LoginForm from './pages/LoginForm';
import TermsOfUse from './pages/TermsOfUse';
import ResetPassword from './pages/ResetPassword';
import Caregiving from './pages/Caregiving';
import MealDetails from './pages/MealDetails';
import { AppProvider } from './hooks/AppContext';

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

      <Route path="/viewPlan" element={<ViewPlan/>}/>
      <Route path="/mealDetails/:mealId" element={<MealDetails/>}/>
      <Route path="/shopping" element={<Shopping/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/caregiving" element={<Caregiving/>}/>
      <Route path="/login" element={<LoginForm/>}/>
      <Route path="/terms" element={<TermsOfUse/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
   
  </Routes>
    </div>
    </Router>

        </AppProvider>
    </>
  )
}

export default App
