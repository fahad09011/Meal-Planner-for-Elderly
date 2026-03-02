import { createContext, useState } from "react";

export const AppContext = createContext();
    export function AppProvider({children}){

        const defaultProfile = {
  ageGroup: "",
  dietary: [],
  allergies: [],
  healthConditions: [],
  budget: ""
};

// const [profileData, setProfileData] = useState(defaultProfile);
const defaultWeeklyPlan = {
  Monday: { breakfast: null, lunch: null, dinner: null },
  Tuesday: { breakfast: null, lunch: null, dinner: null },
  Wednesday: { breakfast: null, lunch: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, dinner: null },
  Friday: { breakfast: null, lunch: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, dinner: null },
};

const [weeklyPlan, setWeeklyPlan] = useState(()=>{
      const savedPlan = localStorage.getItem("Plan");
      if (savedPlan) {
        console.log("profile",savedPlan)
    return JSON.parse(savedPlan)
      } else {
        
      }
      
      console.log("profile",savedPlan)
    
    return defaultWeeklyPlan
    

  });

//   const [profileData, setProfileData] = useState(()=>{
//   const savedProfile = localStorage.getItem("profile");
//   if (savedProfile) {
//     console.log("profile",savedProfile)
//     return JSON.parse(savedProfile)
//   } else {
//         console.log("profile",defaultProfile)

//     return defaultProfile
//   } 
// });
//   const [weeklyPlan, setWeeklyPlan] = useState({
//     Monday: { breakfast: null, lunch: null, dinner: null },
//     Tuesday: { breakfast: null, lunch: null, dinner: null },
//     Wednesday: { breakfast: null, lunch: null, dinner: null },
//     Thursday: { breakfast: null, lunch: null, dinner: null },
//     Friday: { breakfast: null, lunch: null, dinner: null },
//     Saturday: { breakfast: null, lunch: null, dinner: null },
//     Sunday: { breakfast: null, lunch: null, dinner: null },
//   });

  function saveWeeklyPlan(plan) {
    localStorage.setItem("Plan", JSON.stringify(plan))
    const savedPlanString = localStorage.getItem("Plan");
    const savedPlan = JSON.parse(savedPlanString)
    console.log("Saved weekly Plan:" ,savedPlan);
  }





  const [profileData, setProfileData] = useState(()=>{
  const savedProfile = localStorage.getItem("profile");
  if (savedProfile) {
    console.log("profile",savedProfile)
    return JSON.parse(savedProfile)
  } else {
        console.log("profile",defaultProfile)

    return defaultProfile
  } 
});

  function saveProfile() {
  console.log(`local storage: ${localStorage.getItem("profile")}`);
}

function clearProfile() {
  if (localStorage.getItem("profile")) {
      localStorage.removeItem("profile");
      setProfileData(defaultProfile);

  } 
}
const hasProfile = profileData.ageGroup !== "";




  return(
    <AppContext.Provider value={{
        weeklyPlan,
        setWeeklyPlan,
        setProfileData,
        profileData,
        saveProfile, 
        clearProfile, 
        hasProfile,
        saveWeeklyPlan
    }}> 
    {children}
    </AppContext.Provider>
  )

    }
