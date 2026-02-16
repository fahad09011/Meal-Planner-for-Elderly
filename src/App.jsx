import React, { useContext, useState } from 'react';
import './App.css'
import { ProfileContext } from './context/ProfileContext';
import Home from './pages/Home';
function App() {
const [profileData, setProfileData] = useState({
  ageGroup: "",
  dietary: [],
  allergies: [],
  healthConditions: [],
  budget: ""
});

  return (
    <>
    <ProfileContext.Provider value={{profileData, setProfileData}}>

    <div className="mainAppContainer">
   <Home/>

    </div>
        </ProfileContext.Provider>

    </>
  )
}

export default App
