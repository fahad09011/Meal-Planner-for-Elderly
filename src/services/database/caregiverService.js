import { supabase } from "./supabaseClient";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value) {
  return typeof value === "string" && UUID_RE.test(value.trim());
}

export async function listOutgoingCaregiverLinks(caregiverUserId) {
  if (!caregiverUserId) {
    return { success: false, error: new Error("Caregiver user id is required"), data: [] };
  }
  const { data, error } = await supabase
    .from("caregiver_links")
    .select("id, elderly_user_id, created_at")
    .eq("caregiver_user_id", caregiverUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listOutgoingCaregiverLinks:", error);
    return { success: false, error, data: [] };
  }
  return { success: true, data: data ?? [] };
}

export async function createCaregiverLink(caregiverUserId, elderlyUserId) {
  if (!caregiverUserId) {
    return { success: false, error: new Error("You must be signed in.") };
  }
  const elderly = String(elderlyUserId ?? "").trim();
  if (!isValidUuid(elderly)) {
    return { success: false, error: new Error("Enter a valid user ID (UUID from Profile).") };
  }
  if (elderly.toLowerCase() === String(caregiverUserId).toLowerCase()) {
    return { success: false, error: new Error("You cannot add your own account as a care recipient.") };
  }

  // Uses SECURITY DEFINER RPC so RLS can verify the elderly user has a profile row
  // (direct INSERT + EXISTS on profiles fails: caregivers cannot read others' profiles until linked).
  const { data, error } = await supabase.rpc("create_caregiver_link", {
    p_elderly_user_id: elderly,
  });

  if (error) {
    const msg = String(error.message ?? "");
    const code = error.code;
    if (code === "23505" || msg.includes("duplicate") || msg.includes("unique") || msg.includes("already_linked")) {
      return {
        success: false,
        error: new Error("That person is already linked to your account."),
      };
    }
    if (msg.includes("elderly_has_no_profile")) {
      return {
        success: false,
        error: new Error(
          "That user ID has no saved profile yet. They must sign in and complete Profile first.",
        ),
      };
    }
    if (msg.includes("not_a_caregiver_account") || code === "42501") {
      return {
        success: false,
        error: new Error(
          "Only accounts registered as caregiver or both can add recipients. That is chosen when you create your account. Sign out and back in if your role was updated.",
        ),
      };
    }
    if (msg.includes("invalid_elderly_id")) {
      return {
        success: false,
        error: new Error("You cannot add your own account as a care recipient."),
      };
    }
    console.error("createCaregiverLink:", error);
    return { success: false, error };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.id) {
    return { success: false, error: new Error("Link was not created. Please try again.") };
  }
  return { success: true, data: row };
}

export async function deleteCaregiverLink(linkId) {
  if (!linkId) {
    return { success: false, error: new Error("Link id is required") };
  }
  const { error } = await supabase.from("caregiver_links").delete().eq("id", linkId);
  if (error) {
    console.error("deleteCaregiverLink:", error);
    return { success: false, error };
  }
  return { success: true, data: null };
}
