import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AppContext } from "../hooks/AppContext";
import { findMealInWeeklyPlan } from "../utils/findMealInWeeklyPlan";
import { normalizeUnit } from "../utils/transformMeal";
import { formatUnitForDisplay } from "../utils/formatIngredientUnit";
import "../assets/styles/mealDetails.css";
import fallbackImg from "../assets/images/cereal.jpg";

function capitalizer(text) {
  if (!text) return "";
  return text[0].toUpperCase() + text.slice(1);
}

function groupIngredientsByCategory(ingredients) {
  const ingredientList = Array.isArray(ingredients) ? ingredients : [];
  const ingredientsByCategory = {};
  for (const ingredient of ingredientList) {
    if (!ingredient || typeof ingredient !== "object") continue;
    const categoryName =
    ingredient.category && String(ingredient.category).trim() ?
    ingredient.category :
    "Other";
    if (!ingredientsByCategory[categoryName]) ingredientsByCategory[categoryName] = [];
    ingredientsByCategory[categoryName].push(ingredient);
  }
  return ingredientsByCategory;
}

function formatFractionForDisplay(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return "";

  const fractionCandidates = [
  { value: 0.25, label: "1/4" },
  { value: 0.33, label: "1/3" },
  { value: 0.5, label: "1/2" },
  { value: 0.67, label: "2/3" },
  { value: 0.75, label: "3/4" }];

  if (numericAmount < 1) {
    const closeFraction = fractionCandidates.find(
      (candidate) => Math.abs(numericAmount - candidate.value) <= 0.03
    );
    if (closeFraction) return closeFraction.label;
  }

  const rounded = Number(numericAmount.toFixed(2));
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function formatIngredientLine(ingredient) {
  const amount = ingredient.quantity?.amount;
  const unit = ingredient.quantity?.unit ? String(ingredient.quantity.unit).trim() : "";
  const name = ingredient.name ? String(ingredient.name).trim() : "";
  const description = ingredient.displayName ? String(ingredient.displayName).trim() : "";
  const unitLower = unit.toLowerCase();
  const useReadableOriginal =
  Boolean(description) && (
  !unit || unitLower === "other" || unitLower === "serving");
  if (useReadableOriginal) {
    return description;
  }
  const hasAmount = amount !== undefined && amount !== null && Number(amount) > 0;
  const formattedAmount = hasAmount ? formatFractionForDisplay(amount) : "";
  const normalizedUnit = unit ? normalizeUnit(unit) : "";
  const unitDisplay = normalizedUnit ? formatUnitForDisplay(normalizedUnit) || normalizedUnit : "";
  const prefix = hasAmount ?
  `${formattedAmount}${unitDisplay ? ` ${unitDisplay}` : ""}`.trim() :
  "";
  return [prefix, name].filter(Boolean).join(" · ") || name || description || "—";
}

function MealDetails() {
  const { mealId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { weeklyPlan, mealPlanLoading } = useContext(AppContext);

  const [meal, setMeal] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mealFromNavigation = location.state && location.state.meal;

    if (mealFromNavigation && String(mealFromNavigation.id) === String(mealId)) {
      setMeal(mealFromNavigation);
      setReady(true);
      return;
    }

    if (mealPlanLoading) {
      setReady(false);
      return;
    }

    const mealFromWeeklyPlan = findMealInWeeklyPlan(weeklyPlan, mealId);
    setMeal(mealFromWeeklyPlan);
    setReady(true);
  }, [mealId, weeklyPlan, mealPlanLoading, location.state]);

  if (!ready) {
    return (
      <main className="meal-details-page" aria-busy="true">
        <p className="meal-details-loading">Loading recipe…</p>
      </main>);

  }

  if (!meal) {
    return (
      <main className="meal-details-page">
        <button type="button" className="meal-details-back" onClick={() => navigate("/viewPlan")}>
          ← Back to week plan
        </button>
        <div className="meal-details-empty">
          <p>We could not find this recipe in your saved week.</p>
          <button type="button" className="meal-details-back" onClick={() => navigate("/viewPlan")}>
            Go to week plan
          </button>
        </div>
      </main>);

  }

  const title = meal.title || meal.name || "Recipe";
  const imageSrc = meal.image || fallbackImg;
  const summary = meal.summary && String(meal.summary).trim() ? meal.summary : null;

  const dietTags =
  Array.isArray(meal.diets) && meal.diets.length > 0 ?
  meal.diets :
  Array.isArray(meal.diet) ?
  meal.diet :
  [];

  const nutrition = meal.nutrition || {};
  const nutritionItems = [
  {
    label: "Calories",
    val:
    nutrition.calories !== undefined && nutrition.calories !== null && Number(nutrition.calories) > 0 ?
    `${Math.round(Number(nutrition.calories))} kcal` :
    "—"
  },
  {
    label: "Protein",
    val:
    nutrition.protein !== undefined && nutrition.protein !== null ?
    `${Math.round(Number(nutrition.protein))} g` :
    "—"
  },
  {
    label: "Carbs",
    val:
    nutrition.carbs !== undefined && nutrition.carbs !== null ?
    `${Math.round(Number(nutrition.carbs))} g` :
    "—"
  },
  {
    label: "Fat",
    val:
    nutrition.fat !== undefined && nutrition.fat !== null ?
    `${Math.round(Number(nutrition.fat))} g` :
    "—"
  }];


  const instructions = Array.isArray(meal.instructions) ?
  [...meal.instructions].sort(
    (leftStep, rightStep) =>
    (Number(leftStep.stepNumber) || 0) - (Number(rightStep.stepNumber) || 0)
  ) :
  [];

  const ingredientGroups = groupIngredientsByCategory(meal.ingredients);
  const sortedCategoryNames = Object.keys(ingredientGroups).sort((categoryA, categoryB) =>
  categoryA.localeCompare(categoryB, undefined, { sensitivity: "base" })
  );

  return (
    <main className="meal-details-page">
      <button type="button" className="meal-details-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="meal-details-hero">
        <img className="meal-details-hero-img" src={imageSrc} alt={title} />
        <div className="meal-details-hero-body">
          <h1 className="meal-details-title">{title}</h1>
          <div className="meal-details-meta" aria-label="Recipe summary">
            {meal.readyInMinutes ?
            <span className="meal-details-chip">{meal.readyInMinutes} min</span> :
            null}
            {meal.servings ?
            <span className="meal-details-chip">{meal.servings} servings</span> :
            null}
            {meal.pricePerServing !== undefined && meal.pricePerServing !== null ?
            <span className="meal-details-chip">
                ~£{Number(meal.pricePerServing).toFixed(2)} / serving
              </span> :
            null}
            {meal.mealType ?
            <span className="meal-details-chip">{capitalizer(String(meal.mealType))}</span> :
            null}
          </div>
        </div>
      </div>

      {summary ?
      <section className="meal-details-section" aria-labelledby="meal-details-about">
          <h2 id="meal-details-about" className="meal-details-section-title">
            About this dish
          </h2>
          <p className="meal-details-summary">{summary}</p>
        </section> :
      null}

      <section className="meal-details-section" aria-labelledby="meal-details-nutrition">
        <h2 id="meal-details-nutrition" className="meal-details-section-title">
          Nutrition (per serving)
        </h2>
        <div className="meal-details-nutrition">
          {nutritionItems.map((nutritionRow) =>
          <div key={nutritionRow.label} className="meal-details-nutrition-item">
              <span className="meal-details-nutrition-value">{nutritionRow.val}</span>
              <span className="meal-details-nutrition-label">{nutritionRow.label}</span>
            </div>
          )}
        </div>
      </section>

      {dietTags.length > 0 ?
      <section className="meal-details-section" aria-labelledby="meal-details-diets">
          <h2 id="meal-details-diets" className="meal-details-section-title">
            Diet
          </h2>
          <div className="meal-details-tags">
            {dietTags.map((dietTag, tagIndex) =>
          <span key={`${dietTag}-${tagIndex}`} className="meal-details-tag">
                {capitalizer(String(dietTag))}
              </span>
          )}
          </div>
        </section> :
      null}

      {sortedCategoryNames.length > 0 ?
      <section className="meal-details-section" aria-labelledby="meal-details-ingredients">
          <h2 id="meal-details-ingredients" className="meal-details-section-title">
            Ingredients
          </h2>
          {sortedCategoryNames.map((categoryName) =>
        <div key={categoryName} className="meal-details-ingredient-group">
              <h3 className="meal-details-ingredient-group-title">{categoryName}</h3>
              <ul className="meal-details-ingredient-list">
                {ingredientGroups[categoryName].map((ingredient, ingredientIndex) =>
            <li key={`${ingredient.name}-${ingredientIndex}`}>
                    {formatIngredientLine(ingredient)}
                  </li>
            )}
              </ul>
            </div>
        )}
        </section> :
      null}

      {instructions.length > 0 ?
      <section className="meal-details-section" aria-labelledby="meal-details-steps">
          <h2 id="meal-details-steps" className="meal-details-section-title">
            Steps
          </h2>
          <ol className="meal-details-steps">
            {instructions.map((instructionStep, stepIndex) =>
          <li key={instructionStep.stepNumber ?? stepIndex}>
                <span className="meal-details-step-text">
                  {instructionStep.description && String(instructionStep.description).trim() ?
              instructionStep.description :
              "—"}
                </span>
              </li>
          )}
          </ol>
        </section> :
      null}
    </main>);

}

export default MealDetails;