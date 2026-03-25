import React from "react";

function ShoppingTips() {
  return (
    <aside className="shopping-tips" aria-labelledby="shopping-tips-heading">
      <h2 id="shopping-tips-heading" className="shopping-panel__title">
        Quick tips
      </h2>
      <ul className="shopping-tips__list">
        <li>Tap the circle when an item goes in your trolley so you do not buy it twice.</li>
        <li>Use &ldquo;Still to buy&rdquo; to hide items you already picked.</li>
        <li>Take your time: the list stays until you change your meal plan.</li>
      </ul>
    </aside>
  );
}

export default ShoppingTips;
