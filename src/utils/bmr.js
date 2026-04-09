import { ACTIVITY_MULTIPLIER_BY_ID } from "../constants/activityLevels";
import healthConditionRules from "../services/nutrition/healthConditionRules";

/**
 * Resting daily calories (BMR) using the Mifflin–St Jeor formula (kcal/day).
 */
export function calculateRestingDailyCalories({ age, weightKg, heightCm, gender }) {
  const weightKgNum = Number(weightKg);
  const heightCmNum = Number(heightCm);
  const ageYears = Number(age);
  if (
    !Number.isFinite(weightKgNum) ||
    !Number.isFinite(heightCmNum) ||
    !Number.isFinite(ageYears)
  ) {
    return null;
  }
  if (weightKgNum <= 0 || heightCmNum <= 0 || ageYears < 18 || ageYears > 120) {
    return null;
  }

  const base =
    10 * weightKgNum + 6.25 * heightCmNum - 5 * ageYears;
  let restingCalories;
  if (gender === "male") {
    restingCalories = base + 5;
  } else if (gender === "female") {
    restingCalories = base - 161;
  } else if (gender === "other") {
    restingCalories = base - 78;
  } else {
    return null;
  }

  return Math.round(restingCalories);
}

/**
 * Daily calories after activity (TDEE): resting calories × activity multiplier.
 */
export function calculateDailyCaloriesAfterActivity(restingCalories, activityLevelId) {
  if (!Number.isFinite(restingCalories) || restingCalories <= 0) return null;
  const activityMultiplier = ACTIVITY_MULTIPLIER_BY_ID[activityLevelId];
  if (!activityMultiplier) return null;
  return Math.round(restingCalories * activityMultiplier);
}

/**
 * Reads age, weight, height, gender, activity from profile (same shape as AppContext).
 * @returns {{ restingCalories: number|null, dailyCalories: number|null }}
 */
export function getRestingAndDailyCaloriesFromProfile(profile) {
  const restingCalories = calculateRestingDailyCalories({
    age: profile.age,
    weightKg: profile.weightKg,
    heightCm: profile.heightCm,
    gender: profile.gender,
  });
  const dailyCalories =
    restingCalories != null && profile.activityLevel
      ? calculateDailyCaloriesAfterActivity(restingCalories, profile.activityLevel)
      : null;
  return { restingCalories, dailyCalories };
}

/**
 * Max calories we allow per recipe/meal: one third of daily total (three main meals),
 * and if "weight management" is ticked, we also respect that rule’s calorie cap (whichever is lower).
 */
export function getMaxCaloriesPerMeal(profile) {
  const { dailyCalories } = getRestingAndDailyCaloriesFromProfile(profile);
  const caloriesFromDailyBudget =
    dailyCalories != null ? Math.round(dailyCalories / 3) : null;

  const healthConditionsList = profile.healthConditions || [];
  const weightManagementRule = healthConditionRules.weightManagement;
  const weightManagementMaxCalories =
    healthConditionsList.includes("weightManagement") &&
    weightManagementRule?.maxCalories != null
      ? weightManagementRule.maxCalories
      : null;

  const limits = [caloriesFromDailyBudget, weightManagementMaxCalories].filter(
    (value) => value != null && value > 0,
  );
  if (limits.length === 0) return null;
  return Math.min(...limits);
}
