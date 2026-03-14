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
    return params;
  }

  
  export default buildMealQueryParams;