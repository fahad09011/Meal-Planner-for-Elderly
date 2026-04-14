import { useEffect, useRef } from "react";

/**
 * Full profile help in one place — keeps the form scannable.
 */
export default function ProfileHowItWorksModal({ show, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  useEffect(() => {
    if (show && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div
        className="profile-help-backdrop"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        id="profile-how-it-works-dialog"
        className="modal show d-block profile-help-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-how-it-works-title"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable profile-help-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="profile-how-it-works-title" className="modal-title h5 mb-0">
                How your profile works
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body profile-help-body">
              <section className="profile-help-section" aria-labelledby="help-overview">
                <h3 id="help-overview" className="profile-help-heading">
                  Big picture
                </h3>
                <p>
                  MealCare uses your answers to find recipes and build shopping lists that fit you. Age,
                  weight, height, gender, and activity level estimate daily energy (BMR, then TDEE with
                  activity). Diet, allergies, health conditions, and budget add extra filters on top.
                </p>
                <p className="profile-help-muted">
                  This app does not replace advice from your doctor or dietitian.
                </p>
              </section>

              <section className="profile-help-section" aria-labelledby="help-body">
                <h3 id="help-body" className="profile-help-heading">
                  Your body &amp; activity
                </h3>
                <p>
                  <strong>Units:</strong> weight in kilograms (kg) and height in centimetres (cm).
                </p>
                <p>
                  <strong>Gender:</strong> used only in the standard Mifflin–St Jeor formula for resting
                  calories (BMR), a common approach in nutrition software.
                </p>
                <p>
                  <strong>Activity level:</strong> each option has a multiplier. We multiply your BMR by
                  that number to estimate calories for a typical day with your usual movement (TDEE).
                </p>
                <p>
                  <strong>Estimated energy cards:</strong> “Resting (BMR)” is at rest; “Daily with
                  activity” is BMR × your chosen activity level. Meal planning then uses about{" "}
                  <strong>one-third</strong> of that daily figure per main meal (breakfast, lunch, or
                  dinner), and applies a stricter per-meal cap if you selected weight management under
                  health conditions. Recipe search and on-device filters both follow those limits.
                </p>
              </section>

              <section className="profile-help-section" aria-labelledby="help-food">
                <h3 id="help-food" className="profile-help-heading">
                  Food preferences
                </h3>
                <p>
                  <strong>Diet</strong> (for example vegetarian or gluten free) steers recipe suggestions
                  toward compatible meals.
                </p>
                <p>
                  <strong>Allergies</strong> are sent to the recipe service as intolerances where
                  supported, to reduce unsuitable results.
                </p>
              </section>

              <section className="profile-help-section" aria-labelledby="help-health">
                <h3 id="help-health" className="profile-help-heading">
                  Health &amp; budget
                </h3>
                <p>
                  Ticking a health condition applies nutrition rules we use when searching and filtering
                  meals (for example limits on sodium or carbs where the recipe data supports it).
                </p>
                <p>
                  <strong>Budget</strong> prefers recipes whose estimated cost per serving matches the
                  level you chose (low, medium, or flexible).
                </p>
              </section>

              <section className="profile-help-section" aria-labelledby="help-care">
                <h3 id="help-care" className="profile-help-heading">
                  User ID &amp; caregivers
                </h3>
                <p>
                  Your User ID is a stable code another person can use on the <strong>Caregiving</strong>{" "}
                  page to link their account as your caregiver, so they can help with meal planning and
                  lists. Only share it with people you trust.
                </p>
              </section>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
