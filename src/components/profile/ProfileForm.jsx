import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/profile.css";
import Button from "../common/Button";
import { AppContext } from "../../context/AppContext";
import { ACTIVITY_LEVEL_OPTIONS } from "../../constants/activityLevels";
import { getRestingAndDailyCaloriesFromProfile } from "../../utils/bmr";

function ProfileForm() {
 
  const { profileData, setProfileData, saveProfile, clearProfile, hasProfile,defaultProfile } =
    useContext(AppContext);
const [formData, setFormData] = useState(profileData);
const[isSubmitting, setIsSubmitting] = useState(false);
useEffect(()=>{
  setFormData(profileData)
},[profileData]);

  const { restingCalories, dailyCalories } =
    getRestingAndDailyCaloriesFromProfile(formData);

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
    setIsSubmitting(false);
    if (result.success) {
      alert("Profile saved successfully.");
    } else {
      const msg = result.error?.message ?? "Something went wrong saving your profile.";
      console.error("Profile save failed:", result.error);
      alert(`Profile not saved: ${msg}`);
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
            <h1 className="formTitle">Your profile</h1>
            <p className="profile-page-lede">
              Tell us about yourself. We use your age, size, and activity level to estimate daily energy needs (BMR / TDEE) for meal suggestions. Diet and health choices apply on top of that.
            </p>
            <hr />
          </div>

          <section className="profileMetricsSection">
            <p className="title">Age, size &amp; activity</p>
            <p className="profile-section-hint">Weights and heights use metric units (kg and cm).</p>

            <div className="profileMetricsGrid">
              <label className="profileFieldLabel" htmlFor="profile-age">
                Age (years)
                <input
                  id="profile-age"
                  className="profileTextInput"
                  type="number"
                  name="age"
                  min={18}
                  max={120}
                  required
                  inputMode="numeric"
                  value={formData.age}
                  onChange={handleOnChange}
                  placeholder="e.g. 72"
                />
              </label>
              <label className="profileFieldLabel" htmlFor="profile-weight">
                Weight (kg)
                <input
                  id="profile-weight"
                  className="profileTextInput"
                  type="number"
                  name="weightKg"
                  min={1}
                  max={400}
                  step="0.1"
                  required
                  inputMode="decimal"
                  value={formData.weightKg}
                  onChange={handleOnChange}
                  placeholder="e.g. 70"
                />
              </label>
              <label className="profileFieldLabel" htmlFor="profile-height">
                Height (cm)
                <input
                  id="profile-height"
                  className="profileTextInput"
                  type="number"
                  name="heightCm"
                  min={100}
                  max={250}
                  required
                  inputMode="numeric"
                  value={formData.heightCm}
                  onChange={handleOnChange}
                  placeholder="e.g. 165"
                />
              </label>
            </div>

            <p className="profileSubTitle">Gender</p>
            <p className="profile-section-hint">Used in the standard BMR formula (Mifflin–St Jeor).</p>
            <div className="genderRow">
              {[
                { id: "gender-male", value: "male", label: "Male" },
                { id: "gender-female", value: "female", label: "Female" },
              ].map(({ id, value, label }, i) => (
                <div className="ageGroupContainer" key={value}>
                  <input
                    required={i === 0}
                    className="check"
                    type="radio"
                    name="gender"
                    id={id}
                    onChange={handleOnChange}
                    checked={formData.gender === value}
                    value={value}
                  />
                  <label htmlFor={id}>{label}</label>
                </div>
              ))}
            </div>

            <p className="profileSubTitle">Activity level</p>
            <p className="profile-section-hint">Pick the line that best matches your usual week. The number is the TDEE multiplier we will use with BMR.</p>
            <div className="activityLevelList">
              {ACTIVITY_LEVEL_OPTIONS.map((opt, i) => (
                <label
                  key={opt.id}
                  className={`activityLevelCard ${formData.activityLevel === opt.id ? "activityLevelCard--selected" : ""}`}
                  htmlFor={`activity-${opt.id}`}
                >
                  <input
                    className="check"
                    type="radio"
                    name="activityLevel"
                    id={`activity-${opt.id}`}
                    value={opt.id}
                    checked={formData.activityLevel === opt.id}
                    onChange={handleOnChange}
                    required={i === 0}
                  />
                  <span className="activityLevelCardBody">
                    <span className="activityLevelTitle">
                      {opt.label} ({opt.multiplier})
                    </span>
                    <span className="activityLevelDesc">{opt.description}</span>
                  </span>
                </label>
              ))}
            </div>

            {restingCalories != null && (
              <div className="profileEnergySummary" role="status" aria-live="polite">
                <p className="profileSubTitle">Your estimated energy</p>
                <p className="profile-section-hint">
                  Resting calories use the Mifflin–St Jeor formula (what your body burns at rest).
                </p>
                <div className="profileEnergySummaryGrid">
                  <div className="profileEnergyCard">
                    <span className="profileEnergyLabel">Resting (BMR)</span>
                    <span className="profileEnergyValue">{restingCalories}</span>
                    <span className="profileEnergyUnit">kcal / day</span>
                    <span className="profileEnergyHelp">At rest</span>
                  </div>
                  {dailyCalories != null && (
                    <div className="profileEnergyCard profileEnergyCard--accent">
                      <span className="profileEnergyLabel">Daily with activity</span>
                      <span className="profileEnergyValue">{dailyCalories}</span>
                      <span className="profileEnergyUnit">kcal / day</span>
                      <span className="profileEnergyHelp">Resting × activity level</span>
                    </div>
                  )}
                </div>
                {dailyCalories != null && (
                  <p className="profile-section-hint profileEnergyFootnote">
                    Meal planning uses about one-third of your daily total per main meal (and the
                    weight-management limit if you selected it). Search and filters both follow this.
                  </p>
                )}
              </div>
            )}
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
    <Button type="submit" className="button">
      {isSubmitting ? "Saving..." : "Save Profile"}
    </Button>
  ) : (
    <>
      <Button type="submit" className="button">
        {isSubmitting ? "Updating..." : "Update Profile"}
      </Button>

      <Button
        type="button"
        className="inActive button"
        onClick={handleOnClearProfile}
      >
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
