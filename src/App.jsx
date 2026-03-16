import React, { useState } from 'react';
import './App.css'
import { ProfileContext } from './context/ProfileContext';
import Home from './pages/Home';
import MealPlan from './pages/MealPlan';
import BrowseMeal from './pages/BrowseMeal';
import Shopping from './pages/Shopping';
import ProfileForm from './components/profile/ProfileForm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/common/Navbar';
import Profile from './pages/Profile';
import ViewPlan from './pages/ViewPlan';
import { AppProvider } from './context/AppContext';
// import TestAuth from './components/TestAauth';

function App() {
  const defaultProfile = {
  ageGroup: "",
  dietary: [],
  allergies: [],
  healthConditions: [],
  budget: ""
};
  return (
    <>
    <AppProvider>
    {/* <ProfileContext.Provider value={{profileData, setProfileData, saveProfile, clearProfile, hasProfile
    }}> */}
      <Router>

    <div className="mainAppContainer">
      <Navbar/>
        <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/mealPlan" element={<MealPlan/>}/>
      <Route path="/browseMeals" element={<BrowseMeal/>}/>
      <Route path="/viewPlan" element={<ViewPlan/>}/>
      <Route path="/shopping" element={<Shopping/>}/>
      <Route path="/profile" element={<Profile/>}/>
   
  </Routes>
    </div>
    </Router>
        {/* <TestAuth/> */}
        </AppProvider>
        {/* </ProfileContext.Provider> */}
    </>
  )
}

export default App
