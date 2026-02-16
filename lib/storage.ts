import type { Professor, Profile, Document, MemoryItem, ChatMessage, EmailDraft, AppData } from "./types";
import { DEFAULT_PROFILE } from "./constants";

const STORAGE_EVENT = "profreach-storage-change";
const KEYS = {
  professors: "profreach:professors",
  profile: "profreach:profile",
  documents: "profreach:documents",
  memory: "profreach:memory",
  chats: "profreach:chats",
  drafts: "profreach:drafts",
} as const;

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

// Documents
export function getDocuments(): Document[] {
  return get(KEYS.documents, []);
}

export function setDocuments(documents: Document[]) {
  set(KEYS.documents, documents);
}

export function addDocument(doc: Document) {
  const all = getDocuments();
  all.push(doc);
  setDocuments(all);
}

export function deleteDocument(id: string) {
  setDocuments(getDocuments().filter((d) => d.id !== id));
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

// Export / Import
export function exportAll(): AppData {
  return {
    professors: getProfessors(),
    profile: getProfile(),
    documents: getDocuments(),
    memory: getMemory(),
    chats: getChats(),
    drafts: getDrafts(),
  };
}

export function importAll(data: AppData) {
  setProfessors(data.professors ?? []);
  setProfile(data.profile ?? DEFAULT_PROFILE);
  setDocuments(data.documents ?? []);
  setMemory(data.memory ?? []);
  setChats(data.chats ?? []);
  setDrafts(data.drafts ?? []);
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
