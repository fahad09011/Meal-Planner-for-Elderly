const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEAL_TYPES = ["breakfast", "lunch", "dinner"];
// { final shape
//     name: "bay leaf",
//     category: "Spices",
//     aisle: "Spices and Seasonings",
//     amount: 1,
//     unit: ""
//   }

const normalizeText = (value) => {
  if (typeof value !== "string" || value.trim() === "") return "";
  return value.toLowerCase().trim();
};

export const buildShoppingItemsFromWeeklyPlan = (weeklyPlan) => {
  const accumulator = {};
  DAYS.forEach((day) => {
    const dayPlan = weeklyPlan?.[day];
    // console.log(day, ": Day plan:", dayPlan);
    if (!dayPlan) return;

    MEAL_TYPES.forEach((mealType) => {
      const meal = dayPlan?.[mealType];
    //   console.log(day, ": ", mealType, ":", meal);
      if (!dayPlan) return;

      const ingredients = Array.isArray(meal?.ingredients)
        ? meal?.ingredients
        : [];
      console.log(day, ": ", mealType, ":", "ingredients: ", ingredients);
      ingredients.forEach((ingredient) => {
        const name = String(ingredient?.name ?? "").trim();
        const category = ingredient?.category ?? "Other";
        const aisle = ingredient?.aisle ?? "";
        const amount = Number(ingredient?.quantity?.amount ?? 0);
        const unit = String(ingredient?.quantity?.unit ?? "").trim();
        console.log("Extracted ingredient item:", {
          name,
          category,
          aisle,
          amount,
          unit,
        });
        const normalizedName = normalizeText(name);
        const normalizedUnit = normalizeText(unit);

        if (!normalizedName) return;

        const key = `${normalizedName}__${normalizedUnit}`;
        if (!accumulator[key]) {
          accumulator[key] = {
            name,
            category,
            aisle,
            amount,
            unit,
          };
        } else {
          accumulator[key].amount += amount;
        }
        console.log("Accumulator after merge:", accumulator);
        console.log("Merge key:", key);
      });
    });
  });
  return Object.values(accumulator);
};
