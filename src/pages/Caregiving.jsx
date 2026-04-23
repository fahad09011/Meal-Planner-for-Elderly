import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../hooks/AppContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import "../assets/styles/caregiving.css";

function Caregiving() {
  const { user, authLoading } = useAuth();
  const {
    careRecipients,
    careLinksLoaded,
    addCareRecipientByUserId,
    removeCareRecipientByLinkId,
    canActAsCaregiver
  } = useContext(AppContext);
  const [elderlyIdInput, setElderlyIdInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleAdd(event) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!user) return;
    setBusy(true);
    const result = await addCareRecipientByUserId(elderlyIdInput);
    setBusy(false);
    if (result.success) {
      setMessage("Care recipient added. Their meal plan and shopping data will load when you select them above.");
      setElderlyIdInput("");
    } else {
      const errorMessage =
      result.error?.message ||
      result.error?.details ||
      "Could not add this user. They need an account and a saved profile first.";
      setError(errorMessage);
    }
  }

  async function handleRemove(linkId) {
    setError(null);
    setMessage(null);
    setBusy(true);
    const result = await removeCareRecipientByLinkId(linkId);
    setBusy(false);
    if (!result.success) {
      setError(result.error?.message || "Could not remove link.");
    } else {
      setMessage("Link removed.");
    }
  }

  if (authLoading) {
    return (
      <div className="caregiving-page">
        <p>Loading…</p>
      </div>);

  }

  if (!user) {
    return (
      <div className="caregiving-page">
        <h1>Caregiving</h1>
        <p>
          <Link to="/login">Sign in</Link> to manage care recipients.
        </p>
      </div>);

  }

  if (!canActAsCaregiver) {
    return (
      <div className="caregiving-page">
        <h1>Caregiving</h1>
        <p className="caregiving-lede">
          This area is only for accounts set as <strong>caregiver</strong> or <strong>both</strong>.
          Open <Link to="/profile">Profile</Link>, choose that account type, save your profile, then
          come back here.
        </p>
      </div>);

  }

  return (
    <div className="caregiving-page">
      <h1>Caregiving</h1>
      <p className="caregiving-lede">
        To link to someone you support, they open MealCare, go to their{" "}
        <strong>Profile</strong> page, and share the <strong>user ID</strong> shown there with you. They
        need their own MealCare account and a saved profile before you can add them.
      </p>
      <p className="caregiving-hint">
        If you <strong>just signed up as a caregiver</strong>, go to <Link to="/profile">Profile</Link>,
        complete every required field, and <strong>save</strong> once. Then you can add people you
        support here.
      </p>

      <div className="caregiving-card">
        <h2>Add care recipient</h2>
        <form id="caregiving-add-recipient-form" name="addCareRecipient" onSubmit={handleAdd}>
          <div className="caregiving-form-row">
            <label className="visually-hidden" htmlFor="care-elderly-id">
              Care recipient's user ID from their Profile page
            </label>
            <input
              id="care-elderly-id"
              name="elderlyUserId"
              className="caregiving-input"
              type="text"
              placeholder="Paste the user ID from their Profile page"
              value={elderlyIdInput}
              onChange={(ev) => setElderlyIdInput(ev.target.value)}
              autoComplete="off"
              spellCheck={false} />
            
            <Button type="submit" className="button" disabled={busy || !elderlyIdInput.trim()}>
              {busy ? "Adding…" : "Add"}
            </Button>
          </div>
          <p className="caregiving-hint">
            It must match <strong>exactly</strong> what they see on their Profile (same letters and
            numbers). A typo or a duplicate will show an error below.
          </p>
        </form>
        {error ? <p className="caregiving-error">{error}</p> : null}
        {message ? <p className="caregiving-success">{message}</p> : null}
      </div>

      <div className="caregiving-card">
        <h2>Your care recipients</h2>
        {!careLinksLoaded ?
        <p>Loading list…</p> :
        careRecipients.length === 0 ?
        <p>No one linked yet. Add someone’s user ID above.</p> :

        <ul className="caregiving-list">
            {careRecipients.map((row) =>
          <li key={row.id}>
                <span className="caregiving-id">
                  {row.elderly_name?.trim() || "Unnamed recipient"}
                  <small style={{ display: "block", opacity: 0.75 }}>
                    {row.elderly_user_id}
                  </small>
                </span>
                <Button
              type="button"
              className="inActive button"
              disabled={busy}
              onClick={() => handleRemove(row.id)}>
              
                  Remove
                </Button>
              </li>
          )}
          </ul>
        }
      </div>

      <p className="caregiving-hint">
        Use the navbar dropdown <strong>Viewing</strong> to switch between your own data and a care
        recipient&apos;s meal plan and shopping list.
      </p>
    </div>);

}

export default Caregiving;