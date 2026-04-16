import React from "react";
import { aisleLabel } from "../../utils/shoppingAisle";

function colorForAisle(name, index) {
  if (name === "All items") return "#9ca3af";
  const lower = name.toLowerCase();
  if (lower.includes("produce") || lower.includes("vegetable") || lower.includes("fruit")) return "#22c55e";
  if (lower.includes("dairy") || lower.includes("egg")) return "#3b82f6";
  if (lower.includes("meat") || lower.includes("fish") || lower.includes("seafood")) return "#9a3412";
  if (lower.includes("pantry") || lower.includes("canned")) return "#92400e";
  if (lower.includes("bakery") || lower.includes("bread")) return "#78716c";
  const fallback = ["#6366f1", "#0d9488", "#c026d3", "#ea580c", "#4f46e5"];
  return fallback[index % fallback.length];
}

function ShoppingAisleFilter({ items, selected, onSelect }) {
  const total = items?.length ?? 0;
  const counts = new Map();
  for (const item of items || []) {
    const key = aisleLabel(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const sorted = Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
  const categories = sorted.map(([label, count], idx) => ({
    key: label,
    label,
    count,
    color: colorForAisle(label, idx),
  }));
  const rows = [
    { key: "all", label: "All items", count: total, color: colorForAisle("All items", 0) },
    ...categories,
  ];

  return (
    <nav className="shopping-aisle-filter" aria-labelledby="shopping-aisle-filter-label">
      <p id="shopping-aisle-filter-label" className="shopping-aisle-filter__heading">
        Filter by aisle
      </p>
      <ul className="shopping-aisle-filter__list" role="list">
        {rows.map((row) => {
          const isActive = row.key === "all" ? selected === "all" : selected === row.key;
          return (
            <li key={row.key === "all" ? "all" : row.key} className="shopping-aisle-filter__item">
              <button
                type="button"
                className={`shopping-aisle-filter__row ${isActive ? "shopping-aisle-filter__row--active" : ""}`}
                onClick={() => onSelect(row.key === "all" ? "all" : row.key)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${row.label}, ${row.count} items`}
              >
                <span
                  className="shopping-aisle-filter__dot"
                  style={{ backgroundColor: row.color }}
                  aria-hidden="true"
                />
                <span className="shopping-aisle-filter__name">{row.label}</span>
                <span
                  className={`shopping-aisle-filter__count ${isActive ? "shopping-aisle-filter__count--plain" : ""}`}
                >
                  {row.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default ShoppingAisleFilter;
