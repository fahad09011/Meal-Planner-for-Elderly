// import healthConditionRules from "./nutrition/healthConditionRules";
import healthConditionRules from "./nutrition/healthConditionRules";
const dietMap={
    gluten_free: "gluten free",
    vegetarian: "vegetarian",
    lacto_vegetarian: "lacto-vegetarian",
    ovo_vegetarian: "ovo-vegetarian",
    vegan: "vegan",
    pescetarian: "pescetarian",
    paleo: "paleo",
    primal: "primal",
    low_fodmap: "low FODMAP",
    whole30: "whole30",
};
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
// const healthConditionRules = {
//     diabetes: {
//       maxCarbs: 60,
//       maxSugar: 12,
//       maxSaturatedFat: 6.5,
//       minFiber: 9,
//     },
//     /** Form sends "bloodPressure"; same rules as hypertension */
    
//     hypertension: {
//       maxSodium: 600,
//     },
    
//     highCholesterol: {
//       maxSaturatedFat: 4.5,
//       minFiber: 9,
//     },
    
//     heartDisease: {
//       maxSodium: 575,
//       maxSaturatedFat: 4.5,
//       minFiber: 9,
//       maxSugar: 15
//     },
    
//     kidneyDisease: {
//       maxSodium: 675,
//       maxProtein: 17.5,
//       maxPhosphorus: 300
//     },
    
//     weightManagement: {
//       maxCalories: 550,
//       minFiber: 9,
//       maxSugar: 17.5
//     },
    
//     osteoporosis: {
//       minCalcium: 250,
//       minVitaminD: 2
//     },
    
//     anemia: {
//       minIron: 5,
//       minFolate: 70,
//       minVitaminB12: 0.5,
//       minVitaminC: 25
//     },
    
//     digestiveHealth: {
//       minFiber: 9,
//       maxSugar: 17.5
//     },
    
//     boneJointHealth: {
//       maxSaturatedFat: 4.5,
//       maxSodium: 575,
//       minFiber: 9,
//       maxSugar: 17.5
//     }
//   };
  
function buildMealQueryParams(profileData) {
    const params = {
      addRecipeNutrition: true,
      addRecipeInformation: true,
      addRecipeInstructions: true,
      fillIngredients: true,
      type: "breakfast,lunch,dinner",
      number: 10,
    };
    const dietValues=[];
    const intoleranceValues=[];

    if(profileData.dietary.length > 0){
        profileData.dietary.forEach((diet)=>{
            if(dietMap[diet]){
                dietValues.push(dietMap[diet]);
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
                Object.assign(params, healthConditionRules[healthCondition]);
            }
        });
    }
    return params;
  }

  
  export default buildMealQueryParams;