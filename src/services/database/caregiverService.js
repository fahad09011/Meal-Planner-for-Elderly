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
  const { data, error } = await supabase.
  from("caregiver_links").
  select("id, elderly_user_id, created_at").
  eq("caregiver_user_id", caregiverUserId).
  order("created_at", { ascending: false });

  if (error) {
    return { success: false, error, data: [] };
  }
  return { success: true, data: data ?? [] };
}

export async function getRecipientNamesByUserIds(userIds) {
  const ids = Array.isArray(userIds) ? [...new Set(userIds.filter(Boolean))] : [];
  if (ids.length === 0) {
    return { success: true, data: {} };
  }

  const idSet = new Set(ids.map((id) => String(id)));
  const map = {};

  const { data: rpcRows, error: rpcError } = await supabase.rpc(
    "get_care_recipient_display_names_for_caregiver"
  );
  if (!rpcError && Array.isArray(rpcRows)) {
    rpcRows.forEach((row) => {
      const id = row?.elderly_user_id != null ? String(row.elderly_user_id) : "";
      if (!id || !idSet.has(id)) return;
      const name =
      typeof row?.display_name === "string" ? row.display_name.trim() : "";
      if (name) map[id] = name;
    });
  }

  const missingForProfile = ids.map(String).filter((id) => !map[id]);
  if (missingForProfile.length === 0) {
    return { success: true, data: map };
  }

  const { data, error } = await supabase.
  from("profiles").
  select("user_id, full_name").
  in("user_id", missingForProfile);

  if (error) {
    return { success: true, data: map };
  }

  (data ?? []).forEach((row) => {
    const id = row?.user_id != null ? String(row.user_id) : "";
    if (!id || !idSet.has(id)) return;
    const name = typeof row?.full_name === "string" ? row.full_name.trim() : "";
    if (name && !map[id]) map[id] = name;
  });
  return { success: true, data: map };
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

  const { data, error } = await supabase.rpc("create_caregiver_link", {
    p_elderly_user_id: elderly
  });

  if (error) {
    const msg = String(error.message ?? "");
    const code = error.code;
    if (code === "23505" || msg.includes("duplicate") || msg.includes("unique") || msg.includes("already_linked")) {
      return {
        success: false,
        error: new Error("That person is already linked to your account.")
      };
    }
    if (msg.includes("elderly_has_no_profile")) {
      return {
        success: false,
        error: new Error(
          "That user ID has no saved profile yet. They must sign in and complete Profile first."
        )
      };
    }
    if (msg.includes("not_a_caregiver_account") || code === "42501") {
      return {
        success: false,
        error: new Error(
          "Only accounts registered as caregiver or both can add recipients. That is chosen when you create your account. Sign out and back in if your role was updated."
        )
      };
    }
    if (msg.includes("invalid_elderly_id")) {
      return {
        success: false,
        error: new Error("You cannot add your own account as a care recipient.")
      };
    }
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
    return { success: false, error };
  }
  return { success: true, data: null };
}