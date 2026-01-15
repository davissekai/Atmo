# Atmo Architecture

> [!IMPORTANT]
> **Atmo uses the Vercel AI Chatbot (Next.js) architecture.**
> The legacy Python/Vite stack has been deprecated and moved to `legacy_backup/`.

## Current Stack (Active)
- **Framework:** Next.js 16 (App Router)
- **AI SDK:** Vercel AI SDK with `@ai-sdk/google`
- **Database:** Supabase (PostgreSQL via Drizzle ORM)
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS v4

## Key Files
| Purpose | Path |
|---------|------|
| Chat API | `app/(chat)/api/chat/route.ts` |
| AI Models | `lib/ai/models.ts` |
| AI Provider | `lib/ai/providers.ts` |
| System Prompt | `lib/ai/prompts.ts` |
| Database Queries | `lib/db/queries.ts` |
| Global Styles | `app/globals.css` |

## Legacy (Deprecated)
The old architecture (Python FastAPI + Vite React) is archived in `legacy_backup/`. **Do not use.**
