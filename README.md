# Profreach

A professor outreach tracker for grad school applications. Track professors, draft personalized emails with AI, chat about research strategies, and manage your application pipeline — all in one place.

Built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, and Google Gemini.

## Features

- **Professor Dashboard** — Add, search, filter, and sort professors by application status, research area, or country
- **AI Professor Lookup** — Enter a name and university, and Gemini (with Google Search grounding) finds their info, research areas, and recent papers
- **Professor Detail Pages** — Edit professor info, track application/hiring status, manage research area tags
- **AI Email Drafting** — Generate personalized cold outreach, follow-up, thank you, or inquiry emails using your profile + professor context
- **Research Chat** — Floating chat bubble (like Messenger) scoped to each professor, with streaming responses and automatic memory extraction
- **Smart Memory** — AI automatically extracts insights from chat conversations; you can also add, edit, search, and delete memories manually
- **Profile Management** — Store your academic info, research interests, skills, and publications
- **Resume Parsing** — Upload a PDF resume and let Gemini extract and populate your profile
- **Document Manager** — Upload and categorize documents (resume, SOP, transcripts, writing samples)
- **Data Export/Import** — Full JSON backup and restore of all your data
- **Dark Mode** — System preference detection + manual toggle
- **Client-Side Storage** — Core app data is stored in localStorage, uploaded documents are stored in IndexedDB, and API keys stay in your browser storage

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Gemini API Key

AI features require a Google Gemini API key. You can get one for free:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in and click "Create API Key"
3. Paste it in the app's Settings page or the banner that appears at the top

Your key is stored in your browser's localStorage and sent with each AI request to this app's API routes, which then call Google Gemini. The app does not persist your key server-side.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **AI**: [Google Gemini 2.0 Flash](https://ai.google.dev) via `@google/generative-ai`
- **Fonts**: IBM Plex Sans / Mono / Serif
- **Storage**: localStorage + IndexedDB (documents), with custom event-driven reactivity (`useSyncExternalStore`)

## Project Structure

```text
app/
  page.tsx                    # Dashboard
  professor/[id]/page.tsx     # Professor detail
  profile/page.tsx            # Profile + documents + memory
  settings/page.tsx           # API key configuration
  export/page.tsx             # Data export/import
  api/gemini/                 # API routes (lookup, email, chat, memory, resume)
components/
  dashboard/                  # Stats, professor list, cards, filters, add dialog
  professor/                  # Info panel, email drafts, floating chat, tag input
  profile/                    # Profile form, resume upload, documents, smart memory
  settings/                   # API key management
  export/                     # Export/import controls
  layout/                     # Sidebar, app shell, API key banner
  ui/                         # shadcn/ui components
lib/
  types.ts                    # All interfaces and enums
  storage.ts                  # localStorage state + shared persistence helpers
  document-db.ts              # IndexedDB storage for uploaded documents
  gemini.ts                   # Gemini client helpers
  constants.ts                # Status colors, labels, defaults
hooks/
  use-storage.ts              # useSyncExternalStore hook for reactive localStorage
  use-debounce.ts             # Debounce hook for search
```
