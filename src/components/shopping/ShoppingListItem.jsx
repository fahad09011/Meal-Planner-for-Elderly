import React, { useState } from "react";

function formatQuantity(item) {
  const amount = item.amount;
  const unit = (item.unit || "").trim();
  if (amount == null || amount === "") return unit || "—";
  if (!unit) return String(amount);
  return `${amount} ${unit}`;
}

function ShoppingListItem({ item, onToggleChecked }) {
  const isChecked = Boolean(item.checked);
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    if (busy || !onToggleChecked) return;
    setBusy(true);
    try {
      await onToggleChecked(item.id, !isChecked);
    } finally {
      setBusy(false);
    }
  }

  const onKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={`shopping-item ${isChecked ? "shopping-item--done" : ""}`}
      role="listitem"
    >
      <button
        type="button"
        className={`shopping-item__check meal-done-check ${isChecked ? "meal-done-check--done" : ""}`}
        onClick={handleToggle}
        onKeyDown={onKeyDown}
        disabled={busy}
        aria-label={
          isChecked
            ? `${item.ingredient_name}, marked as bought. Press to mark as not bought.`
            : `${item.ingredient_name}, not bought yet. Press when you put it in your trolley.`
        }
        aria-pressed={isChecked}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 12 12"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
        </svg>
      </button>

      <div className="shopping-item__main">
        <p className={`shopping-item__name ${isChecked ? "shopping-item__name--done" : ""}`}>
          {item.ingredient_name}
        </p>
        {item.added_by_barcode ? (
          <span className="shopping-item__badge">Added with barcode</span>
        ) : null}
      </div>

      <div className="shopping-item__qty" aria-label="Amount">
        {formatQuantity(item)}
      </div>
    </div>
  );
}

export default ShoppingListItem;
