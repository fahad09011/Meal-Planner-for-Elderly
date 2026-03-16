import { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, createProfile, updateProfile } from "../services/profileService";
import { AppContext } from "../context/AppContext";

function TestAuth() {
  const { user, authLoading, isAuthenticated, signOut, signIn } = useAuth();
  const { saveProfile, clearProfile, profileData, hasProfile } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState([]);

  const addLog = (label, data) => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${label} ${JSON.stringify(data, null, 2)}`;
    console.log(label, data);
    setLog((prev) => [...prev, entry]);
  };

  // ── Auth ──
  const handleSignIn = async () => {
    if (!email || !password) { addLog("ERROR:", "Enter email and password"); return; }
    const { data, error } = await signIn(email, password);
    if (error) addLog("Sign-in FAILED:", error.message);
    else addLog("Sign-in OK:", data.user.email);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) addLog("Sign-out FAILED:", error.message);
    else addLog("Sign-out OK", {});
  };

  // ── profileService (direct DB calls) ──
  const handleCreate = async () => {
    if (!user) { addLog("ERROR:", "Sign in first"); return; }
    const testData = {
      ageGroup: "65-74",
      dietary: ["vegetarian"],
      allergies: ["gluten"],
      healthConditions: ["diabetes", "hypertension"],
      budget: "medium",
    };
    addLog("Creating profile...", testData);
    const result = await createProfile(user.id, testData);
    addLog("createProfile:", result);
  };

  const handleGet = async () => {
    if (!user) { addLog("ERROR:", "Sign in first"); return; }
    const result = await getProfile(user.id);
    addLog("getProfile:", result);
  };

  const handleUpdate = async () => {
    if (!user) { addLog("ERROR:", "Sign in first"); return; }
    const updatedData = {
      ageGroup: "75-84",
      dietary: ["vegan"],
      allergies: ["dairy", "peanut"],
      healthConditions: ["heartDisease"],
      budget: "low",
    };
    addLog("Updating profile...", updatedData);
    const result = await updateProfile(user.id, updatedData);
    addLog("updateProfile:", result);
  };

  // ── AppContext methods ──
  const handleSaveProfile = async () => {
    if (!user) { addLog("ERROR:", "Sign in first"); return; }
    const contextData = {
      ageGroup: "65-74",
      dietary: ["pescetarian"],
      allergies: ["soy"],
      healthConditions: ["highCholesterol"],
      budget: "flexible",
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

  useEffect(() => {
    if (!authLoading) {
      addLog("Auth ready. User:", user ? user.email : "none");
    }
  }, [authLoading]);

  if (authLoading) return <div>Checking auth...</div>;

  const btnStyle = { padding: "6px 12px", cursor: "pointer", fontSize: "13px" };

  return (
    <div style={{ padding: "1rem", border: "2px dashed red", margin: "1rem", fontFamily: "monospace", fontSize: "13px" }}>
      <h3 style={{ margin: "0 0 0.5rem" }}>Test Panel</h3>

      {/* Auth section */}
      <div style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" style={{ padding: "4px" }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" style={{ padding: "4px" }} />
        <button onClick={handleSignIn} style={btnStyle}>Sign In</button>
        <button onClick={handleSignOut} style={btnStyle}>Sign Out</button>
        <span style={{ color: isAuthenticated ? "green" : "red" }}>
          {isAuthenticated ? `✓ ${user.email}` : "✗ Not signed in"}
        </span>
      </div>

      {/* DB service buttons */}
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>profileService (direct DB):</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleCreate} disabled={!isAuthenticated} style={btnStyle}>1. createProfile</button>
          <button onClick={handleGet} disabled={!isAuthenticated} style={btnStyle}>2. getProfile</button>
          <button onClick={handleUpdate} disabled={!isAuthenticated} style={btnStyle}>3. updateProfile</button>
        </div>
      </div>

      {/* Context buttons */}
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>AppContext methods:</strong>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleSaveProfile} disabled={!isAuthenticated} style={btnStyle}>4. saveProfile</button>
          <button onClick={handleClearProfile} style={btnStyle}>5. clearProfile</button>
          <button onClick={handleShowState} style={btnStyle}>6. Show State</button>
        </div>
      </div>

      {/* Log */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Log:</strong>
        <button onClick={() => setLog([])} style={{ ...btnStyle, fontSize: "11px" }}>Clear Log</button>
      </div>
      <div style={{ background: "#111", color: "#0f0", padding: "0.5rem", maxHeight: "250px", overflow: "auto", fontSize: "12px", whiteSpace: "pre-wrap", marginTop: "4px" }}>
        {log.length === 0 && <div style={{ color: "#555" }}>-- no logs yet --</div>}
        {log.map((entry, i) => <div key={i} style={{ borderBottom: "1px solid #222", padding: "2px 0" }}>{entry}</div>)}
      </div>
    </div>
  );
}

export default TestAuth;
