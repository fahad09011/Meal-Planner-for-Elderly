import { useEffect, useRef } from "react";

export default function ShoppingHowItWorksModal({ show, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  useEffect(() => {
    if (show && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div
        className="shopping-help-backdrop"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        id="shopping-how-it-works-dialog"
        className="modal show d-block shopping-help-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shopping-how-it-works-title"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable shopping-help-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2
                id="shopping-how-it-works-title"
                className="modal-title h5 mb-0"
              >
                How shopping list works
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body shopping-help-body">
              <section className="shopping-help-section" aria-labelledby="shop-help-source">
                <h3 id="shop-help-source" className="shopping-help-heading">
                  Where the list comes from
                </h3>
                <p>
                  Ingredients are built from the meal plan you save for this week. If the list is
                  empty, save meals on the meal plan page first, then open this page again—we can
                  fill the list automatically when needed.
                </p>
              </section>

              <section className="shopping-help-section" aria-labelledby="shop-help-tick">
                <h3 id="shop-help-tick" className="shopping-help-heading">
                  Ticking items
                </h3>
                <p>
                  Tap the circle next to a line when that item goes in your trolley. That helps you
                  see what is still to buy and keeps your progress in sync.
                </p>
              </section>

              <section className="shopping-help-section" aria-labelledby="shop-help-filters">
                <h3 id="shop-help-filters" className="shopping-help-heading">
                  Show on list
                </h3>
                <p>
                  Use <strong>All items</strong> to see every line, <strong>Still to buy</strong> to
                  hide what you already ticked, or <strong>Already bought</strong> to review what
                  you picked up. These are large buttons on purpose so they are easy to tap.
                </p>
              </section>

              <section className="shopping-help-section" aria-labelledby="shop-help-aisle">
                <h3 id="shop-help-aisle" className="shopping-help-heading">
                  Shop by aisle
                </h3>
                <p>
                  When you have items, the left column can group them by store aisle (for example
                  produce or dairy). Choose one aisle to focus the main list, or &ldquo;All
                  items&rdquo; to see everything again.
                </p>
              </section>

              <section className="shopping-help-section" aria-labelledby="shop-help-barcode">
                <h3 id="shop-help-barcode" className="shopping-help-heading">
                  Scan barcode
                </h3>
                <p>
                  Opens a tool where you can type or scan a barcode. We look up the product on{" "}
                  <strong>Open Food Facts</strong> and try to match it to a line on your list by
                  name. If it matches, you can mark that line as bought in one step.
                </p>
              </section>

              <section className="shopping-help-section" aria-labelledby="shop-help-tips">
                <h3 id="shop-help-tips" className="shopping-help-heading">
                  Quick tips
                </h3>
                <ul className="shopping-help-tips-list">
                  <li>Tick the circle when an item goes in your trolley so you do not buy it twice.</li>
                  <li>Use &ldquo;Still to buy&rdquo; to hide items you already picked.</li>
                  <li>Take your time: the list stays until you change your meal plan.</li>
                </ul>
              </section>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
