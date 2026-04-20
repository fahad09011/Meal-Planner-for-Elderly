import React from "react";

function ShoppingProgress({ total, completed }) {
  const safeTotal = Math.max(0, total);
  const safeDone = Math.min(Math.max(0, completed), safeTotal);
  const pct = safeTotal === 0 ? 0 : Math.round(safeDone / safeTotal * 100);

  return (
    <div className="shopping-progress" role="region" aria-labelledby="shopping-progress-heading">
      <h2 id="shopping-progress-heading" className="shopping-panel__title">
        Your progress
      </h2>
      <p className="shopping-progress__summary" aria-live="polite">
        <strong className="shopping-progress__numbers">
          {safeDone} of {safeTotal}
        </strong>{" "}
        items in your trolley
      </p>
      <div
        className="shopping-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeDone}
        aria-label={`Shopping progress: ${pct} percent complete`}>
        
        <div
          className="shopping-progress__fill"
          style={{ width: `${safeTotal ? pct : 0}%` }} />
        
      </div>
      <p className="shopping-progress__pct">{safeTotal === 0 ? "—" : `${pct}% done`}</p>
    </div>);

}

export default ShoppingProgress;