import { ACTIVITY_MULTIPLIER_BY_ID } from "../../constants/activityLevels";

/** DB values that may exist from older schemas or manual edits. */
const DB_TO_APP = {
  sedentary: "sedentary",
  light: "lightly_active",
  lightly_active: "lightly_active",
  moderate: "moderately_active",
  moderately_active: "moderately_active",
  active: "very_active",
  very_active: "very_active",
  extra_active: "extra_active",
};

/** Prefer canonical app ids in the DB so new rows stay consistent with ACTIVITY_LEVEL_OPTIONS. */
const APP_TO_DB = {
  sedentary: "sedentary",
  lightly_active: "lightly_active",
  moderately_active: "moderately_active",
  very_active: "very_active",
  extra_active: "extra_active",
};

export function activityLevelFromDb(dbValue) {
  if (dbValue == null || dbValue === "") return "";
  const key = String(dbValue).trim();
  if (ACTIVITY_MULTIPLIER_BY_ID[key]) return key;
  return DB_TO_APP[key] ?? "";
}

export function activityLevelToDb(appValue) {
  if (appValue == null || appValue === "") return null;
  const key = String(appValue).trim();
  if (!(key in ACTIVITY_MULTIPLIER_BY_ID)) return null;
  return APP_TO_DB[key] ?? null;
}
