---
name: nutrition-engine-integration
overview: Connect the existing nutrition/filter engine to Spoonacular meals and numeric nutrient rules while preserving current profile-based logic.
todos:
  - id: align-meal-model
    content: Extend transformed Spoonacular meal objects with dietary/allergen fields and nutrition levels or numeric values compatible with nutritionService.
    status: pending
  - id: hook-api-into-nutrition
    content: Create a meals hook/context and update useNutrition to use API meals instead of local meals.json.
    status: pending
  - id: numeric-nutrition-rules
    content: Replace sodiumLevel/sugarLevel string checks with numeric thresholds based on research for conditions like hypertension and diabetes.
    status: pending
  - id: api-query-from-profile
    content: Map profile dietary/allergy data to Spoonacular diet/intolerances/nutrient params in spoonacularService.
    status: pending
  - id: document-architecture
    content: Document how Spoonacular and the custom nutrition engine interact for the final report.
    status: pending
  - id: todo-1773024445969-miegkvuad
    content: ""
    status: pending
isProject: false
---

### Nutrition & Filter Engine: Remaining Work

#### 1. Align the meal model

- **Goal**: Make sure the objects that `nutritionService.filterMeals` receives from the API have the same fields (or better fields) it expects today from `meals.json`.
- **Key changes**:
  - Extend the transformed Spoonacular meal model (from `transFormMeal`) with:
    - A derived `**dietary` array** (e.g. `["vegetarian","gluten_free"]`) from Spoonacular `diets` / flags.
    - An `**allergens` array** based on ingredients/intolerances (at least `nuts`, `dairy`, `gluten` for now).
    - Either keep `**sodiumLevel` / `sugarLevel`** (low/medium/high from numeric thresholds) or migrate the engine to use **numeric mg/g**.
  - Ensure `category` / `mealType` can still be mapped to `breakfast/lunch/dinner` as expected by `mealCountByCategory`.

#### 2. Plug API meals into the engine

- **Goal**: Replace `meals.json` in `useNutrition` with API-derived meals, without breaking the existing filter logic.
- **Key changes**:
  - Introduce a hook or context (e.g. `useMeals`) that:
    - Calls `fetchMeals()` (Spoonacular service).
    - Returns `{ meals, loading, error }`.
  - Update `useNutrition` to:
    - Get `meals` from this hook instead of `meals.json`.
    - Apply `filterMeals(meals, profileData)` once the data is loaded.
    - Surface `loading`/`error` to the UI (so MealPlan/BrowseMeal can show spinners or messages).

#### 3. Implement proper nutrition rules (numeric, based on research)

- **Goal**: Replace symbolic flags like `sodiumLevel === "high"` with **quantitative thresholds** that match the literature review (e.g. 500–600 mg sodium per meal for a hypertensive profile).
- **Key changes**:
  - Define per-condition **per-meal nutrient ranges** (e.g. sodium, sugar, calories, etc.) in a config object (easier to justify in the report).
  - Update `filterByHealthCondition` to:
    - Use `meal.nutrition.{sodium,sugar,...}.amount` from `transFormMeal`.
    - Compare amounts against thresholds derived from the user profile + guidelines (e.g. `if bloodPressure && sodium > maxPerMealForHypertension → reject`).
  - Optionally extend rules to calories, protein, etc., where relevant to your literature review.

#### 4. Integrate diet & intolerance with the API query

- **Goal**: Use Spoonacular parameters as a **first-pass filter**, then validate again in your engine.
- **Key changes**:
  - Map `profileData.dietary` and `profileData.allergies` to Spoonacular query params:
    - `diet` (e.g. vegetarian, gluten free).
    - `intolerances` (e.g. gluten, dairy, peanut, tree nut).
    - Possibly `excludeIngredients` for specific medications/foods.
  - Adjust `spoonacularService.fetchMeals` to build the query from profile data.
  - Keep `filterMeals` as a **second layer** that double-checks diet/allergens/nutrients.

#### 5. Keep app responsibilities clear (for the write-up)

- **Goal**: Show in your report that the app is not just a raw Spoonacular UI.
- **Key points to document**:
  - Spoonacular: **source of recipes + nutrient data**.
  - Your app: **profile capture**, **rule engine** (diet, allergies, health conditions, budget), **weekly plan generation**, **shopping list support**.
  - Explain how numeric thresholds are based on nutritionist/literature guidance and how the engine enforces them per-meal.

This preserves your existing `nutritionService` as the core “nutrition brain”, but upgrades it to work with real API data and research-based limits instead of just local dummy JSON.