import React, { useState } from 'react';
import './App.css'
import { ProfileContext } from './context/ProfileContext';
import Home from './pages/Home';
import MealPlan from './pages/MealPlan';
import Shopping from './pages/Shopping';
import ProfileForm from './components/profile/ProfileForm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/common/Navbar';
import Profile from './pages/Profile';

function App() {
  const defaultProfile = {
  ageGroup: "",
  dietary: [],
  allergies: [],
  healthConditions: [],
  budget: ""
};

const [profileData, setProfileData] = useState(()=>{
  const savedProfile = localStorage.getItem("profile");
  if (savedProfile) {
    return JSON.parse(savedProfile)
  } else {
    return defaultProfile
  } 
});

function saveProfile() {
  localStorage.setItem("profile", JSON.stringify(profileData));
  console.log(localStorage.getItem("profile"));
}

function clearProfile() {
  if (localStorage.getItem("profile")) {
      localStorage.removeItem("profile");
      setProfileData(defaultProfile);

  } 
}

const hasProfile = profileData.ageGroup !== "";


  return (
    <>
    <ProfileContext.Provider value={{profileData, setProfileData, saveProfile, clearProfile, hasProfile
    }}>
      <Router>

    <div className="mainAppContainer">
      <Navbar/>
        <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/mealPlan" element={<MealPlan/>}/>
      <Route path="/shopping" element={<Shopping/>}/>
      <Route path="/profile" element={<Profile/>}/>
   
  </Routes>
    </div>
    </Router>
        </ProfileContext.Provider>
    </>
  )
}

export default App
