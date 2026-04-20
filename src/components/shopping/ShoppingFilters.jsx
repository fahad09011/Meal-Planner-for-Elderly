import React from "react";

function ShoppingFilters({ value, onChange, counts }) {
  const { total = 0, pending = 0, done = 0 } = counts || {};

  const options = [
  { id: "all", label: "All items", count: total, hint: "Show every line on your list" },
  { id: "pending", label: "Still to buy", count: pending, hint: "Hide what you already bought" },
  { id: "done", label: "Already bought", count: done, hint: "See what you picked up" }];


  return (
    <div className="shopping-filters" role="group" aria-labelledby="shopping-filters-heading">
      <h2 id="shopping-filters-heading" className="shopping-panel__title">
        Show on list
      </h2>
      <p className="shopping-panel__hint">Choose what you want to see. Large buttons are easy to tap.</p>
      <div className="shopping-filters__options">
        {options.map((opt) =>
        <button
          key={opt.id}
          type="button"
          className={`shopping-filter-chip ${value === opt.id ? "shopping-filter-chip--active" : ""}`}
          onClick={() => onChange(opt.id)}
          aria-pressed={value === opt.id}
          aria-label={`${opt.label}, ${opt.count} items. ${opt.hint}`}>
          
            <span className="shopping-filter-chip__label">{opt.label}</span>
            <span className="shopping-filter-chip__count" aria-hidden="true">
              {opt.count}
            </span>
          </button>
        )}
      </div>
    </div>);

}

export default ShoppingFilters;