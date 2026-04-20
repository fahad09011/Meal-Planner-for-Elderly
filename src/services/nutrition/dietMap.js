export const dietRequestMap = {
  vegetarian: "vegetarian",
  vegan: "vegan",
  pescetarian: "pescetarian",
  paleo: "paleo",
  primal: "primal",
  gluten_free: "gluten free",
  lacto_vegetarian: "lacto-vegetarian",
  ovo_vegetarian: "ovo-vegetarian",
  lacto_ovo_vegetarian: "lacto-ovo-vegetarian",
  whole30: "whole30",
  low_fodmap: "low FODMAP"
};

export const dietResponseMap = {
  vegetarian: "vegetarian",

  vegan: "vegan",

  pescetarian: "pescetarian",

  paleo: "paleo",
  paleolithic: "paleo",

  primal: "primal",

  "gluten free": "gluten_free",

  "lacto vegetarian": "lacto_vegetarian",
  "lacto-vegetarian": "lacto_vegetarian",

  "ovo vegetarian": "ovo_vegetarian",
  "ovo-vegetarian": "ovo_vegetarian",

  "lacto ovo vegetarian": "lacto_ovo_vegetarian",
  "lacto-ovo-vegetarian": "lacto_ovo_vegetarian",

  "low fodmap": "low_fodmap",

  whole30: "whole30"
};

export const dietCompatibilityMap = {
  vegetarian: [
  "vegetarian",
  "lacto_vegetarian",
  "ovo_vegetarian",
  "lacto_ovo_vegetarian",
  "vegan"],


  vegan: ["vegan"],

  pescetarian: ["pescetarian"],

  lacto_vegetarian: [
  "lacto_vegetarian",
  "lacto_ovo_vegetarian"],


  ovo_vegetarian: [
  "ovo_vegetarian",
  "lacto_ovo_vegetarian"],


  lacto_ovo_vegetarian: ["lacto_ovo_vegetarian"],

  gluten_free: ["gluten_free"],

  paleo: ["paleo"],

  primal: ["primal"],

  low_fodmap: ["low_fodmap"],

  whole30: ["whole30"]
};