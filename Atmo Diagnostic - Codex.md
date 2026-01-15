# Atmo Diagnostic - Codex

## Overview
- Next.js 16 App Router chatbot based on Vercel AI SDK, with Google Gemini models via `@ai-sdk/google` and gateway options (`lib/ai/providers.ts`, `lib/ai/models.ts`).
- Auth is NextAuth with credentials + guest login; sessions are required for chat API (`app/(auth)/auth.ts`, `app/(chat)/api/chat/route.ts`).
- Data persists to Postgres via Drizzle; chats, messages, documents, suggestions, and streams (`lib/db/schema.ts`, `lib/db/queries.ts`).
- Tooling includes weather lookup (Open Meteo), document creation/update, and suggestions (`lib/ai/tools/*`), with tool approval flows in chat API (`app/(chat)/api/chat/route.ts`).

## Weaknesses / vulnerabilities (ordered by severity)
- Public, user-controlled file uploads can be overwritten and enumerated. The upload route writes to Vercel Blob with the raw client filename and `access: "public"`, no per-user prefix, no randomization, no dedupe, no rate limiting. This allows name collisions, guessing, and public exposure of user files. `app/(chat)/api/files/upload/route.ts`.
- XSS risk via HTML rendering from Markdown/LLM content. Several components render HTML via `dangerouslySetInnerHTML` or DOM parsing without explicit sanitization. If the markdown pipeline allows raw HTML, malicious content could execute. This is visible in code blocks, diff view, and editor pipeline, and LLM output is displayed to users. `components/ai-elements/code-block.tsx`, `components/diffview.tsx`, `lib/editor/functions.tsx`, `components/elements/response.tsx`.
- Tool approval bypass risk in schema permissiveness. Tool approval flow accepts `messages` with `role: string` and `parts: z.any()`, which are then passed to model as original messages. This likely enables malformed or untrusted tool state injection if the client is compromised. `app/(chat)/api/chat/schema.ts`, `app/(chat)/api/chat/route.ts`.
- Rate limiting only on message count, not on token size or tool usage. A user can send very large prompts or trigger heavy tool calls (weather fetches) without backpressure. This risks cost spikes and API abuse. `app/(chat)/api/chat/schema.ts`, `app/(chat)/api/chat/route.ts`, `lib/ai/tools/get-weather.ts`.
- Guest accounts are created on demand with no anti-abuse controls. Guest sign-in is open, no CAPTCHA, no IP throttles, and increases DB churn; abuse could bypass quotas with multiple guests. `app/(auth)/api/auth/guest/route.ts`, `lib/ai/entitlements.ts`.
- Document versioning uses append-only rows without pruning. `saveDocument` always inserts a new row; update is another insert, and delete requires a timestamp. This can accumulate unbounded history and bloat. `lib/db/queries.ts`, `lib/db/schema.ts`, `app/(chat)/api/document/route.ts`.

## Recommendations (prioritized)
1. Secure uploads: Add per-user prefixes and random IDs, enforce content-type and size server-side (already checks type/size), and avoid public access unless required. Consider private blobs + signed URLs. `app/(chat)/api/files/upload/route.ts`.
2. Harden HTML rendering: Ensure the markdown/HTML pipeline strips raw HTML or sanitize with a whitelist. Streamdown/React rendering should be audited to confirm it is safe. Add tests for XSS payloads. `components/elements/response.tsx`, `lib/editor/functions.tsx`, `components/diffview.tsx`, `components/ai-elements/code-block.tsx`.
3. Constrain tool approval payloads: Validate tool-approval `messages` with a stricter schema (known tool part types and limited fields) to prevent arbitrary structures. `app/(chat)/api/chat/schema.ts`.
4. Add abuse controls: Add per-user/IP throttles for chat and tools, and enforce message size or token limits. Consider separate quotas for `getWeather` and external API calls. `app/(chat)/api/chat/route.ts`, `lib/ai/tools/get-weather.ts`.
5. Guest account safeguards: Add rate limits or CAPTCHA for guest creation; optionally reuse a shared guest account with a short TTL. `app/(auth)/api/auth/guest/route.ts`.
6. Document retention policy: Implement TTL/cleanup for old document versions or cap history depth. `lib/db/queries.ts`, `app/(chat)/api/document/route.ts`.

## Fix plan (high level)
- Upload hardening: switch to private blobs, add server-side filename randomization and per-user pathing, and return signed URLs to clients.
- Content safety: confirm Streamdown behavior; if it allows raw HTML, sanitize or disable raw HTML and add a security test suite for XSS cases.
- Tool approval schema: define explicit Zod schemas for each tool part type; reject unknown parts on the server.
- Rate limiting: add request size caps, token budgets, and IP/user throttles for chat and tool endpoints.
- Guest flow protection: throttle guest sign-in, consider email verification or a shared guest token with expiry.
- Storage hygiene: add a scheduled cleanup for old document versions and/or limit stored versions per document.