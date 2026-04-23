# MealCare

**MealCare** helps you plan balanced meals for a full week, see your plan in one place, and turn it into a simple shopping list. You can use it for yourself or, if you are a carer, link to someone you support so you can view their plan and list with their permission.

MealCare runs in a normal web browser on a computer, tablet, or phone. It is designed to be clear and straightforward, including for older adults and people who help them with meals.

---

## Using MealCare (end users)

### Getting started
 https://meal-planner-for-elderly.vercel.app/
1. **Open the app** in your browser using URL
2. **Create an account** or **log in** from the login page. You need an account so your meal plan, profile, and shopping list are saved for you.
3. **Complete your profile** — your age, height, activity level, dietary needs, and health notes help the app suggest meals and nutrition information that better match you. You can also find your **user ID** on the profile screen; a carer may need it to link to you.
4. **Build your meal plan** for the week, **view the plan** when you are ready, and use the **shopping list** for what to buy. You can scan barcodes for items when that feature is available on your device.

### Main areas of the app

| Area | What it is for |
|------|----------------|
| **Home** | Shortcuts to meal plan, profile, and shopping, plus a link to the user guide. |
| **Meal plan** | Choose breakfast, lunch, and dinner ideas for each day and save your week. You must be signed in to browse and save recipes. |
| **View plan** | See your full week in one place. |
| **Shopping** | A list from your plan; you can tick items as you buy them. |
| **Profile** | Your details, preferences, and your user ID for carers. |
| **Caregiving** | If your account is set up as a carer, you can add a care recipient by their user ID (they must have their own account and profile). |
| **Account / log in** | Sign in, sign out, or reset your password. |

### Help and full instructions

- **User guide and FAQ** (step-by-step, requirements, and tips):  
  **[Open the MealCare user guide (Google Doc)](https://docs.google.com/document/d/e/2PACX-1vS5MnKfa0CMTxsbmuhl7JDQBe0KvUvbP5_iZ4IbWa2X9Ffdwz4o3oP-o_eix3SOws7ILsF4AHQnejlr/pub)**  
  The app also links to this from **Home** and the **login** page as **“Help & user guide.”**

- **Terms of use** are available inside the app (for example from the login area).

### Install on your phone (optional)

On supported phones and tablets, you may be able to **add MealCare to your home screen** (sometimes called *install* or *add to home screen*) so it opens like an app. This needs a normal internet connection for signing in and saving data. Exact steps depend on your browser (Chrome, Safari, etc.).

### Important note

MealCare uses general food and recipe information. It is **not** a substitute for advice from a doctor, dietitian, or other health professional. Always follow advice that applies to your health conditions.

---

## For developers: compile and deploy

The following is for people who need to run or host the project from source.

### Requirements

- **Node.js** 20+ and **npm**
- A **Supabase** project
- A **Spoonacular** key for recipe search ([Spoonacular Food API](https://spoonacular.com/food-api))

### Install and run locally

```bash
git clone <repository-url>
cd Meal-Planner-for-Elderly
npm install
```

Create **`.env.local`** in the project root (do not commit it):

| Variable | Notes |
|----------|--------|
| `VITE_SUPABASE_URL` | From Supabase project settings |
| `VITE_SUPABASE_ANON_KEY` | Public anon key |
| `VITE_SPOONACULAR_API_KEY` | Optional for local dev; use for direct API calls in development |

**Development server:**

```bash
npm run dev
```

Open the URL shown in the terminal (port is set in `vite.config.js`, often `http://localhost:3000`).

**Production build:**

```bash
npm run build
```

Output is in **`dist/`**. Check locally with:

```bash
npm run preview
```

**Other:** `npm run lint` — ESLint · `npm test` — unit tests in `tests/`

### Deploying (e.g. Vercel)

- **Build command:** `npm run build`  
- **Output directory:** `dist`  
- On the host, set **`SPOONACULAR_API_KEY`** (server-only; not `VITE_`) for the `api/meals` function, plus the same `VITE_SUPABASE_*` values as in `.env.local`.  
- **`vercel.json`** in the repo routes `/api/*` to serverless `api/` handlers.  
- After deploy, add your **live site URL** in Supabase → Authentication → URL Configuration.  
- Apply database scripts from **`supabase/migrations/`** to your Supabase project to match the app’s tables and security rules.

### Repository layout (technical)

- `src/` — application code  
- `api/` — serverless API (e.g. recipe proxy)  
- `public/` — static files  
- `tests/` — automated tests  
- `supabase/migrations/` — SQL migrations  

---

## License

Academic / coursework use unless your institution says otherwise.
