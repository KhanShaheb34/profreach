import { z } from "zod";
import {
  ApplicationStatus,
  EmailTemplate,
  HiringStatus,
} from "./types";

export const professorSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  email: z.string(),
  university: z.string(),
  department: z.string(),
  country: z.string(),
  researchAreas: z.array(z.string()),
  recentPapers: z.array(z.string()),
  websiteUrl: z.string(),
  scholarUrl: z.string(),
  hiringStatus: z.nativeEnum(HiringStatus),
  applicationStatus: z.nativeEnum(ApplicationStatus),
  notes: z.string(),
  lastContacted: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const profileSchema = z.object({
  name: z.string(),
  email: z.string(),
  university: z.string(),
  degree: z.string(),
  field: z.string(),
  gpa: z.string(),
  researchInterests: z.array(z.string()),
  skills: z.array(z.string()),
  publications: z.array(z.string()),
  workExperience: z.string(),
  summary: z.string(),
});

const contextMemorySchema = z.object({
  content: z.string(),
});

const chatHistorySchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1),
  professor: professorSchema,
  profile: profileSchema,
  memory: z.array(contextMemorySchema).default([]),
  history: z.array(chatHistorySchema).default([]),
  apiKey: z.string().trim().min(1),
});

export const emailRequestSchema = z.object({
  professor: professorSchema,
  profile: profileSchema,
  template: z.nativeEnum(EmailTemplate),
  memory: z.array(contextMemorySchema).default([]),
  apiKey: z.string().trim().min(1),
});

export const emailResponseSchema = z.object({
  subject: z.string().default(""),
  body: z.string().default(""),
});

export const lookupRequestSchema = z.object({
  query: z.string().trim().min(1),
  apiKey: z.string().trim().min(1),
});

export const lookupResponseSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  university: z.string().default(""),
  department: z.string().default(""),
  country: z.string().default(""),
  researchAreas: z.array(z.string()).default([]),
  recentPapers: z.array(z.string()).default([]),
  websiteUrl: z.string().default(""),
  scholarUrl: z.string().default(""),
  hiringStatus: z.nativeEnum(HiringStatus).catch(HiringStatus.Unknown),
  notes: z.string().default(""),
});

export const memoryRequestSchema = z.object({
  userMessage: z.string().trim().min(1),
  assistantMessage: z.string().trim().min(1),
  professorName: z.string().trim().min(1),
  apiKey: z.string().trim().optional(),
});

export const memoryResponseSchema = z.array(z.string().trim()).default([]);

const resumeStringField = z.preprocess(
  (value) => (value == null ? "" : value),
  z.string(),
).catch("").default("");

const resumeStringArrayField = z.preprocess(
  (value) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [],
  z.array(z.string()),
).default([]);

export const resumeResponseSchema = z.object({
  name: resumeStringField,
  email: resumeStringField,
  university: resumeStringField,
  degree: resumeStringField,
  field: resumeStringField,
  gpa: resumeStringField,
  researchInterests: resumeStringArrayField,
  skills: resumeStringArrayField,
  publications: resumeStringArrayField,
  workExperience: resumeStringField,
  summary: resumeStringField,
});
