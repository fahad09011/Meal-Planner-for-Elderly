import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import { BiCalendar, BiLineChart, BiBasket } from "react-icons/bi";
import { FaLeaf } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { APP_ROLES, APP_ROLE_SIGNUP_OPTIONS } from "../constants/appRoles";

const FEATURES = [
{
  icon: BiCalendar,
  title: "Weekly meal planner",
  text: "Plan all 7 days — breakfast, lunch and dinner"
},
{
  icon: BiLineChart,
  title: "Nutrition tracking",
  text: "Low-sugar and low-sodium meal options"
},
{
  icon: BiBasket,
  title: "Shopping list",
  text: "Auto-generated from your meal plan"
}];


const MIN_PASSWORD_LEN = 8;

function LogoMark() {
  return (
    <span className="loginHeroLogoMark" aria-hidden="true">
      <FaLeaf className="loginHeroLogoLeaf" />
      <span className="loginHeroLogoPlus">+</span>
    </span>);

}

function LoginForm() {
  const navigate = useNavigate();
  const { signIn, signUp, sendPasswordResetEmail } = useAuth();
  const [authMode, setAuthMode] = useState("signin");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpAppRole, setSignUpAppRole] = useState(APP_ROLES.elderly);

  function switchMode(mode) {
    setAuthMode(mode);
    setFormError("");
    setFormSuccess("");
    if (mode === "signup") {
      setSignUpAppRole(APP_ROLES.elderly);
    }
  }

  async function handleForgotPassword(event) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");
    const fields = new FormData(event.target);
    const email = String(fields.get("email") ?? "").trim();
    if (!email) {
      setFormError("Please enter your email address.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await sendPasswordResetEmail(email);
    setIsSubmitting(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setFormSuccess(
      "If an account exists for that email, you will get a message with a link to reset your password."
    );
    event.target.reset();
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");
    const fields = new FormData(event.target);
    const email = String(fields.get("email") ?? "").trim();
    const password = String(fields.get("password") ?? "");

    if (!email || !password) {
      setFormError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    navigate("/home");
  }

  async function handleSignUp(event) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");
    const fields = new FormData(event.target);
    const fullName = String(fields.get("fullName") ?? "").trim();
    const email = String(fields.get("email") ?? "").trim();
    const password = String(fields.get("password") ?? "");
    const confirm = String(fields.get("confirmPassword") ?? "");

    if (!email || !password) {
      setFormError("Please enter your email and a password.");
      return;
    }
    if (password.length < MIN_PASSWORD_LEN) {
      setFormError(`Password must be at least ${MIN_PASSWORD_LEN} characters.`);
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match. Please check and try again.");
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await signUp(email, password, {
      full_name: fullName || undefined,
      app_role: signUpAppRole
    });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    if (data.user && !data.session) {
      setFormSuccess(
        "Account created. If email confirmation is turned on, check your inbox to finish signing up."
      );
      event.target.reset();
      return;
    }

    navigate("/home");
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <aside className="loginHero" aria-labelledby="login-hero-heading">
          <div className="loginHeroGlow" aria-hidden="true" />
          <div className="loginHeroInner">
            <div className="loginHeroBrand loginHeroReveal" style={{ "--d": "0ms" }}>
              <div className="loginHeroLogoSquircle">
                <LogoMark />
              </div>
              <p className="loginHeroBrandText">
                <span className="loginHeroBrandStrong">Meal</span>
                <span className="loginHeroBrandMuted">Care</span>
              </p>
            </div>

            <h1 id="login-hero-heading" className="loginHeroTitle loginHeroReveal" style={{ "--d": "80ms" }}>
              Healthy eating,
              <br />
              made simple
            </h1>

            <p className="loginHeroDesc loginHeroReveal" style={{ "--d": "160ms" }}>
              Designed for older adults in Ireland — plan your meals, track nutrition, and shop with confidence.
            </p>

            <ul className="loginHeroFeatures" role="list">
              {FEATURES.map(({ icon: Icon, title, text }, i) =>
              <li
                key={title}
                className="loginHeroFeature loginHeroReveal"
                style={{ "--d": `${240 + i * 70}ms` }}>
                
                  <span className="loginHeroFeatureIcon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="loginHeroFeatureText">
                    <span className="loginHeroFeatureTitle">{title}</span>
                    <span className="loginHeroFeatureSub">{text}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </aside>

        <div className="loginCardBody">
          {authMode === "forgot" ? null :
          <div className="loginAuthTabs" role="tablist" aria-label="Sign in or create account">
              <button
              type="button"
              role="tab"
              id="tab-signin"
              aria-selected={authMode === "signin"}
              aria-controls="panel-auth"
              className={`loginAuthTab ${authMode === "signin" ? "loginAuthTabActive" : ""}`}
              onClick={() => switchMode("signin")}>
              
                Sign in
              </button>
              <button
              type="button"
              role="tab"
              id="tab-signup"
              aria-selected={authMode === "signup"}
              aria-controls="panel-auth"
              className={`loginAuthTab ${authMode === "signup" ? "loginAuthTabActive" : ""}`}
              onClick={() => switchMode("signup")}>
              
                Create account
              </button>
            </div>
          }

          <div
            id="panel-auth"
            role="tabpanel"
            aria-labelledby={
            authMode === "signin" ?
            "tab-signin" :
            authMode === "signup" ?
            "tab-signup" :
            "forgot-heading"
            }>
            
            {authMode === "forgot" ?
            <>
                <h2 id="forgot-heading" className="loginSubtitle">
                  Forgot password
                </h2>
                <p className="loginFormHint">
                  Enter your email. We will send you a link to choose a new password.
                </p>
                <form className="loginForm" onSubmit={handleForgotPassword} noValidate>
                  {formError ?
                <p className="loginFormMessage loginFormMessageError" role="alert">
                      {formError}
                    </p> :
                null}
                  {formSuccess ?
                <p className="loginFormMessage loginFormMessageSuccess" role="status">
                      {formSuccess}
                    </p> :
                null}
                  <div className="loginField">
                    <label htmlFor="forgot-email">Email address</label>
                    <input
                    id="forgot-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting} />
                  
                  </div>
                  <button type="submit" className="loginSubmit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending…" : "Send reset link"}
                  </button>
                </form>
                <p className="loginLinks loginLinksRegister">
                  <button type="button" className="loginLinkButton" onClick={() => switchMode("signin")}>
                    Back to sign in
                  </button>
                </p>
              </> :
            authMode === "signin" ?
            <>
                <h2 className="loginSubtitle">Welcome back</h2>
                <p className="loginFormHint">Sign in with the email you used to register.</p>

                <form id="login-signin-form" name="signIn" className="loginForm" onSubmit={handleSignIn} noValidate>
                  {formError ?
                <p className="loginFormMessage loginFormMessageError" role="alert">
                      {formError}
                    </p> :
                null}
                  {formSuccess ?
                <p className="loginFormMessage loginFormMessageSuccess" role="status">
                      {formSuccess}
                    </p> :
                null}

                  <div className="loginField">
                    <label htmlFor="signin-email">Email address</label>
                    <input
                    id="signin-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting} />
                  
                  </div>
                  <div className="loginField">
                    <label htmlFor="signin-password">Password</label>
                    <input
                    id="signin-password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting} />
                  
                  </div>
                  <button type="submit" className="loginSubmit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in…" : "Sign in"}
                  </button>
                </form>

                <p className="loginLinks">
                  <button
                  type="button"
                  className="loginLinkButton"
                  onClick={() => switchMode("forgot")}>
                  
                    Forgot password?
                  </button>
                </p>
                <p className="loginLinks loginLinksRegister">
                  New to MealCare?{" "}
                  <button type="button" className="loginLinkButton" onClick={() => switchMode("signup")}>
                    Create an account
                  </button>
                </p>
              </> :
            authMode === "signup" ?
            <>
                <h2 className="loginSubtitle">Create your account</h2>
                <p className="loginFormHint">
                  Enter your details below. You can add more in your profile later.
                </p>

                <form id="login-signup-form" name="signUp" className="loginForm" onSubmit={handleSignUp} noValidate>
                  {formError ?
                <p className="loginFormMessage loginFormMessageError" role="alert">
                      {formError}
                    </p> :
                null}
                  {formSuccess ?
                <p className="loginFormMessage loginFormMessageSuccess" role="status">
                      {formSuccess}
                    </p> :
                null}

                  <div className="loginField">
                    <label htmlFor="signup-name">Your name (optional)</label>
                    <input
                    id="signup-name"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    placeholder="e.g. Mary O'Brien"
                    disabled={isSubmitting} />
                  
                  </div>
                  <fieldset className="loginRoleFieldset">
                    <legend className="loginRoleLegend">How will you use MealCare?</legend>
                    <p className="loginFieldHint loginRoleLegendHint">
                      You can change this later in your profile.
                    </p>
                    <div className="loginRoleList" role="radiogroup" aria-label="Account type">
                      {APP_ROLE_SIGNUP_OPTIONS.map((opt) =>
                    <label key={opt.value} className="loginRoleCard">
                          <input
                        id={`signup-app-role-${opt.value}`}
                        type="radio"
                        name="appRole"
                        value={opt.value}
                        checked={signUpAppRole === opt.value}
                        onChange={() => setSignUpAppRole(opt.value)}
                        disabled={isSubmitting} />
                      
                          <span className="loginRoleCardBody">
                            <span className="loginRoleCardTitle">{opt.label}</span>
                            <span className="loginRoleCardHint">{opt.hint}</span>
                          </span>
                        </label>
                    )}
                    </div>
                  </fieldset>
                  <div className="loginField">
                    <label htmlFor="signup-email">Email address</label>
                    <input
                    id="signup-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting} />
                  
                  </div>
                  <div className="loginField">
                    <label htmlFor="signup-password">Password</label>
                    <input
                    id="signup-password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={MIN_PASSWORD_LEN}
                    aria-describedby="signup-password-hint"
                    disabled={isSubmitting} />
                  
                    <span id="signup-password-hint" className="loginFieldHint">
                      At least {MIN_PASSWORD_LEN} characters
                    </span>
                  </div>
                  <div className="loginField">
                    <label htmlFor="signup-confirm">Confirm password</label>
                    <input
                    id="signup-confirm"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    disabled={isSubmitting} />
                  
                  </div>
                  <button type="submit" className="loginSubmit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account…" : "Create account"}
                  </button>
                </form>

                <p className="loginLinks loginLinksRegister">
                  Already have an account?{" "}
                  <button type="button" className="loginLinkButton" onClick={() => switchMode("signin")}>
                    Sign in
                  </button>
                </p>
              </> :
            null}
          </div>

          <div className="loginFooterLinks">
            <Link to="/terms">Terms of use</Link>
          </div>
        </div>
      </div>
    </div>);

}

export default LoginForm;