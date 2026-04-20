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
        Add someone you support using the <strong>user ID</strong> from their Profile page (Supabase
        account id). They must create their own account and save a profile before you can link them.
      </p>
      <p className="caregiving-hint">
        If you just registered as a caregiver, <strong>save your Profile</strong> (all required fields)
        once first so your account type is stored; then you can add links here.
      </p>

      <div className="caregiving-card">
        <h2>Add care recipient</h2>
        <form id="caregiving-add-recipient-form" name="addCareRecipient" onSubmit={handleAdd}>
          <div className="caregiving-form-row">
            <label className="visually-hidden" htmlFor="care-elderly-id">
              Elderly user ID
            </label>
            <input
              id="care-elderly-id"
              name="elderlyUserId"
              className="caregiving-input"
              type="text"
              placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              value={elderlyIdInput}
              onChange={(ev) => setElderlyIdInput(ev.target.value)}
              autoComplete="off"
              spellCheck={false} />
            
            <Button type="submit" className="button" disabled={busy || !elderlyIdInput.trim()}>
              {busy ? "Adding…" : "Add"}
            </Button>
          </div>
          <p className="caregiving-hint">
            Use the exact UUID from their app. Wrong or duplicate IDs will show an error below.
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
        <p>No one linked yet. Add a user ID above.</p> :

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