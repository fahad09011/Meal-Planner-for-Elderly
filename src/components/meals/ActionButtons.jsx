import React from "react";
import Button from "../common/Button";

function ActionButtons({ selectedDay, completedDay, onSave, onGenerate }) {
  return (
    <section className="action-buttons-section">
      <div className="day-actions">
        <Button className="save-day-btn" onClick={onSave}>
          💾 Save for {selectedDay}
        </Button>

        <Button
          className="generate-plan-btn"
          disabled={completedDay !== 7}
          onClick={onGenerate}
        >
          ✅ Generate Weekly Plan
        </Button>
      </div>
    </section>
  );
}

export default ActionButtons;
