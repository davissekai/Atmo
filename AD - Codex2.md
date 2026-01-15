# AD - Codex2

## Overview
This report is a fresh, read-only diagnostic of the current codebase, plus a comparison against `Atmo Diagnostic.md` and `Atmo Diagnostic - Codex.md`.

- **Project:** Atmo (Climate Assistant)
- **Date:** January 14, 2026
- **Repository:** `C:\Users\P\PROJECTS\Work\climate assistant`
- **Method:** Static review only (no tests run)

## Current diagnostic (key findings)

### Security and abuse risk
1) **Uploads remain public**
   - **Issue:** Uploads are now randomized and user-prefixed, but are still stored with `access: "public"`.
   - **Risk:** Anyone with the URL can access the file; no expiry or access control.
   - **Location:** `app/(chat)/api/files/upload/route.ts`
   - **Suggested fix:** Use private blobs and return signed URLs, or implement per-user access checks with a proxy route.

2) **Anonymous usage bypasses rate limiting**
   - **Issue:** Rate limits are enforced only for authenticated users.
   - **Risk:** Anonymous traffic can spam API calls and drive costs.
   - **Location:** `app/(chat)/api/chat/route.ts`
   - **Suggested fix:** Add IP-based throttles and message/token size caps for anonymous users.

3) **Guest sign-in has no abuse controls**
   - **Issue:** Guest accounts can be created without CAPTCHA/throttling.
   - **Risk:** Abuse of guest creation, DB churn, quota evasion.
   - **Location:** `app/(auth)/api/auth/guest/route.ts`
   - **Suggested fix:** Add rate limiting, or reuse short-lived guest sessions.

4) **HTML rendering relies on upstream safety**
   - **Issue:** `dangerouslySetInnerHTML` is used for code rendering; Streamdown output safety depends on its configuration.
   - **Risk:** XSS if raw HTML is allowed by the markdown pipeline or code rendering.
   - **Locations:** `components/ai-elements/code-block.tsx`, `components/elements/response.tsx`
   - **Suggested fix:** Confirm Streamdown disables raw HTML, sanitize HTML output, and add regression tests for XSS payloads.

### Stability and maintenance
5) **Beta dependencies remain in production**
   - **Issue:** Multiple beta versions in `@ai-sdk/*`, `ai`, and `next-auth`.
   - **Risk:** API instability, breaking changes, unexpected regressions.
   - **Location:** `package.json`

6) **Rate limiting only counts message number**
   - **Issue:** No token or payload size limits.
   - **Risk:** Large prompts can spike costs and latency.
   - **Location:** `app/(chat)/api/chat/route.ts`

## Notable improvements since earlier reports
- **Secrets are no longer tracked**: `.env` and `.env.local` are ignored and not in git; `.env.example` remains tracked.
- **Legacy backend removed**: no `backend/` or `frontend/` directories; only `legacy_backup/` remains (ignored).
- **Model default mismatch resolved**: default model matches the curated list.
- **Tool approval schema hardened**: strict Zod schemas replace permissive `z.any()`.
- **Upload filename hardening**: user-prefix and UUID-based naming added.
- **Branding metadata updated**: `app/layout.tsx` now references Atmo branding.

## Comparison with prior diagnostics

### Items from `Atmo Diagnostic.md`
- **Committed env secrets**: **Resolved** (files ignored; not tracked in git).
- **Hybrid backend confusion**: **Resolved** (no Python/Vite backend directories present).
- **Legacy code present**: **Partially resolved** (`legacy_backup/` still exists but is ignored).
- **Model ID mismatch**: **Resolved** (`lib/ai/models.ts`).
- **Template metadata**: **Resolved** (`app/layout.tsx`).
- **Lint rules disabled**: **Still true** (`biome.jsonc`).
- **Beta dependencies**: **Still true** (`package.json`).
- **Limited tests**: **Still true** (no additional tests detected).
- **CSS styling issue (suggestions)**: **Not revalidated** in this static pass.

### Items from `Atmo Diagnostic - Codex.md`
- **Public uploads / name collisions**: **Partially addressed** (randomized names; still public).
- **XSS risk in HTML rendering**: **Partially addressed** (DOMPurify used in editor/diff, but code blocks still inject HTML).
- **Tool approval payload permissiveness**: **Resolved** (strict schemas in `app/(chat)/api/chat/schema.ts`).
- **Rate limiting gaps**: **Still true** (no token/payload caps; anonymous bypass).
- **Guest abuse controls**: **Still true** (no throttles or CAPTCHA).
- **Document retention bloat**: **Not revalidated** in this pass.

## Recommended next steps (prioritized)
1) **Make uploads private** and return signed URLs.
2) **Add IP-based throttling** for anonymous requests and guest sign-ins.
3) **Add request size/token limits** to chat and tool endpoints.
4) **Confirm/lock down markdown safety** and add XSS regression tests.
5) **Plan beta dependency stabilization** before production.

## Key files referenced
- `app/(chat)/api/files/upload/route.ts`
- `app/(chat)/api/chat/route.ts`
- `app/(chat)/api/chat/schema.ts`
- `app/(auth)/api/auth/guest/route.ts`
- `components/ai-elements/code-block.tsx`
- `components/elements/response.tsx`
- `lib/ai/models.ts`
- `package.json`
- `.gitignore`

---
Report generated by Codex (static review).
