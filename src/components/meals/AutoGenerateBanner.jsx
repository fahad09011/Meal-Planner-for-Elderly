import React from "react";
import Button from "../common/Button";

function AutoGenerateBanner({ completedDay, onGenerate, onAutoWeeklyPlan }) {
  return (
    <section
      className="auto-generate-banner"
      data-completed-days={completedDay}
      aria-labelledby="auto-banner-title"
      aria-describedby="auto-banner-desc">
      
      <div className="auto-generate-banner__icon" aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 26 26"
          fill="none"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round">
          
          <path d="M13 2l2.5 7H23l-6 4.5 2.5 7L13 17l-6.5 4.5 2.5-7L3 9h7.5L13 2z" />
        </svg>
      </div>

      <div className="auto-generate-banner__text">
        <p id="auto-banner-title" className="auto-generate-banner__title">
          Quick actions
        </p>
        <p id="auto-banner-desc" className="auto-generate-banner__sub">
          Let the app suggest all seven days for you, or save your plan when every day has three
          meals ({completedDay} of 7 ready).
        </p>
      </div>

      <div className="auto-generate-banner__actions">
        <Button
          type="button"
          className="auto-generate-banner__btn"
          onClick={onAutoWeeklyPlan}
          aria-label="Fill all seven days using suggested recipes from the list below.">
          
          Suggest whole week
        </Button>
        <Button
          type="button"
          className="auto-generate-banner__btn"
          onClick={onGenerate}
          aria-label="Save this meal plan to your account. Needs all seven days filled."
          disabled={completedDay < 7}>
          
          Save plan to account
        </Button>
      </div>
    </section>);

}

export default AutoGenerateBanner;