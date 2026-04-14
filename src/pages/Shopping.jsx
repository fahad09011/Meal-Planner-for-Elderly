import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BiBarcode } from "react-icons/bi";

import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import {
  getShoppingListItems,
  syncShoppingListFromWeeklyPlan,
  updateShoppingListItemChecked,
} from "../services/database/shoppingListService";
import BarcodeScannerModal from "../components/shopping/BarcodeScannerModal";
import ShoppingHowItWorksModal from "../components/shopping/ShoppingHowItWorksModal";
import ShoppingList from "../components/shopping/ShoppingList";
import ShoppingAisleFilter from "../components/shopping/ShoppingAisleFilter";
import ShoppingFilters from "../components/shopping/ShoppingFilters";
import ShoppingProgress from "../components/shopping/ShoppingProgress";
import { aisleLabel } from "../utils/shoppingAisle";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function weeklyPlanHasMeals(plan) {
  if (!plan || typeof plan !== "object") return false;
  for (const d of WEEK_DAYS) {
    const day = plan[d];
    if (!day) continue;
    for (const mt of ["breakfast", "lunch", "dinner"]) {
      if (day[mt]?.id) return true;
    }
  }
  return false;
}

function Shopping() {
  const { user, authLoading } = useAuth();
  const {
    mealPlanId,
    mealPlanLoading,
    weeklyPlan,
    shoppingListSessionCache,
    setShoppingListSessionCache,
  } = useContext(AppContext);
  /** Meal plan is loaded from DB on app init; avoid flashing “no plan” while id is still null. */
  const waitingForMealPlan = Boolean(
    user && !authLoading && mealPlanLoading && !mealPlanId,
  );
  const [shoppingItems, setShoppingItems] = useState([]);
  const [shoppingLoading, setShoppingLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const howItWorksBtnRef = useRef(null);
  const shoppingCacheRef = useRef(shoppingListSessionCache);
  shoppingCacheRef.current = shoppingListSessionCache;

  useEffect(() => {
    if (!mealPlanId) {
      setShoppingItems([]);
      setFetchError(null);
      return;
    }

    const cached = shoppingCacheRef.current;
    if (
      cached.mealPlanId === mealPlanId &&
      Array.isArray(cached.items) &&
      cached.items.length > 0
    ) {
      setShoppingItems(cached.items);
      setFetchError(null);
      setShoppingLoading(false);
      return;
    }

    let cancelled = false;

    const fetchShoppingItems = async () => {
      setShoppingLoading(true);
      setFetchError(null);
      const result = await getShoppingListItems(mealPlanId);
      if (cancelled) return;

      if (!result.success) {
        console.error("Failed to fetch shopping items", result.error);
        setShoppingItems([]);
        setFetchError(
          "We could not load your list. Please try again in a moment.",
        );
        setShoppingLoading(false);
        return;
      }

      let rows = result.data || [];
      if (rows.length === 0 && user?.id && weeklyPlanHasMeals(weeklyPlan)) {
        const sync = await syncShoppingListFromWeeklyPlan(
          mealPlanId,
          weeklyPlan,
          user.id,
        );
        if (!cancelled && sync.success) {
          const again = await getShoppingListItems(mealPlanId);
          if (!cancelled && again.success) {
            rows = again.data || [];
          }
        }
      }

      if (!cancelled) {
        setShoppingItems(rows);
        setShoppingListSessionCache({ mealPlanId, items: rows });
      }
      setShoppingLoading(false);
    };

    fetchShoppingItems();
    return () => {
      cancelled = true;
    };
  }, [mealPlanId, user?.id, weeklyPlan, setShoppingListSessionCache]);

  useEffect(() => {
    if (categoryFilter === "all") return;
    const keys = new Set();
    for (const item of shoppingItems) {
      keys.add(aisleLabel(item));
    }
    if (!keys.has(categoryFilter)) {
      setCategoryFilter("all");
    }
  }, [categoryFilter, shoppingItems]);

  const total = shoppingItems.length;
  const done = shoppingItems.filter((item) => item.checked).length;
  const counts = { total, pending: total - done, done };

  async function handleToggleChecked(itemId, checked) {
    let snapshot;
    setShoppingItems((list) => {
      snapshot = list.map((row) => ({ ...row }));
      return list.map((row) => (row.id === itemId ? { ...row, checked } : row));
    });
    const result = await updateShoppingListItemChecked(itemId, checked);
    if (!result.success) {
      setShoppingItems(snapshot);
      console.error("Could not update item", result.error);
      return;
    }
    if (result.data) {
      setShoppingItems((list) => {
        const next = list.map((row) =>
          row.id === itemId ? { ...row, ...result.data } : row,
        );
        setShoppingListSessionCache({ mealPlanId, items: next });
        return next;
      });
    } else {
      setShoppingItems((list) => {
        const next = list.map((row) =>
          row.id === itemId ? { ...row, checked } : row,
        );
        setShoppingListSessionCache({ mealPlanId, items: next });
        return next;
      });
    }
  }

  return (
    <div className="shopping-page page">
      {shoppingLoading || waitingForMealPlan ? (
        <section
          className="shopping-loading loading-container"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="spinner-wrapper">
            <div className="spinner" />
            <p className="shopping-loading__text">
              Loading your shopping list…
            </p>
          </div>
        </section>
      ) : (
        <main className="shopping-layout layout">
          <aside className="info shopping-page__column shopping-page__column--left">
            <div className="info-box shopping-info-box">
              <h2 className="shopping-panel__title">Your list</h2>
              {!mealPlanId ? (
                <p className="shopping-info-box__text">
                  Open your meal plan for this week first. Your shopping list is
                  built from the meals you save.
                </p>
              ) : (
                <p className="shopping-info-box__text">
                  Ingredients from your saved meal plan. Use How it works (above
                  the list) for filters, aisles, and barcode help.
                </p>
              )}
              {!mealPlanId ? (
                <Link className="shopping-info-box__link" to="/mealPlan">
                  Go to meal plan
                </Link>
              ) : null}
            </div>
            {mealPlanId && shoppingItems.length > 0 ? (
              <ShoppingAisleFilter
                items={shoppingItems}
                selected={categoryFilter}
                onSelect={setCategoryFilter}
              />
            ) : null}
            {mealPlanId ? (
              <ShoppingFilters
                value={statusFilter}
                onChange={setStatusFilter}
                counts={counts}
              />
            ) : null}
          </aside>

          <section
            className="content shopping-page__column shopping-page__column--center"
            aria-labelledby="shopping-main-title"
          >
            <div className="content-header shopping-content-header">
              <div className="shopping-content-header__intro">
                <div className="shopping-content-header__titleRow">
                  <h1
                    id="shopping-main-title"
                    className="title shopping-content-header__title"
                  >
                    Shopping list
                  </h1>
                  <button
                    ref={howItWorksBtnRef}
                    type="button"
                    className="btn btn-outline-secondary shopping-how-it-works-btn"
                    onClick={() => setShowHowItWorks(true)}
                    aria-haspopup="dialog"
                    aria-expanded={showHowItWorks}
                  >
                    How it works
                  </button>
                </div>
                <p className="shopping-content-header__lede">
                  Tick each item as you buy it. How it works explains filters,
                  shop-by-aisle, and the barcode tool.
                </p>
              </div>
              <div className="shopping-content-header__end">
                {mealPlanId ? (
                  <button
                    type="button"
                    className="shopping-barcode-btn btn btn-primary"
                    onClick={() => setShowBarcodeModal(true)}
                    aria-haspopup="dialog"
                    aria-expanded={showBarcodeModal}
                  >
                    <BiBarcode
                      className="shopping-barcode-btn__icon"
                      aria-hidden
                    />
                    <span>Scan barcode</span>
                  </button>
                ) : null}
                <div
                  className="options shopping-content-header__meta"
                  aria-live="polite"
                >
                  {mealPlanId
                    ? `${counts.total} item${counts.total === 1 ? "" : "s"}`
                    : "No plan loaded"}
                </div>
              </div>
            </div>

            <div className="content-body shopping-content-body">
              {fetchError ? (
                <p className="shopping-error" role="alert">
                  {fetchError}
                </p>
              ) : null}

              {!mealPlanId ? (
                <p className="shopping-empty">
                  Load a meal plan to see your shopping list here.
                </p>
              ) : !shoppingItems.length ? (
                <div className="shopping-empty shopping-empty--card">
                  <p className="shopping-empty__title">No items yet</p>
                  <p className="shopping-empty__text">
                    Save your meal plan for this week. We will fill this list
                    with ingredients from your meals.
                  </p>
                  <Link className="shopping-empty__link" to="/viewPlan">
                    View meal plan
                  </Link>
                </div>
              ) : (
                <ShoppingList
                  items={shoppingItems}
                  statusFilter={statusFilter}
                  categoryFilter={categoryFilter}
                  onToggleChecked={handleToggleChecked}
                />
              )}
            </div>
          </section>

          <aside className="side shopping-page__column shopping-page__column--right">
            {mealPlanId ? (
              <ShoppingProgress total={counts.total} completed={counts.done} />
            ) : null}
            {mealPlanId ? (
              <BarcodeScannerModal
                onClose={() => setShowBarcodeModal(false)}
                show={showBarcodeModal}
                mealPlanId={mealPlanId}
                shoppingItems={shoppingItems}
                onMarkMatchedItemBought={handleToggleChecked}
                />
            ) : null}
          </aside>
        </main>
      )}
      <ShoppingHowItWorksModal
        show={showHowItWorks}
        onClose={() => {
          setShowHowItWorks(false);
          requestAnimationFrame(() => howItWorksBtnRef.current?.focus());
        }}
      />
    </div>
  );
}

export default Shopping;
