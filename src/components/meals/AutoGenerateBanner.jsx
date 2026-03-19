import React from "react";
import Button from "../common/Button";

function AutoGenerateBanner({ completedDay, onGenerate }) {
  // Only show when all 7 days are planned
  if (completedDay < 7) return null;

  return (
    <section className="auto-generate-banner">
      <div className="auto-generate-banner__icon">
        {/* star svg */}
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
          stroke="white" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2l2.5 7H23l-6 4.5 2.5 7L13 17l-6.5 4.5 2.5-7L3 9h7.5L13 2z"/>
        </svg>
      </div>

      <div className="auto-generate-banner__text">
        <p className="auto-generate-banner__title">
          Ready to generate your full week
        </p>
        <p className="auto-generate-banner__sub">
          All 7 days planned. Generate your weekly plan now.
        </p>
      </div>

      <Button
        className="auto-generate-banner__btn"
        onClick={onGenerate}
      >
        ✅ Generate Weekly Plan
      </Button>
    </section>
  );
}

export default AutoGenerateBanner;