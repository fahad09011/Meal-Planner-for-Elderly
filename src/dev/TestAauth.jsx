import { useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, createProfile, updateProfile } from "../services/database/profileService";
import { saveMealPlan, getMealPlanByWeek } from "../services/database/mealPlanService";
import { setMealCompletion, getMealCompletions } from "../services/database/mealCompletionService";
import { createOrGetShoppingList, replaceShoppingListItems, getShoppingListItems, updateShoppingListItemChecked } from "../services/database/shoppingListService";
import { buildShoppingItemsFromWeeklyPlan } from "../utils/buildShoppingItemsFromWeeklyPlan";
import { AppContext } from "../hooks/AppContext";

function TestAuth() {
  const { user, authLoading, isAuthenticated, signOut, signIn } = useAuth();
  const { saveProfile, clearProfile, profileData, hasProfile, weeklyPlan, setWeeklyPlan, saveWeeklyPlan, mealPlanId } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState([]);

  const addLog = useCallback((label, data) => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${label} ${JSON.stringify(data, null, 2)}`;
    setLog((prev) => [...prev, entry]);
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {addLog("ERROR:", "Enter email and password");return;}
    const { data, error } = await signIn(email, password);
    if (error) addLog("Sign-in FAILED:", error.message);else
    addLog("Sign-in OK:", data.user.email);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) addLog("Sign-out FAILED:", error.message);else
    addLog("Sign-out OK", {});
  };


  const handleCreate = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    const testData = {
      age: "68",
      weightKg: "72",
      heightCm: "165",
      gender: "female",
      activityLevel: "lightly_active",
      dietary: ["vegetarian"],
      allergies: ["gluten"],
      healthConditions: ["diabetes", "hypertension"],
      budget: "medium"
    };
    addLog("Creating profile...", testData);
    const result = await createProfile(user.id, testData);
    addLog("createProfile:", result);
  };

  const handleGet = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    const result = await getProfile(user.id);
    addLog("getProfile:", result);
  };

  const handleUpdate = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    const updatedData = {
      age: "76",
      weightKg: "70",
      heightCm: "170",
      gender: "male",
      activityLevel: "sedentary",
      dietary: ["vegan"],
      allergies: ["dairy", "peanut"],
      healthConditions: ["heartDisease"],
      budget: "low"
    };
    addLog("Updating profile...", updatedData);
    const result = await updateProfile(user.id, updatedData);
    addLog("updateProfile:", result);
  };


  const handleSaveProfile = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    const contextData = {
      age: "65",
      weightKg: "75",
      heightCm: "168",
      gender: "female",
      activityLevel: "moderately_active",
      dietary: ["pescetarian"],
      allergies: ["soy"],
      healthConditions: ["highCholesterol"],
      budget: "flexible"
    };
    addLog("saveProfile (context)...", contextData);
    const result = await saveProfile(contextData);
    addLog("saveProfile result:", result);
  };

  const handleClearProfile = () => {
    clearProfile();
    addLog("clearProfile called", {});
  };

  const handleShowState = () => {
    addLog("profileData state:", profileData);
    addLog("hasProfile:", hasProfile);
  };


  const handleSaveMealPlanDB = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    const weekStart = "2026-03-16";
    addLog("Saving weeklyPlan to DB...", { userId: user.id, weekStart });
    const result = await saveMealPlan(user.id, weekStart, weeklyPlan);
    addLog("saveMealPlan:", result);
  };

  const handleGetMealPlanByWeek = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    const weekStart = "2026-03-16";
    addLog("Getting meal plan from DB...", { userId: user.id, weekStart });
    const result = await getMealPlanByWeek(user.id, weekStart);
    addLog("getMealPlanByWeek:", result);
  };

  const handleSaveMealPlanAuto = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    const weekStart = "2026-03-16";
    addLog("Saving weeklyPlan (auto mode) to DB...", { userId: user.id, weekStart, mode: "auto" });
    const result = await saveMealPlan(user.id, weekStart, weeklyPlan, "auto");
    addLog("saveMealPlan (auto):", result);
  };


  const handleSaveWeeklyPlanCtx = () => {
    saveWeeklyPlan(weeklyPlan);
    addLog("saveWeeklyPlan (context) called", weeklyPlan);
  };

  const handleShowWeeklyPlan = () => {
    addLog("weeklyPlan state:", weeklyPlan);
  };

  const handleClearWeeklyPlan = () => {
    const emptyPlan = {
      Monday: { breakfast: null, lunch: null, dinner: null },
      Tuesday: { breakfast: null, lunch: null, dinner: null },
      Wednesday: { breakfast: null, lunch: null, dinner: null },
      Thursday: { breakfast: null, lunch: null, dinner: null },
      Friday: { breakfast: null, lunch: null, dinner: null },
      Saturday: { breakfast: null, lunch: null, dinner: null },
      Sunday: { breakfast: null, lunch: null, dinner: null }
    };
    setWeeklyPlan(emptyPlan);
    addLog("weeklyPlan cleared", {});
  };


  const handleSetMealCompletion = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    if (!mealPlanId) {addLog("ERROR:", "No mealPlanId — save a meal plan first");return;}
    addLog("Setting Monday breakfast as completed...", { mealPlanId });
    const result = await setMealCompletion(mealPlanId, "Monday", "breakfast", true, user.id);
    addLog("setMealCompletion:", result);
  };

  const handleUnsetMealCompletion = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    if (!mealPlanId) {addLog("ERROR:", "No mealPlanId");return;}
    addLog("Unsetting Monday breakfast...", { mealPlanId });
    const result = await setMealCompletion(mealPlanId, "Monday", "breakfast", false, user.id);
    addLog("setMealCompletion (undo):", result);
  };

  const handleGetMealCompletions = async () => {
    if (!mealPlanId) {addLog("ERROR:", "No mealPlanId — save a meal plan first");return;}
    addLog("Getting all meal completions...", { mealPlanId });
    const result = await getMealCompletions(mealPlanId);
    addLog("getMealCompletions:", result);
  };


  const handleCreateOrGetShoppingList = async () => {
    if (!mealPlanId) {addLog("ERROR:", "No mealPlanId — save a meal plan first");return;}
    addLog("Creating/getting shopping list...", { mealPlanId });
    const result = await createOrGetShoppingList(mealPlanId);
    addLog("createOrGetShoppingList:", result);
  };

  const handleBuildAndSaveShoppingItems = async () => {
    if (!user) {addLog("ERROR:", "Sign in first");return;}
    if (!mealPlanId) {addLog("ERROR:", "No mealPlanId");return;}
    const items = buildShoppingItemsFromWeeklyPlan(weeklyPlan);
    addLog("Built shopping items from weeklyPlan:", { count: items.length, items });
    if (items.length === 0) {addLog("WARN:", "No ingredients found in weeklyPlan");return;}

    const listResult = await createOrGetShoppingList(mealPlanId);
    if (!listResult.success) {addLog("ERROR:", listResult.error);return;}
    const shoppingListId = listResult.data.id;

    addLog("Replacing shopping list items...", { shoppingListId, itemCount: items.length });
    const result = await replaceShoppingListItems(shoppingListId, items, user.id);
    addLog("replaceShoppingListItems:", result);
  };

  const handleGetShoppingListItems = async () => {
    if (!mealPlanId) {addLog("ERROR:", "No mealPlanId");return;}
    addLog("Getting shopping list items...", { mealPlanId });
    const result = await getShoppingListItems(mealPlanId);
    addLog("getShoppingListItems:", result);
  };

  const handleCheckFirstItem = async () => {
    if (!mealPlanId) {addLog("ERROR:", "No mealPlanId");return;}
    const listResult = await getShoppingListItems(mealPlanId);
    if (!listResult.success || !listResult.data?.length) {
      addLog("ERROR:", "No shopping items found to check");return;
    }
    const firstItem = listResult.data[0];
    const newChecked = !firstItem.checked;
    addLog(`Toggling item "${firstItem.ingredient_name}" checked → ${newChecked}...`, { id: firstItem.id });
    const result = await updateShoppingListItemChecked(firstItem.id, newChecked);
    addLog("updateShoppingListItemChecked:", result);
  };

  const handleShowMealPlanId = () => {
    addLog("Current mealPlanId:", mealPlanId || "null (no plan saved yet)");
  };

  useEffect(() => {
    if (!authLoading) {
      queueMicrotask(() =>
        addLog("Auth ready. User:", user ? user.email : "none"),
      );
    }
  }, [authLoading, user, addLog]);

  if (authLoading) return <div>Checking auth...</div>;

  const btnStyle = { padding: "6px 12px", cursor: "pointer", fontSize: "13px" };

  return (
    <div style={{ padding: "1rem", border: "2px dashed red", margin: "1rem", fontFamily: "monospace", fontSize: "13px" }}>
      <h3 style={{ margin: "0 0 0.5rem" }}>Test Panel</h3>

      <div style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" style={{ padding: "4px" }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" style={{ padding: "4px" }} />
        <button onClick={handleSignIn} style={btnStyle}>Sign In</button>
        <button onClick={handleSignOut} style={btnStyle}>Sign Out</button>
        <span style={{ color: isAuthenticated ? "green" : "red" }}>
          {isAuthenticated ? `✓ ${user.email}` : "✗ Not signed in"}
        </span>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>profileService (direct DB):</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleCreate} disabled={!isAuthenticated} style={btnStyle}>1. createProfile</button>
          <button onClick={handleGet} disabled={!isAuthenticated} style={btnStyle}>2. getProfile</button>
          <button onClick={handleUpdate} disabled={!isAuthenticated} style={btnStyle}>3. updateProfile</button>
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>AppContext methods:</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleSaveProfile} disabled={!isAuthenticated} style={btnStyle}>4. saveProfile</button>
          <button onClick={handleClearProfile} style={btnStyle}>5. clearProfile</button>
          <button onClick={handleShowState} style={btnStyle}>6. Show State</button>
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>mealPlanService (direct DB):</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleSaveMealPlanDB} disabled={!isAuthenticated} style={btnStyle}>7. saveMealPlan (manual)</button>
          <button onClick={handleSaveMealPlanAuto} disabled={!isAuthenticated} style={btnStyle}>8. saveMealPlan (auto)</button>
          <button onClick={handleGetMealPlanByWeek} disabled={!isAuthenticated} style={btnStyle}>9. getMealPlanByWeek</button>
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>AppContext meal plan:</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleSaveWeeklyPlanCtx} style={btnStyle}>10. saveWeeklyPlan</button>
          <button onClick={handleShowWeeklyPlan} style={btnStyle}>11. Show WeeklyPlan</button>
          <button onClick={handleClearWeeklyPlan} style={btnStyle}>12. Clear WeeklyPlan</button>
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>mealCompletionService (direct DB):</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleSetMealCompletion} disabled={!isAuthenticated} style={btnStyle}>13. Mark Mon Breakfast Done</button>
          <button onClick={handleUnsetMealCompletion} disabled={!isAuthenticated} style={btnStyle}>14. Undo Mon Breakfast</button>
          <button onClick={handleGetMealCompletions} disabled={!isAuthenticated} style={btnStyle}>15. Get All Completions</button>
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>shoppingListService (direct DB):</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleCreateOrGetShoppingList} disabled={!isAuthenticated} style={btnStyle}>16. Create/Get Shopping List</button>
          <button onClick={handleBuildAndSaveShoppingItems} disabled={!isAuthenticated} style={btnStyle}>17. Build + Save Items</button>
          <button onClick={handleGetShoppingListItems} disabled={!isAuthenticated} style={btnStyle}>18. Get Shopping Items</button>
          <button onClick={handleCheckFirstItem} disabled={!isAuthenticated} style={btnStyle}>19. Toggle First Item Checked</button>
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Debug:</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleShowMealPlanId} style={btnStyle}>20. Show mealPlanId</button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Log:</strong>
        <button onClick={() => setLog([])} style={{ ...btnStyle, fontSize: "11px" }}>Clear Log</button>
      </div>
      <div style={{ background: "#111", color: "#0f0", padding: "0.5rem", maxHeight: "250px", overflow: "auto", fontSize: "12px", whiteSpace: "pre-wrap", marginTop: "4px" }}>
        {log.length === 0 && <div style={{ color: "#555" }}>-- no logs yet --</div>}
        {log.map((entry, i) => <div key={i} style={{ borderBottom: "1px solid #222", padding: "2px 0" }}>{entry}</div>)}
      </div>
    </div>);

}

export default TestAuth;