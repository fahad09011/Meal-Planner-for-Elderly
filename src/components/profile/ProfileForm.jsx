import React, { useContext,useState } from "react";
import "../../assets/styles/profile.css";
import Button from "../common/Button";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";

function ProfileForm() {
 
  const { profileData, setProfileData, saveProfile, clearProfile, hasProfile,defaultProfile } =
    useContext(AppContext);
const [formData, setFormData] = useState(profileData);
const[isSubmitting, setIsSubmitting] = useState(false);
useEffect(()=>{
  setFormData(profileData)
},[profileData]);
  function handleOnChange(event) {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      let newArray;
      setFormData((prev) => {
        if (checked) {
          newArray = [...prev[name], value];
        } else {
          newArray = prev[name].filter((item) => item !== value);
        }
        return {
          ...prev,
          [name]: newArray,
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleOnSubmit = async (form) => {
    form.preventDefault();
    setIsSubmitting(true);
    const result = await saveProfile(formData);
    
    console.log("Profile successfuly saved");
      alert("Profile successfuly saved");
    setIsSubmitting(false);
    if(!result.success){
      console.log("Profile Saved Failed");
      alert("Profile Saved Failed");
    }
  };

  const handleOnClearProfile = () =>{
    clearProfile();
    setFormData(defaultProfile);
    console.log("Profile successfuly cleared");
      alert("Profile successfuly cleared");
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
                <input
                  required
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="one"
                  onChange={handleOnChange}
                  checked={formData.ageGroup === "50-55"}
                  value="50-55"
                />
                <label htmlFor="one">50-55</label>
              </div>

              <div className="ageGroupContainer two">
                <input
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="two"
                  onChange={handleOnChange}
                  checked={formData.ageGroup === "56-60"}
                  value="56-60"
                />
                <label htmlFor="two">56-60</label>
              </div>

              <div className="ageGroupContainer three">
                <input
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="three"
                  onChange={handleOnChange}
                  checked={formData.ageGroup === "61-65"}
                  value="61-65"
                />
                <label htmlFor="three">61-65</label>
              </div>

              <div className="ageGroupContainer four">
                <input
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="four"
                  onChange={handleOnChange}
                  checked={formData.ageGroup === "66-70"}
                  value="66-70"
                />
                <label htmlFor="four">66-70</label>
              </div>

              <div className="ageGroupContainer five">
                <input
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="five"
                  onChange={handleOnChange}
                  checked={formData.ageGroup === "71-75"}
                  value="71-75"
                />
                <label htmlFor="five">71-75</label>
              </div>

              <div className="ageGroupContainer six">
                <input
                  className="check"
                  type="radio"
                  name="ageGroup"
                  id="six"
                  onChange={handleOnChange}
                  checked={formData.ageGroup === "80+"}
                  value="80+"
                />
                <label htmlFor="six">80+</label>
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
                  checked={formData.dietary.includes("vegetarian")}
                />
                <label htmlFor="vegetarian">Vegetarian</label>
              </div>

              <div className="dietaryGroupContainer glutenfree">
                <input
                  className="check"
                  type="checkbox"
                  name="dietary"
                  id="glutenfree"
                  onChange={handleOnChange}
                  checked={formData.dietary.includes("gluten_free")}
                  value="gluten_free"
                />
                <label htmlFor="glutenfree">Gluten Free</label>
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
                  id="peanut"
                  onChange={handleOnChange}
                  checked={formData.allergies.includes("peanut")}
                  value="peanut"
                />
                <label htmlFor="peanut">Peanut</label>
              </div>

              <div className="allergiesGroupContainer dairy">
                <input
                  className="check"
                  type="checkbox"
                  name="allergies"
                  id="dairy"
                  onChange={handleOnChange}
                  checked={formData.allergies.includes("dairy")}
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
                  id="hypertension"
                  onChange={handleOnChange}
                  checked={formData.healthConditions.includes(
                    "hypertension",
                  )}
                  value="hypertension"
                />
                <label htmlFor="hypertension">Hypertension</label>
              </div>

              <div className="healthConsiderationGroupContainer diabetes">
                <input
                  className="check"
                  type="checkbox"
                  name="healthConditions"
                  id="diabetes"
                  onChange={handleOnChange}
                  checked={formData.healthConditions.includes("diabetes")}
                  value="diabetes"
                />
                <label htmlFor="diabetes">Diabetes</label>
              </div>


              <div className="healthConsiderationGroupContainer diabetes">
                <input
                  className="check"
                  type="checkbox"
                  name="healthConditions"
                  id="kidneyDisease"
                  onChange={handleOnChange}
                  checked={formData.healthConditions.includes("kidneyDisease")}
                  value="kidneyDisease"
                />
                <label htmlFor="kidneyDisease">Kidney Disease</label>
              </div>


              <div className="healthConsiderationGroupContainer diabetes">
                <input
                  className="check"
                  type="checkbox"
                  name="healthConditions"
                  id="highCholesterol"
                  onChange={handleOnChange}
                  checked={formData.healthConditions.includes("highCholesterol")}
                  value="highCholesterol"
                />
                <label htmlFor="highCholesterol">High Cholesterol</label>
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
                  checked={formData.budget === "low"}
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
                  checked={formData.budget === "medium"}
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
                  checked={formData.budget === "flexible"}
                  value="flexible"
                />
                <label htmlFor="flexible">Flexible</label>
              </div>
            </div>
          </section>
          <hr />
          <div className="formButtonContainer">
            {!hasProfile ? (
              <Button type="submit">{isSubmitting ? "Saving..." : "Save Profile"}</Button>
            ) : (
              <>
                <Button type="submit">{isSubmitting ? "Updating..." : "Update Profile"}</Button>

                <Button type="button" onClick={handleOnClearProfile}>
                  Clear Profile
                </Button>
              </>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default ProfileForm;
