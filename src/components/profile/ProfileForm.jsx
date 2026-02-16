import React from "react";
import "../../assets/styles/profile.css";

function ProfileForm() {
  return (
    <div>
      <main className="profileMainContainer">
        <form action="" className="profileForm">
          <div className="formTitleContainer">
            <h2 className="formTitle">Pofile Settings</h2>
          </div>
          {/* age g */}
          <section className="ageGroupMainSection">
            <p className="title">Age Group</p>

            <div className="ageGroupMainContainer">
              <div className="ageGroupContainer one">
                <input type="radio" name="age" id="one" />
                <label htmlFor="one">40-50</label>
              </div>
              <div className="ageGroupContainer two">
                <input type="radio" name="age" id="two" />
                <label htmlFor="two">51-60</label>
              </div>
              <div className="ageGroupContainer three">
                <input type="radio" name="age" id="three" />
                <label htmlFor="three">61-70</label>
              </div>
              <div className="ageGroupContainer four">
                <input type="radio" name="age" id="four" />
                <label htmlFor="four">70+</label>
              </div>
            </div>
          </section>
          <hr />

          {/* Dietary Preference  */}
          <section className="dietaryMainSection">
            <p className="title">Dietary Preference</p>

            <div className="dietaryGroupMainContainer">
              <div className="dietaryGroupContainer vegeterian">
                <input
                  type="checkbox"
                  name="dietary"
                  id="vegeterian"
                  value="vegeterian"
                />
                <label htmlFor="vegeterian">Vegeterian</label>
              </div>
              <div className="dietaryGroupContainer plantBased">
                <input type="checkbox" name="dietary" id="plantBased" />
                <label htmlFor="plantBased">Plant-Based</label>
              </div>
            </div>
          </section>
          <hr />


          {/* alergies Preference  */}
          <section className="alergiesMainSection">
            <p className="title">Alergies Preference</p>

            <div className="alergiesGroupMainContainer">
              <div className="alergiesGroupContainer nuts">
                <input type="checkbox" name="alergies" id="nuts" value="nuts" />
                <label htmlFor="nuts">Nuts</label>
              </div>

              <div className="alergiesGroupContainer dairy">
                <input type="checkbox" name="alergies" id="dairy" />
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
                  type="checkbox"
                  name="healthConsideration"
                  id="bloodPressure"
                  value="bloodPressure"
                />
                <label htmlFor="bloodPressure">High Blood Pressure</label>
              </div>
              <div className="healthConsiderationGroupContainer diabities">
                <input type="checkbox" name="dietary" id="diabities" />
                <label htmlFor="diabities">Diabities</label>
              </div>
            </div>
          </section>
          <hr />

          {/* budget  */}
          <section className="budgetMainSection">
            <p className="title">Budget Preference</p>

            <div className="budgetGroupMainContainer">
              <div className="budgetGroupContainer low">
                <input type="radio" name="budget" id="low" />
                <label htmlFor="low">Low</label>
              </div>
              <div className="budgetGroupContainer medium">
                <input type="radio" name="budget" id="medium" />
                <label htmlFor="medium">Medium</label>
              </div>
              <div className="budgetGroupContainer flexible">
                <input type="radio" name="budget" id="flexible" />
                <label htmlFor="flexible">Flexible</label>
              </div>
            </div>
          </section>
          <hr />
          <div className="formButtonContainer">
            <button type="submit" className="saveButton">
              Save
            </button>
            <button type="submit" className="updateButton">
              Update
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ProfileForm;
