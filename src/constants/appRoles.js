/** Stored in `profiles.app_role` and mirrored in auth `user_metadata.app_role` at signup. */
export const APP_ROLES = {
  elderly: "elderly",
  caregiver: "caregiver",
  both: "both",
};

export const APP_ROLE_SIGNUP_OPTIONS = [
  {
    value: APP_ROLES.elderly,
    label: "I’m planning meals for myself",
    hint: "Use MealCare for your own weekly plan and shopping list.",
  },
  {
    value: APP_ROLES.caregiver,
    label: "I’m a caregiver or family helper",
    hint: "You can link other people’s accounts after they share their user ID.",
  },
  {
    value: APP_ROLES.both,
    label: "Both — I plan for myself and for someone I care for",
    hint: "Full access: your profile plus linked care recipients.",
  },
];

export function normalizeAppRole(value) {
  const v = String(value ?? "").trim().toLowerCase();
  if (v === APP_ROLES.caregiver || v === APP_ROLES.both || v === APP_ROLES.elderly) {
    return v;
  }
  return APP_ROLES.elderly;
}

export function canProvideCare(appRole) {
  const r = normalizeAppRole(appRole);
  return r === APP_ROLES.caregiver || r === APP_ROLES.both;
}
