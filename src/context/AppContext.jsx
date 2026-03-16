import { createContext, useEffect, useState } from "react";
import {createProfile , updateProfile,getProfile } from "../services/profileService";
import { useAuth } from "./AuthContext";

export const AppContext = createContext();
    export function AppProvider({children}){
const {user} = useAuth();
const defaultProfile = {
  ageGroup: "",
  dietary: [],
  allergies: [],
  healthConditions: [],
  budget: ""
};
const [profileData, setProfileData] = useState(defaultProfile);
const hasProfile = profileData.ageGroup !== "";

useEffect(()=>{
if (!user) {
    return;
}
const loadProfile= async ()=>{
  const {success, data} = await getProfile(user.id);
  if (success && data) {
    setProfileData({
      ageGroup:data.age_group ,
  dietary: data.dietary ,
  allergies: data.allergies ,
  healthConditions: data.health_conditions ,
  budget: data.budget ,
    });
  }
}
loadProfile();
},[user])

const defaultWeeklyPlan = {
  Monday: { breakfast: null, lunch: null, dinner: null },
  Tuesday: { breakfast: null, lunch: null, dinner: null },
  Wednesday: { breakfast: null, lunch: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, dinner: null },
  Friday: { breakfast: null, lunch: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, dinner: null },
};

const [weeklyPlan, setWeeklyPlan] = useState(defaultWeeklyPlan);

  function saveWeeklyPlan(plan) {
    setWeeklyPlan(plan);
  }









const saveProfile =async (profileLoad) => {
 try {
   // temporary DB-ready behavior:
      // after successful save/update in DB, official state should update
      let result ;
      if (hasProfile) {
       result = await  updateProfile(user.id, profileLoad);
        if (result.success) {
          console.log("updated method called");
          setProfileData(profileLoad);
        } else {
          return {success: false, error: result.error};
        }
      } else {
        result = await createProfile(user.id, profileLoad);
        if (result.success) {
          console.log("created method called");

          setProfileData(profileLoad);
        } else {
          return {success: false, error: result.error};
        }
      }
      console.log("Profile saved successfully",profileLoad);
      return {success: true, error: null,};
 } catch (error) {
  console.error("Error saving profile",error);
  return {success: false, error: error};
 }
};



function clearProfile() {
  setProfileData(defaultProfile);
}
// function clearProfile() {
//   if (localStorage.getItem("profile")) {
//       localStorage.removeItem("profile");
//       setProfileData(defaultProfile);

//   } 
// }






  return(
    <AppContext.Provider value={{
        weeklyPlan,
        setWeeklyPlan,
        setProfileData,
        profileData,
        saveProfile, 
        clearProfile, 
        hasProfile,
        saveWeeklyPlan,
        defaultProfile
    }}> 
    {children}
    </AppContext.Provider>
  )

    }
