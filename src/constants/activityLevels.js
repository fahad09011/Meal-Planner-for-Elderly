
export const ACTIVITY_LEVEL_OPTIONS = [
  {
    id: "sedentary",
    multiplier: 1.2,
    label: "Sedentary",
    description: "Little to no exercise, desk job.",
  },
  {
    id: "lightly_active",
    multiplier: 1.375,
    label: "Lightly active",
    description: "Light exercise or sports 1–3 days per week.",
  },
  {
    id: "moderately_active",
    multiplier: 1.55,
    label: "Moderately active",
    description: "Moderate exercise or sports 3–5 days per week.",
  },
  {
    id: "very_active",
    multiplier: 1.725,
    label: "Very active",
    description: "Hard exercise or sports 6–7 days per week.",
  },
  {
    id: "extra_active",
    multiplier: 1.9,
    label: "Extra active",
    description: "Very hard exercise, physical job, or training twice per day.",
  },
];

export const ACTIVITY_MULTIPLIER_BY_ID = ACTIVITY_LEVEL_OPTIONS.reduce(
  (accumulator, option) => {
    accumulator[option.id] = option.multiplier;
    return accumulator;
  },
  {},
);
