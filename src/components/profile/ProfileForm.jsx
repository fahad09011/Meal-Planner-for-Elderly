import React, { useContext, useState, useEffect, useRef } from "react";
import "../../assets/styles/profile.css";
import Button from "../common/Button";
import ProfileHowItWorksModal from "./ProfileHowItWorksModal";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { ACTIVITY_LEVEL_OPTIONS } from "../../constants/activityLevels";
import { getRestingAndDailyCaloriesFromProfile } from "../../utils/bmr";

function ProfileForm() {
  const { user } = useAuth();
  const {
    profileData,
    setProfileData,
    saveProfile,
    clearProfile,
    hasProfile,
    defaultProfile,
    activeDataUserId,
    viewingOwnProfile,
  } = useContext(AppContext);
  const [formData, setFormData] = useState(profileData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const howItWorksBtnRef = useRef(null);
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

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

  async function copyUserId() {
    if (!activeDataUserId) return;
    try {
      await navigator.clipboard.writeText(activeDataUserId);
      alert("User ID copied. You can paste it for a caregiver on the Caregiving page.");
    } catch {
      alert("Could not copy automatically. Please select and copy the ID text.");
    }
  }

  return (
    <div>
      <main className="profileMainContainer">
        <form action="" onSubmit={handleOnSubmit} className="profileForm">
          <div className="formTitleContainer">
            <div className="formTitleHeaderRow">
              <h1 className="formTitle">
                {viewingOwnProfile ? "Your profile" : "Care recipient profile"}
              </h1>
              <button
                ref={howItWorksBtnRef}
                type="button"
                className="button inActive profile-how-it-works-btn"
                onClick={() => setShowHowItWorks(true)}
              >
                How it works
              </button>
            </div>
            <p className="profile-page-lede profile-page-lede--short">
              Expand a section below to change your details. Use “How it works” anytime for a full
              explanation.
            </p>
            {user && activeDataUserId ? (
              <div className="profile-user-id-box">
                <p>
                  <strong>User ID</strong> (for caregivers to link this account)
                </p>
                <div className="profile-user-id-row">
                  <code className="profile-user-id-code">{activeDataUserId}</code>
                  <Button type="button" className="button" onClick={copyUserId}>
                    Copy
                  </Button>
                </div>
              </div>
            ) : null}
            {!viewingOwnProfile ? (
              <p className="profile-readonly-banner" role="status">
                You are viewing someone else&apos;s profile. Meal planning uses their details; only they
                can change this form when signed in to their own account.
              </p>
            ) : null}
            <hr />
          </div>

          <fieldset className="profile-fieldset-reset" disabled={!viewingOwnProfile}>
          <details className="profileFold" open>
            <summary className="profileFold__summary">
              <span className="profileFold__summaryText">
                <span className="profileFold__title">Your body &amp; activity</span>
                <span className="profileFold__subtitle">Age, weight, height, gender, activity, energy estimate</span>
              </span>
            </summary>
          <section className="profileFold__body profileMetricsSection">
            <p className="profile-section-hint profile-section-hint--compact">
              Metric units: kg and cm.
            </p>

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
                    {formData.activityLevel === opt.id ? (
                      <span className="activityLevelDesc">{opt.description}</span>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>

            {restingCalories != null && (
              <div className="profileEnergySummary" role="status" aria-live="polite">
                <p className="profileSubTitle">Estimated energy</p>
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
              </div>
            )}
          </section>
          </details>

          <details className="profileFold" open>
            <summary className="profileFold__summary">
              <span className="profileFold__summaryText">
                <span className="profileFold__title">Food preferences</span>
                <span className="profileFold__subtitle">Diet style and ingredients to avoid</span>
              </span>
            </summary>
          <section className="profileFold__body profileFoodSection">
            <p className="profileSubTitle">Diet</p>
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

            <p className="profileSubTitle profileSubTitle--spaced">Allergies</p>
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
          </details>

          <details className="profileFold" open>
            <summary className="profileFold__summary">
              <span className="profileFold__summaryText">
                <span className="profileFold__title">Health &amp; budget</span>
                <span className="profileFold__subtitle">Conditions we filter for, and meal cost level</span>
              </span>
            </summary>
          <section className="profileFold__body profileHealthBudgetSection">
            <p className="profileSubTitle">Health conditions</p>
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

            <p className="profileSubTitle profileSubTitle--spaced">Budget for recipes</p>
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
          </details>
          <div className="formButtonContainer">
  {viewingOwnProfile ? (
    !hasProfile ? (
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
    )
  ) : null}
</div>
          </fieldset>
        </form>
      </main>
      <ProfileHowItWorksModal
        show={showHowItWorks}
        onClose={() => {
          setShowHowItWorks(false);
          requestAnimationFrame(() => howItWorksBtnRef.current?.focus());
        }}
      />
    </div>
  );
}

export default ProfileForm;
