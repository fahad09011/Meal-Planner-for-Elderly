import { Link } from "react-router-dom";
import "../assets/styles/termsOfUse.css";

/**
 * Terms of use for MealCare (student / coursework context).
 * Not legal advice — supervisors may require edits for institutional submission.
 */
function TermsOfUse() {
  return (
    <main className="termsPage" aria-labelledby="terms-title">
      <article className="termsContainer">
        <header className="termsHeader">
          <h1 id="terms-title" className="termsTitle">
            Terms of use
          </h1>
          <p className="termsUpdated">Effective April 2026</p>
        </header>

        <div className="termsBody">
          <h2>Agreement</h2>
          <p>
            By creating an account or using MealCare (“the service”), you agree to these terms. If you
            do not agree, do not use the service.
          </p>

          <h2>What MealCare is</h2>
          <p>
            MealCare is a web application for planning meals, viewing a weekly plan, managing a
            shopping list, and optional caregiver linking. It is provided for convenience and
            learning or demonstration purposes unless otherwise agreed in writing by your
            institution or team.
          </p>

          <h2>Not medical or dietary advice</h2>
          <p>
            The service uses general nutrition and recipe information. It is{" "}
            <strong>not</strong> a substitute for advice from a doctor, dietitian, or other qualified
            professional. You are responsible for decisions about your health and diet.
          </p>

          <h2>Your account</h2>
          <p>
            You must provide accurate sign-up information and keep your password confidential. You are
            responsible for activity under your account. Notify your support contact if you suspect
            unauthorised access.
          </p>

          <h2>Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service in any unlawful way or to harm others;</li>
            <li>Attempt to access data or accounts you are not permitted to use;</li>
            <li>Interfere with or overload the service or its infrastructure;</li>
            <li>Use automated scraping or abuse of third-party APIs connected to the service.</li>
          </ul>

          <h2>Third-party services</h2>
          <p>
            MealCare relies on hosting, authentication, and external data (for example recipe or
            product information). Those providers have their own terms. The service may change or
            become unavailable if third-party terms or APIs change.
          </p>

          <h2>Availability and changes</h2>
          <p>
            The service may be updated, limited, or discontinued without notice, especially for a
            coursework or research deployment. These terms may be updated; continued use after
            changes means you accept the updated terms.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The service is provided “as is” without warranties of any kind to the fullest extent
            permitted by law. We are not liable for any loss or damage arising from your use of the
            service or reliance on its content.
          </p>

          <nav className="termsFooterNav" aria-label="Related pages">
            <Link className="termsBackLink" to="/login">
              ← Back to sign in
            </Link>
          </nav>
        </div>
      </article>
    </main>
  );
}

export default TermsOfUse;
