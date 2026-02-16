# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Profreach Implementation Plan

## Overview
Build a professor outreach tracker for grad school applications using Next.js 16 (App Router), TypeScript, Tailwind CSS v4 + shadcn/ui, Gemini API, and localStorage.

---

## Phase 0: Setup & Dependencies
- Install: `@google/generative-ai`, `uuid`, `@types/uuid`, `lucide-react`, `sonner`
- Init shadcn/ui (New York style, CSS variables)
- Add shadcn components: button, input, label, textarea, select, badge, card, dialog, ...

### Prompt 2

Getting this error when I open the app on browser: ## Error Type
Console Error

## Error Message
The result of getSnapshot should be cached to avoid an infinite loop


    at DashboardStats (components/dashboard/dashboard-stats.tsx:10:32)
    at DashboardContent (components/dashboard/dashboard-content.tsx:17:7)

## Code Frame
   8 |
   9 | export function DashboardStats() {
> 10 |   const professors = useStorage(getProfessors);
     |                                ^
  11 |
  12 |   if (!profess...

### Prompt 3

Good job so far. A few adjustments:
1. I want the chat to be a floating circle on the right bottom corner of the page, by clicking it a floating window will open on the corner to chat. Kind of like messaging inside facebook or instagram. And make the professor data full width.
2. The smart memory box does not grow as more items are added.
3. I want a settings page where user will be able to set an api key for gemini. Currently we take it from .env.local, but if I share the website with others, I...

