import { getAuthInfo } from "./auth";

export const fetchInvitations = async () => {
  const { token, userId: accountId } = getAuthInfo();
  const response = await fetch(
    `${
      import.meta.env.VITE_BASE_URL
    }/accountant/getall-invitation/${accountId}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch invitations");
  }

  const data = await response.json();
  return data.map((invitation) => ({
    id: invitation.id,
    invitationId: `INV${String(invitation.id).padStart(3, "0")}`,
    userId: invitation.userid,
    status: invitation.status,
    date: new Date(invitation.created_at).toISOString(),
  }));
};

export const handleApproveInvitation = async (invitationId, invitations) => {
  const { token, userId: accountId } = getAuthInfo();

  // Get the UserId
  const invitation = invitations.find((inv) => inv.id === invitationId);
  if (!invitation) {
    throw new Error("Invitation not found");
  }

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/accountant/update-status`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: invitation.userId,
        status: "approved",
        accountId: accountId,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to approve invitation");
  }

  return true;
};

export const handleRejectInvitation = async (invitationId, invitations) => {
  const { token, userId: accountId } = getAuthInfo();
  // etting the userId
  const invitation = invitations.find((inv) => inv.id === invitationId);
  if (!invitation) {
    throw new Error("Invitation not found");
  }

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/accountant/update-status`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: invitation.userId,
        status: "rejected",
        accountId: accountId,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to reject invitation");
  }

  return true;
};

export const fetchAndUpdatePendingInvitationsCount = async (
  setPendingInvitationsCount
) => {
  try {
    const data = await fetchInvitations();
    const pendingCount = data.filter((inv) => inv.status === "pending").length;
    setPendingInvitationsCount(pendingCount);
  } catch (err) {
    console.error("Error fetching invitations:", err);
  }
};
