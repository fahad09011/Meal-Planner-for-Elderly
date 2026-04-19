import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/database/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/login.css";

const MIN_PASSWORD_LEN = 8;

function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [canSetPassword, setCanSetPassword] = useState(false);
  const [checking, setChecking] = useState(true);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session?.user) setCanSetPassword(true);
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) setCanSetPassword(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");
    const fields = new FormData(event.target);
    const password = String(fields.get("password") ?? "");
    const confirm = String(fields.get("confirmPassword") ?? "");

    if (password.length < MIN_PASSWORD_LEN) {
      setFormError(
        `Password must be at least ${MIN_PASSWORD_LEN} characters.`,
      );
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match. Please try again.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await updatePassword(password);
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    setFormSuccess("Your password was updated. Taking you to sign in…");
    await supabase.auth.signOut();
    window.setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <div className="loginPage">
      <div className="loginCard loginCard--narrow">
        <div className="loginCardBody loginCardBody--solo">
          <h1 className="loginSubtitle">Choose a new password</h1>
          <p className="loginFormHint">
            Use the link from your email to open this page, then pick a new
            password below.
          </p>

          {checking ? (
            <p className="loginFormHint" aria-live="polite">
              One moment…
            </p>
          ) : null}

          {!checking && !canSetPassword ? (
            <p className="loginFormMessage loginFormMessageError" role="alert">
              This link is invalid or has expired. Request a new reset email
              from the sign-in page.
            </p>
          ) : null}

          {canSetPassword ? (
            <form className="loginForm" onSubmit={handleSubmit} noValidate>
              {formError ? (
                <p className="loginFormMessage loginFormMessageError" role="alert">
                  {formError}
                </p>
              ) : null}
              {formSuccess ? (
                <p className="loginFormMessage loginFormMessageSuccess" role="status">
                  {formSuccess}
                </p>
              ) : null}

              <div className="loginField">
                <label htmlFor="reset-password">New password</label>
                <input
                  id="reset-password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD_LEN}
                  disabled={isSubmitting}
                />
              </div>
              <div className="loginField">
                <label htmlFor="reset-confirm">Confirm new password</label>
                <input
                  id="reset-confirm"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button type="submit" className="loginSubmit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save new password"}
              </button>
            </form>
          ) : null}

          <p className="loginLinks loginLinksRegister">
            <Link to="/login">Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
