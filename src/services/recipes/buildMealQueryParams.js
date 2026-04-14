import healthConditionRules from "../nutrition/healthConditionRules";
import { dietRequestMap } from "../nutrition/dietMap";
import { getMaxCaloriesPerMeal, getMinCaloriesPerMeal } from "../../utils/bmr";

const intoleranceMap={
    dairy: "dairy",
    egg: "egg",
    gluten: "gluten",
    grain: "grain",
    peanut: "peanut",
    seafood: "seafood",
    sesame: "sesame",
    shellfish: "shellfish",
    soy: "soy",
    sulfite: "sulfite",
    treeNut: "tree nut",
    wheat: "wheat",
};


// fix call rate
  
function buildMealQueryParams(profileData) {
    const params = {
      addRecipeNutrition: true,
      addRecipeInformation: true,
      addRecipeInstructions: true,
      fillIngredients: true,
      type: "breakfast,lunch,dinner",
      number: 30,
    };

    const dietValues=[];
    const intoleranceValues=[];

    if(profileData.dietary.length > 0){
        profileData.dietary.forEach((diet)=>{
            if(dietRequestMap[diet]){
                dietValues.push(dietRequestMap[diet]);
            };
        });
        if(dietValues.length>0){
            params.diet= dietValues.join(",");}
    }

    if(profileData.allergies.length > 0){
        profileData.allergies.forEach((allergy)=>{
            if(intoleranceMap[allergy]){
                intoleranceValues.push(intoleranceMap[allergy]);
            };
        });
        if(intoleranceValues.length>0){
            params.intolerances= intoleranceValues.join(",");}
    }

    const healthConditions = profileData.healthConditions || [];
    if (healthConditions.length > 0) {
        healthConditions.forEach((healthCondition) => {
            if (healthConditionRules[healthCondition]) {
                const rules = { ...healthConditionRules[healthCondition] };
                delete rules.maxCalories;
                Object.assign(params, rules);
            }
        });
    }

    const maxCaloriesPerMeal = getMaxCaloriesPerMeal(profileData);
    const minCaloriesPerMeal = getMinCaloriesPerMeal(profileData);
    if (maxCaloriesPerMeal != null) {
        params.maxCalories = maxCaloriesPerMeal;
    }
    if (minCaloriesPerMeal != null) {
        params.minCalories = minCaloriesPerMeal;
    }

    return params;
  }

/**
 * Stable string for caching Spoonacular `complexSearch` results: same key ⇒ same query params.
 * Includes `activeDataUserId` so caregiver switches / different clients never reuse another user’s cache.
 */
export function getRecipeSearchCacheKey(activeDataUserId, profileData) {
  const params = buildMealQueryParams(profileData);
  return JSON.stringify({ userId: activeDataUserId ?? null, params });
}

  export default buildMealQueryParams;
