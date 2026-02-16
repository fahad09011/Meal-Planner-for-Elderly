import React, { useContext, useState } from "react";
import "../../assets/styles/profile.css";
import Button from "../common/Button";
import { ProfileContext } from "../../context/ProfileContext";

function ProfileForm() {
  // const [profileData, setProfileData] = useState({
  //   ageGroup: "",
  //   dietary: [],
  //   allergies: [],
  //   healthConditions: [],
  //   budget: "",
  // });
const { profileData,setProfileData, saveProfile, clearProfile, hasProfile  } = useContext(ProfileContext)

  function handleOnChange(event) {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      let newArray;
      setProfileData((prev) => {
        if (checked) {
          newArray = [...prev[name], value];
        } else {
          newArray = prev[name].filter((item) => item !== value);
        }
        return {
          ...prev, [name]: newArray
        }
      });
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleOnSubmit(form) {
    form.preventDefault();
    console.log(profileData);
    saveProfile();
  }
  return (
    <div>
      <main className="profileMainContainer">
        <form action="" onSubmit={handleOnSubmit} className="profileForm">
          <div className="formTitleContainer">
            <h2 className="formTitle">Profile Settings</h2>
            <hr />
          </div>
          {/* age g */}
          <section className="ageGroupMainSection">
            <p className="title">Age Group</p>

            <div className="ageGroupMainContainer">
              <div className="ageGroupContainer one">
                <input required
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="one"
                  onChange={handleOnChange}
                  checked={profileData.ageGroup === "40-50"}
                  value="40-50"
                />
                <label htmlFor="one">40-50</label>
              </div>

              <div className="ageGroupContainer two">
                <input
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="two"
                  onChange={handleOnChange}
                  checked={profileData.ageGroup === "51-60"}

                  value="51-60"
                />
                <label htmlFor="two">51-60</label>
              </div>

              <div className="ageGroupContainer three">
                <input
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="three"
                  onChange={handleOnChange}
                  checked={profileData.ageGroup === "61-70"}

                  value="61-70"
                />
                <label htmlFor="three">61-70</label>
              </div>

              <div className="ageGroupContainer four">
                <input
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="four"
                  onChange={handleOnChange}
                  checked={profileData.ageGroup === "70+"}

                  value="70+"
                />
                <label htmlFor="four">70+</label>
              </div>
            </div>
          </section>
          <hr />

          {/* Dietary Preference  */}
          <section className="dietaryMainSection">
            <p className="title">Dietary Preference</p>

            <div className="dietaryGroupMainContainer">
              <div className="dietaryGroupContainer vegetarian">
                <input
                  className="check"
                  type="checkbox"
                  name="dietary"
                  id="vegetarian"
                  onChange={handleOnChange}
                  value="vegetarian"
                  checked={profileData.dietary.includes("vegetarian")}

                  
                />
                <label htmlFor="vegetarian">Vegetarian</label>
              </div>

              <div className="dietaryGroupContainer plantBased">
                <input
                  className="check"
                  type="checkbox"
                  name="dietary"
                  id="plantBased"
                  onChange={handleOnChange}
                  checked={profileData.dietary.includes("plantBased")}

                  value="plantBased"
                />
                <label htmlFor="plantBased">Plant-Based</label>
              </div>
            </div>
          </section>
          <hr />

          {/* allergies Preference  */}
          <section className="allergiesMainSection">
            <p className="title">Allergies Preference</p>

            <div className="allergiesGroupMainContainer">
              <div className="allergiesGroupContainer nuts">
                <input
                  className="check"
                  type="checkbox"
                  name="allergies"
                  id="nuts"
                  onChange={handleOnChange}
                  checked={profileData.allergies.includes("nuts")}

                  value="nuts"
                />
                <label htmlFor="nuts">Nuts</label>
              </div>

              <div className="allergiesGroupContainer dairy">
                <input
                  className="check"
                  type="checkbox"
                  name="allergies"
                  id="dairy"
                  onChange={handleOnChange}
                  checked={profileData.allergies.includes("dairy")}

                  value="dairy"
                />
                <label htmlFor="dairy">Dairy</label>
              </div>
            </div>
          </section>
          <hr />

          {/* healthConsideration Preference  */}
          <section className="healthConsiderationMainSection">
            <p className="title">Health Consideration</p>

            <div className="healthConsiderationGroupMainContainer">
              <div className="healthConsiderationGroupContainer bloodPressure">
                <input
                  className="check"
                  type="checkbox"
                  name="healthConditions"
                  id="bloodPressure"
                  onChange={handleOnChange}
                  checked={profileData.healthConditions.includes("bloodPressure")}

                  value="bloodPressure"
                />
                <label htmlFor="bloodPressure">High Blood Pressure</label>
              </div>
              <div className="healthConsiderationGroupContainer diabetes">
                <input
                  className="check"
                  type="checkbox"
                  name="healthConditions"
                  id="diabetes"
                  onChange={handleOnChange}
                  checked={profileData.healthConditions.includes("diabetes")}

                  value="diabetes"
                />
                <label htmlFor="diabetes">Diabetes</label>
              </div>
            </div>
          </section>
          <hr />

          {/* budget  */}
          <section className="budgetMainSection">
            <p className="title">Budget Preference</p>

            <div className="budgetGroupMainContainer">
              <div className="budgetGroupContainer low">
                <input
                  className="check"
                  type="radio"
                  name="budget"
                  id="low"
                  onChange={handleOnChange}
                  checked={profileData.budget === "low"}

                  value="low"
                />
                <label htmlFor="low">Low</label>
              </div>
              <div className="budgetGroupContainer medium">
                <input
                  className="check"
                  type="radio"
                  name="budget"
                  id="medium"
                  onChange={handleOnChange}
                  checked={profileData.budget === "medium"}
                  value="medium"
                />
                <label htmlFor="medium">Medium</label>
              </div>
              <div className="budgetGroupContainer flexible">
                <input
                  className="check"
                  type="radio"
                  name="budget"
                  id="flexible"
                  onChange={handleOnChange}
                  checked={profileData.budget === "flexible"}
                  value="flexible"
                />
                <label htmlFor="flexible">Flexible</label>
              </div>
            </div>
          </section>
          <hr />
          <div className="formButtonContainer">
            {
              !hasProfile ?
               <Button type="submit">Save Profile</Button> : 
               (<>
               
              
                 <Button type="submit">Update Profile</Button>
                 
                 <Button
                 type="button"
                 onClick={clearProfile}>Clear Profile</Button>
                  </>)
            }
           

          
          </div>
        </form>
      </main>
    </div>
  );
}

export default ProfileForm;
