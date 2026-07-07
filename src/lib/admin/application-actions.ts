import type { ApplicationStatus } from "@/types/application.types";

interface ApplicationStatusAction {
  status: ApplicationStatus;
  label: string;
  variant: "primary" | "outline" | "danger";
}

/**
 * The application status transitions, shared by the detail page's action
 * cluster and the table's per-row menu so the two can never drift.
 */
export const APPLICATION_STATUS_ACTIONS: ApplicationStatusAction[] = [
  { status: "RECRUITED", label: "Admit", variant: "primary" },
  { status: "WAITLISTED", label: "Waitlist", variant: "outline" },
  { status: "REJECTED", label: "Reject", variant: "danger" },
  { status: "WITHDRAWN", label: "Withdraw", variant: "outline" },
];

/**
 * The transitions the current user may take. Rejecting reverses payments and
 * withdraws the student — admin-and-above on the backend, so staff never see it.
 */
export const applicationStatusActionsFor = (isAdmin: boolean) =>
  isAdmin
    ? APPLICATION_STATUS_ACTIONS
    : APPLICATION_STATUS_ACTIONS.filter((a) => a.status !== "REJECTED");

/** Confirm-dialog copy for a status transition. */
export const applicationStatusCopy = (status: string): string =>
  status === "RECRUITED"
    ? "This admits the applicant and creates their student record."
    : status === "REJECTED"
      ? "This rejects the applicant — any admission is reversed and paid fees refunded."
      : `This sets the application to ${status.toLowerCase()}.`;

export const APPLICATION_DELETE_COPY =
  "This removes the application. Applicants who have paid or been admitted can't be deleted.";
