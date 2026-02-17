import {
  ApplicationStatus,
  DocumentCategory,
  EmailTemplate,
  HiringStatus,
  type Professor,
  type Profile,
  type Document,
  type MemoryItem,
  type ChatMessage,
  type EmailDraft,
  type AppData,
} from "./types";
import { DEFAULT_PROFILE } from "./constants";
import {
  addDocumentToDb,
  deleteDocumentFromDb,
  getAllDocumentsFromDb,
  saveAllDocumentsToDb,
} from "./document-db";

const STORAGE_EVENT = "profreach-storage-change";
const KEYS = {
  professors: "profreach:professors",
  profile: "profreach:profile",
  documents: "profreach:documents",
  memory: "profreach:memory",
  chats: "profreach:chats",
  drafts: "profreach:drafts",
  apiKey: "profreach:gemini-api-key",
} as const;

const VALID_IMPORT_KEYS = [
  "professors",
  "profile",
  "documents",
  "memory",
  "chats",
  "drafts",
] as const;
const APPLICATION_STATUS_VALUES = Object.values(ApplicationStatus);
const HIRING_STATUS_VALUES = Object.values(HiringStatus);
const DOCUMENT_CATEGORY_VALUES = Object.values(DocumentCategory);
const EMAIL_TEMPLATE_VALUES = Object.values(EmailTemplate);
let documentsMigrationPromise: Promise<void> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : fallback;
}

function sanitizeProfessor(value: unknown): Professor | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id).trim();
  const name = asString(value.name).trim();
  if (!id || !name) return null;

  const now = new Date().toISOString();
  return {
    id,
    name,
    email: asString(value.email),
    university: asString(value.university),
    department: asString(value.department),
    country: asString(value.country),
    researchAreas: asStringArray(value.researchAreas),
    recentPapers: asStringArray(value.recentPapers),
    websiteUrl: asString(value.websiteUrl),
    scholarUrl: asString(value.scholarUrl),
    hiringStatus: asEnum(
      value.hiringStatus,
      HIRING_STATUS_VALUES,
      HiringStatus.Unknown,
    ),
    applicationStatus: asEnum(
      value.applicationStatus,
      APPLICATION_STATUS_VALUES,
      ApplicationStatus.Interested,
    ),
    notes: asString(value.notes),
    lastContacted:
      typeof value.lastContacted === "string" ? value.lastContacted : null,
    createdAt: asString(value.createdAt, now),
    updatedAt: asString(value.updatedAt, now),
  };
}

function sanitizeProfile(value: unknown): Profile {
  if (!isRecord(value)) return DEFAULT_PROFILE;
  return {
    name: asString(value.name),
    email: asString(value.email),
    university: asString(value.university),
    degree: asString(value.degree),
    field: asString(value.field),
    gpa: asString(value.gpa),
    researchInterests: asStringArray(value.researchInterests),
    skills: asStringArray(value.skills),
    publications: asStringArray(value.publications),
    workExperience: asString(value.workExperience),
    summary: asString(value.summary),
  };
}

function sanitizeDocument(value: unknown): Document | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id).trim();
  const name = asString(value.name).trim();
  if (!id || !name) return null;

  return {
    id,
    name,
    category: asEnum(
      value.category,
      DOCUMENT_CATEGORY_VALUES,
      DocumentCategory.Other,
    ),
    content: asString(value.content),
    mimeType: asString(value.mimeType),
    size: asNumber(value.size),
    createdAt: asString(value.createdAt, new Date().toISOString()),
  };
}

function sanitizeMemoryItem(value: unknown): MemoryItem | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id).trim();
  const content = asString(value.content).trim();
  if (!id || !content) return null;

  return {
    id,
    content,
    source: asString(value.source, "manual"),
    tags: asStringArray(value.tags),
    createdAt: asString(value.createdAt, new Date().toISOString()),
  };
}

function sanitizeChatMessage(value: unknown): ChatMessage | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id).trim();
  const professorId = asString(value.professorId).trim();
  const content = asString(value.content).trim();
  if (!id || !professorId || !content) return null;

  const role =
    value.role === "assistant"
      ? "assistant"
      : value.role === "user"
        ? "user"
        : null;
  if (!role) return null;

  return {
    id,
    professorId,
    role,
    content,
    createdAt: asString(value.createdAt, new Date().toISOString()),
  };
}

function sanitizeDraft(value: unknown): EmailDraft | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id).trim();
  const professorId = asString(value.professorId).trim();
  if (!id || !professorId) return null;

  return {
    id,
    professorId,
    template: asEnum(
      value.template,
      EMAIL_TEMPLATE_VALUES,
      EmailTemplate.Custom,
    ),
    subject: asString(value.subject),
    body: asString(value.body),
    createdAt: asString(value.createdAt, new Date().toISOString()),
  };
}

function sanitizeImportData(data: unknown): AppData {
  if (!isRecord(data)) {
    throw new Error("Backup file must be a JSON object.");
  }

  const hasKnownKeys = VALID_IMPORT_KEYS.some((key) => key in data);
  if (!hasKnownKeys) {
    throw new Error(
      "Backup file does not contain expected Profreach data keys.",
    );
  }

  return {
    professors: Array.isArray(data.professors)
      ? data.professors
          .map(sanitizeProfessor)
          .filter((item): item is Professor => item !== null)
      : [],
    profile: sanitizeProfile(data.profile),
    documents: Array.isArray(data.documents)
      ? data.documents
          .map(sanitizeDocument)
          .filter((item): item is Document => item !== null)
      : [],
    memory: Array.isArray(data.memory)
      ? data.memory
          .map(sanitizeMemoryItem)
          .filter((item): item is MemoryItem => item !== null)
      : [],
    chats: Array.isArray(data.chats)
      ? data.chats
          .map(sanitizeChatMessage)
          .filter((item): item is ChatMessage => item !== null)
      : [],
    drafts: Array.isArray(data.drafts)
      ? data.drafts
          .map(sanitizeDraft)
          .filter((item): item is EmailDraft => item !== null)
      : [],
  };
}

function emit(key: string) {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  emit(key);
}

async function migrateLegacyDocumentsIfNeeded(): Promise<void> {
  if (typeof window === "undefined") return;
  if (documentsMigrationPromise) return documentsMigrationPromise;

  documentsMigrationPromise = (async () => {
    const legacyDocuments = get<Document[]>(KEYS.documents, []);
    if (legacyDocuments.length > 0) {
      await saveAllDocumentsToDb(legacyDocuments);
    }
    localStorage.removeItem(KEYS.documents);
  })();

  await documentsMigrationPromise;
}

// Professors
export function getProfessors(): Professor[] {
  return get(KEYS.professors, []);
}

export function setProfessors(professors: Professor[]) {
  set(KEYS.professors, professors);
}

export function getProfessor(id: string): Professor | undefined {
  return getProfessors().find((p) => p.id === id);
}

export function addProfessor(professor: Professor) {
  const all = getProfessors();
  all.push(professor);
  setProfessors(all);
}

export function updateProfessor(id: string, updates: Partial<Professor>) {
  const all = getProfessors();
  const idx = all.findIndex((p) => p.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    setProfessors(all);
  }
}

export function deleteProfessor(id: string) {
  setProfessors(getProfessors().filter((p) => p.id !== id));
  // Also clean up related chats and drafts
  setChats(getChats().filter((c) => c.professorId !== id));
  setDrafts(getDrafts().filter((d) => d.professorId !== id));
}

// Profile
export function getProfile(): Profile {
  return get(KEYS.profile, DEFAULT_PROFILE);
}

export function setProfile(profile: Profile) {
  set(KEYS.profile, profile);
}

// Documents (IndexedDB)
export async function getDocuments(): Promise<Document[]> {
  await migrateLegacyDocumentsIfNeeded();
  return getAllDocumentsFromDb();
}

export async function setDocuments(documents: Document[]) {
  await migrateLegacyDocumentsIfNeeded();
  await saveAllDocumentsToDb(documents);
  emit(KEYS.documents);
}

export async function addDocument(doc: Document) {
  await migrateLegacyDocumentsIfNeeded();
  await addDocumentToDb(doc);
  emit(KEYS.documents);
}

export async function deleteDocument(id: string) {
  await migrateLegacyDocumentsIfNeeded();
  await deleteDocumentFromDb(id);
  emit(KEYS.documents);
}

// Memory
export function getMemory(): MemoryItem[] {
  return get(KEYS.memory, []);
}

export function setMemory(memory: MemoryItem[]) {
  set(KEYS.memory, memory);
}

export function addMemory(item: MemoryItem) {
  const all = getMemory();
  all.push(item);
  setMemory(all);
}

export function updateMemory(id: string, updates: Partial<MemoryItem>) {
  const all = getMemory();
  const idx = all.findIndex((m) => m.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setMemory(all);
  }
}

export function deleteMemory(id: string) {
  setMemory(getMemory().filter((m) => m.id !== id));
}

// Chats
export function getChats(): ChatMessage[] {
  return get(KEYS.chats, []);
}

export function setChats(chats: ChatMessage[]) {
  set(KEYS.chats, chats);
}

export function getChatsByProfessor(professorId: string): ChatMessage[] {
  return getChats().filter((c) => c.professorId === professorId);
}

export function addChat(message: ChatMessage) {
  const all = getChats();
  all.push(message);
  setChats(all);
}

// Drafts
export function getDrafts(): EmailDraft[] {
  return get(KEYS.drafts, []);
}

export function setDrafts(drafts: EmailDraft[]) {
  set(KEYS.drafts, drafts);
}

export function getDraftsByProfessor(professorId: string): EmailDraft[] {
  return getDrafts().filter((d) => d.professorId === professorId);
}

export function addDraft(draft: EmailDraft) {
  const all = getDrafts();
  all.push(draft);
  setDrafts(all);
}

export function deleteDraft(id: string) {
  setDrafts(getDrafts().filter((d) => d.id !== id));
}

// API Key
export function getApiKey(): string {
  return get(KEYS.apiKey, "");
}

export function setApiKey(key: string) {
  set(KEYS.apiKey, key);
}

// Export / Import
export async function exportAll(): Promise<AppData> {
  const documents = await getDocuments();
  return {
    professors: getProfessors(),
    profile: getProfile(),
    documents,
    memory: getMemory(),
    chats: getChats(),
    drafts: getDrafts(),
  };
}

export async function importAll(data: unknown) {
  const sanitized = sanitizeImportData(data);
  setProfessors(sanitized.professors);
  setProfile(sanitized.profile);
  await setDocuments(sanitized.documents);
  setMemory(sanitized.memory);
  setChats(sanitized.chats);
  setDrafts(sanitized.drafts);
}

// Subscribe helper for useSyncExternalStore
export function subscribe(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
