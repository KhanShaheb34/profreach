import { ApplicationStatus, HiringStatus, DocumentCategory, EmailTemplate } from "./types";
import type { Profile } from "./types";

export const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
  [ApplicationStatus.Interested]: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  [ApplicationStatus.Researching]: { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  [ApplicationStatus.Drafting]: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  [ApplicationStatus.Sent]: { bg: "bg-cyan-50 dark:bg-cyan-950", text: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-200 dark:border-cyan-800" },
  [ApplicationStatus.Replied]: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  [ApplicationStatus.Interview]: { bg: "bg-indigo-50 dark:bg-indigo-950", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800" },
  [ApplicationStatus.Accepted]: { bg: "bg-green-50 dark:bg-green-950", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  [ApplicationStatus.Rejected]: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  [ApplicationStatus.Withdrawn]: { bg: "bg-gray-50 dark:bg-gray-950", text: "text-gray-500 dark:text-gray-400", border: "border-gray-200 dark:border-gray-800" },
};

export const HIRING_STATUS_LABELS: Record<HiringStatus, string> = {
  [HiringStatus.Unknown]: "Unknown",
  [HiringStatus.ActivelyHiring]: "Actively Hiring",
  [HiringStatus.MaybeHiring]: "Maybe Hiring",
  [HiringStatus.NotHiring]: "Not Hiring",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Interested]: "Interested",
  [ApplicationStatus.Researching]: "Researching",
  [ApplicationStatus.Drafting]: "Drafting",
  [ApplicationStatus.Sent]: "Sent",
  [ApplicationStatus.Replied]: "Replied",
  [ApplicationStatus.Interview]: "Interview",
  [ApplicationStatus.Accepted]: "Accepted",
  [ApplicationStatus.Rejected]: "Rejected",
  [ApplicationStatus.Withdrawn]: "Withdrawn",
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  [DocumentCategory.Resume]: "Resume",
  [DocumentCategory.CoverLetter]: "Cover Letter",
  [DocumentCategory.SOP]: "Statement of Purpose",
  [DocumentCategory.Transcript]: "Transcript",
  [DocumentCategory.WritingSample]: "Writing Sample",
  [DocumentCategory.Other]: "Other",
};

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplate, string> = {
  [EmailTemplate.ColdOutreach]: "Cold Outreach",
  [EmailTemplate.FollowUp]: "Follow Up",
  [EmailTemplate.ThankYou]: "Thank You",
  [EmailTemplate.ApplicationInquiry]: "Application Inquiry",
  [EmailTemplate.Custom]: "Custom",
};

export const DEFAULT_PROFILE: Profile = {
  name: "",
  email: "",
  university: "",
  degree: "",
  field: "",
  gpa: "",
  researchInterests: [],
  skills: [],
  publications: [],
  workExperience: "",
  summary: "",
};

export const SORT_OPTIONS = [
  { value: "updatedAt-desc", label: "Recently Updated" },
  { value: "createdAt-desc", label: "Recently Added" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "university-asc", label: "University (A-Z)" },
] as const;

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
