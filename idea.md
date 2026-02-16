# Profreach — Product Spec

## Overview

A personal web app to manage graduate/PhD application outreach to professors. Track professors, research their backgrounds via AI, draft personalized emails, and manage application documents — all in one place.

Built with **Next.js (App Router)** and **Gemini API**. All data stored in **localStorage** behind a clean abstraction layer for easy migration to a database + Clerk auth later.

---

## Pages & Features

### 1. Dashboard (`/`)

The main hub. A searchable, filterable list of all tracked professors.

**Add Professor Input**

- A prominent input field at the top
- User enters either: professor name + university, OR a profile/lab website URL
- On submit, Gemini (with Google Search grounding) fetches and populates professor info automatically
- User can review and edit the auto-filled data before saving

**Professor List**

- Card/table view showing key info per professor:
  - Name, University, Department, Country
  - Research Area, Hiring Status, Email
  - Application Status (see below)
  - Last Contact Date
- Clicking a professor navigates to their detail page

**Filtering & Sorting**

- Filter by: University, Country, Research Area, Hiring Status, Application Status
- Sort by: Name, University, Date Added, Last Contact Date
- Search across all fields

**Application Statuses**

- `Not Contacted` — default
- `Researching` — gathering info, reading papers
- `Email Drafted` — draft written but not sent
- `Email Sent` — outreach sent
- `Followed Up` — sent a follow-up
- `Responded` — professor replied
- `Interview Scheduled` — interview/meeting set up
- `Applied to Lab` — formal application submitted
- `Accepted` — got in
- `Rejected` — declined or no response after follow-up
- `On Hold` — paused for any reason

### 2. Professor Detail Page (`/professor/[id]`)

A dedicated page for each professor with all their info, email drafting, and an AI chat.

**Professor Info Panel**

- All stored info displayed and editable:
  - Name, Email, University, Department, Country
  - Research Areas (tags)
  - Currently Hiring (Yes / No / Unknown)
  - H-index, Google Scholar link, Lab/Profile URL
  - Key Publications (title + link, up to ~5)
  - Notes (free-text)
- Application status selector
- Last contact date

**Email Drafting Section**

- One draft per professor
- "Generate Draft" button — uses Gemini to create a personalized cold outreach email using:
  - Professor's info (research area, publications, hiring status)
  - User's profile (resume data, research interests, background)
  - Smart Memory (relevant past insights)
- Rich text editor to manually edit the generated draft
- Predefined templates available: Cold Outreach, Follow-Up, Thank You
- "Copy to Clipboard" button for easy pasting into email client
- Draft is auto-saved

**AI Chat**

- A chat interface scoped to this professor's context
- Can be used to:
  - Update professor info ("change their research area to NLP")
  - Refine the email draft ("make it shorter", "mention my ML experience")
  - Ask questions ("what papers has this professor published recently?")
  - General conversation about the professor or application strategy
- Chat has full context: professor info, user profile, smart memory, current draft
- Chat history is persisted per professor
- Key information from chat is automatically extracted into Smart Memory

### 3. Profile Page (`/profile`)

User's personal info and application materials.

**Personal Info**

- Name, Email, University/Institution
- Degree Pursuing (Masters / PhD)
- Research Interests (tags)
- Brief Bio / Summary
- Can be auto-populated from resume via Gemini, or manually entered/edited

**Resume Upload & Parsing**

- Upload a PDF resume
- Gemini parses it to extract structured data: education, publications, skills, experience, research interests
- Extracted data is used to populate profile fields (user can review/edit)
- Resume PDF is stored (in localStorage as base64) and downloadable

**Document Management**

- Upload and categorize documents:
  - CV / Resume
  - Transcripts
  - Statement of Purpose (SOP)
  - Letters of Recommendation (LOR)
  - Other
- Each document: name, category, upload date, file (stored as base64)
- Download and delete functionality

**Smart Memory**

- A list of key insights extracted from professor page chats
- Each memory item: text content, source (which professor chat), date, tags
- Automatically populated by AI during chats
- User can manually add, edit, and delete items
- Searchable
- Used by the email drafting assistant across all professors

### 4. Data Export / Import

- **Export**: Full JSON export of all data (professors, drafts, profile, documents metadata, smart memory, chat histories)
- Documents exported separately (or included as base64 in JSON)
- One-click export from a settings area or profile page

---

## Technical Architecture

### Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui (via /frontend-design skill)
- **AI**: Gemini API (with Google Search grounding for professor lookup)
- **Storage**: localStorage with abstraction layer
- **PDF Parsing**: Gemini (send PDF, extract structured data)

### Data Abstraction Layer

All data access goes through a `storage` service:

```
storage.professors.getAll()
storage.professors.getById(id)
storage.professors.create(data)
storage.professors.update(id, data)
storage.professors.delete(id)

storage.profile.get()
storage.profile.update(data)

storage.documents.getAll()
storage.documents.upload(file, category)
storage.documents.delete(id)

storage.memory.getAll()
storage.memory.add(item)
storage.memory.update(id, item)
storage.memory.delete(id)

storage.chats.getByProfessorId(id)
storage.chats.addMessage(professorId, message)

storage.drafts.getByProfessorId(id)
storage.drafts.save(professorId, content)

storage.export() // returns full JSON
```

This layer currently reads/writes to localStorage. When migrating to a database, only this layer needs to change.

### Gemini API Usage

- **Professor Lookup**: Gemini with Google Search grounding — given a name+university or URL, returns structured professor data
- **Email Drafting**: Gemini generates personalized emails using professor info + user profile + smart memory
- **Chat**: Gemini-powered conversational interface per professor page
- **Resume Parsing**: Gemini extracts structured data from uploaded PDF
- **Smart Memory Extraction**: After each chat interaction, Gemini identifies key info worth remembering

### Data Models

**Professor**

```
id, name, email, university, department, country,
researchAreas[], hiringStatus (yes/no/unknown),
hIndex, googleScholarUrl, labUrl, profileUrl,
keyPublications[{title, url}],
notes, status, lastContactDate,
createdAt, updatedAt
```

**Profile**

```
name, email, university, degreePursuing,
researchInterests[], bio, resumeBase64, resumeFileName
```

**Document**

```
id, name, category, fileBase64, fileName, mimeType,
uploadedAt
```

**Memory Item**

```
id, content, sourceProfessorId, sourceProfessorName,
tags[], createdAt
```

**Chat Message**

```
id, professorId, role (user/assistant), content, createdAt
```

**Email Draft**

```
professorId, content, template (cold/followup/thankyou),
lastGeneratedAt, lastEditedAt
```

---

## Future Considerations (Post-MVP)

- Clerk authentication + database migration (Supabase/Postgres)
- Multi-user support
- Email sending directly from the app (Gmail/Outlook integration)
- Calendar integration for interview scheduling
- Analytics dashboard (response rates, outreach funnel)
- Browser extension to add professors from university websites
- Cost optimization for Gemini API calls (caching, rate limiting)
