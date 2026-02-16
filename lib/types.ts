export enum ApplicationStatus {
  Interested = "interested",
  Researching = "researching",
  Drafting = "drafting",
  Sent = "sent",
  Replied = "replied",
  Interview = "interview",
  Accepted = "accepted",
  Rejected = "rejected",
  Withdrawn = "withdrawn",
}

export enum HiringStatus {
  Unknown = "unknown",
  ActivelyHiring = "actively_hiring",
  MaybeHiring = "maybe_hiring",
  NotHiring = "not_hiring",
}

export enum DocumentCategory {
  Resume = "resume",
  CoverLetter = "cover_letter",
  SOP = "sop",
  Transcript = "transcript",
  WritingSample = "writing_sample",
  Other = "other",
}

export enum EmailTemplate {
  ColdOutreach = "cold_outreach",
  FollowUp = "follow_up",
  ThankYou = "thank_you",
  ApplicationInquiry = "application_inquiry",
  Custom = "custom",
}

export interface Professor {
  id: string;
  name: string;
  email: string;
  university: string;
  department: string;
  country: string;
  researchAreas: string[];
  recentPapers: string[];
  websiteUrl: string;
  scholarUrl: string;
  hiringStatus: HiringStatus;
  applicationStatus: ApplicationStatus;
  notes: string;
  lastContacted: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  name: string;
  email: string;
  university: string;
  degree: string;
  field: string;
  gpa: string;
  researchInterests: string[];
  skills: string[];
  publications: string[];
  workExperience: string;
  summary: string;
}

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  content: string; // base64 for binary, text for text
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface MemoryItem {
  id: string;
  content: string;
  source: string; // e.g. "chat:prof_id" or "manual" or "resume"
  tags: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  professorId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface EmailDraft {
  id: string;
  professorId: string;
  template: EmailTemplate;
  subject: string;
  body: string;
  createdAt: string;
}

export interface AppData {
  professors: Professor[];
  profile: Profile;
  documents: Document[];
  memory: MemoryItem[];
  chats: ChatMessage[];
  drafts: EmailDraft[];
}
