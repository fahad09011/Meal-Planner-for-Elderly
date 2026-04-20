import React from "react";
import ShoppingListItem from "./ShoppingListItem";
import { aisleLabel } from "../../utils/shoppingAisle";

function ShoppingList({ items, statusFilter, categoryFilter, onToggleChecked }) {
  let filtered = [];
  if (items?.length) {
    let list = items;
    if (categoryFilter && categoryFilter !== "all") {
      list = list.filter((row) => aisleLabel(row) === categoryFilter);
    }
    if (statusFilter === "pending") list = list.filter((row) => !row.checked);else
    if (statusFilter === "done") list = list.filter((row) => row.checked);
    filtered = list;
  }

  const map = new Map();
  for (const item of filtered) {
    const key = aisleLabel(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  const groups = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));

  if (!items.length) {
    return null;
  }

  if (!filtered.length) {
    return (
      <p className="shopping-list__empty-filter" role="status">
        Nothing to show for these filters. Try another aisle or switch &ldquo;Show on list&rdquo; to All items.
      </p>);

  }

  return (
    <div className="shopping-list" aria-label="Shopping list by section">
      {groups.map(([section, sectionItems], idx) => {
        const sid = `shop-section-${idx}`;
        return (
          <section key={section} className="shopping-list__section" aria-labelledby={sid}>
          <h3 id={sid} className="shopping-list__section-title">
            {section}
          </h3>
          <ul className="shopping-list__rows">
            {sectionItems.map((item) =>
              <li key={item.id} className="shopping-list__row-wrap">
                <ShoppingListItem item={item} onToggleChecked={onToggleChecked} />
              </li>
              )}
          </ul>
        </section>);

      })}
    </div>);

}

export default ShoppingList;