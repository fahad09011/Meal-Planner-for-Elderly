import React, { useState } from 'react';
import './App.css'
import { ProfileContext } from './context/ProfileContext';
import Home from './pages/Home';
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

    <div className="mainAppContainer">
   <Home/>

    </div>
        </ProfileContext.Provider>

    </>
  )
}

export default App
