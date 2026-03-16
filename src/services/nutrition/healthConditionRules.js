const healthConditionRules = {
    diabetes: {
      maxCarbs: 60,
      maxSugar: 12,
      maxSaturatedFat: 6.5,
      minFiber: 9,
    },
    bloodPressure: { maxSodium: 600 },
    hypertension: { maxSodium: 600 },
    
    highCholesterol: {
      maxSaturatedFat: 4.5,
      minFiber: 9,
    },
    
    heartDisease: {
      maxSodium: 575,
      maxSaturatedFat: 4.5,
      minFiber: 9,
      maxSugar: 15
    },
    
    kidneyDisease: {
      maxSodium: 675,
      maxProtein: 17.5,
      maxPhosphorus: 300
    },
    
    weightManagement: {
      maxCalories: 550,
      minFiber: 9,
      maxSugar: 17.5
    },
    
    osteoporosis: {
      minCalcium: 250,
      minVitaminD: 2
    },
    
    anemia: {
      minIron: 5,
      minFolate: 70,
      minVitaminB12: 0.5,
      minVitaminC: 25
    },
    
    digestiveHealth: {
      minFiber: 9,
      maxSugar: 17.5
    },
    
    boneJointHealth: {
      maxSaturatedFat: 4.5,
      maxSodium: 575,
      minFiber: 9,
      maxSugar: 17.5
    }
  };
  export default healthConditionRules;