# Codex View

## Findings
- Streaming responses are likely buffered: the chat SSE responses do not include the AI SDK `UI_MESSAGE_STREAM_HEADERS` (`Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`, `x-accel-buffering: no`), so proxies can hold chunks until the end. See `app/(chat)/api/chat/route.ts` and `app/(chat)/api/chat/[id]/stream/route.ts`.
- `result.consumeStream()` is called before piping `result.toUIMessageStream(...)` in `app/(chat)/api/chat/route.ts`; if the stream is not tee'd, this can drain it and make the UI receive data only at completion.
- Time-to-first-token is inflated by DB work before streaming begins (`getMessageCountByUserId`, `getChatById`, `getMessagesByChatId`, `saveMessages`, `createStreamId`) in `app/(chat)/api/chat/route.ts`.
- Status gets stuck when `onFinish` DB writes stall; the stream may not complete promptly, leaving `status === "streaming"` and blocking follow-ups (`components/multimodal-input.tsx`).

## Proposed Fixes
- Add AI SDK SSE headers to both streaming endpoints (chat and resumable stream). Include `Content-Encoding: none` to avoid compression buffering.
- Remove or delay `result.consumeStream()`; if background consumption is needed, explicitly tee the stream before consuming.
- Defer or parallelize non-critical DB work so streaming can start immediately (e.g., write messages after the first chunk or onFinish).
- Wrap `onFinish` DB writes with timeouts/try-catch to ensure the stream closes even if DB is slow.
- (Optional) Add timing logs for pre-stream DB steps and time-to-first-dataPart to confirm improvements.
