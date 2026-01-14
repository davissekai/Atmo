import { z } from "zod";

// Known tool names in the application
const KNOWN_TOOLS = ["getWeather", "createDocument", "updateDocument", "requestSuggestions"] as const;

// --- User message parts (for new messages) ---
const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().min(1).max(50000), // Allow longer text for context
});

const filePartSchema = z.object({
  type: z.literal("file"),
  mediaType: z.enum(["image/jpeg", "image/png"]),
  name: z.string().min(1).max(255),
  url: z.string().url(),
});

const partSchema = z.union([textPartSchema, filePartSchema]);

const userMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.literal("user"),
  parts: z.array(partSchema),
});

// --- Tool approval flow parts (stricter than z.any()) ---

// Tool invocation part - when AI wants to call a tool
const toolInvocationPartSchema = z.object({
  type: z.literal("tool-invocation"),
  toolInvocationId: z.string().min(1).max(100),
  toolName: z.enum(KNOWN_TOOLS),
  args: z.record(z.string(), z.unknown()), // Args are tool-specific but must be object
  state: z.enum(["partial-call", "call", "result"]),
  result: z.unknown().optional(),
});

// Tool result part - result from tool execution
const toolResultPartSchema = z.object({
  type: z.literal("tool-result"),
  toolInvocationId: z.string().min(1).max(100),
  toolName: z.enum(KNOWN_TOOLS),
  result: z.unknown(),
});

// Reasoning part - for models that expose reasoning
const reasoningPartSchema = z.object({
  type: z.literal("reasoning"),
  reasoning: z.string().max(100000),
});

// Step start/finish for multi-step responses
const stepPartSchema = z.object({
  type: z.enum(["step-start", "step-finish"]),
});

// Source/citation part
const sourcePartSchema = z.object({
  type: z.literal("source"),
  source: z.object({
    id: z.string(),
    url: z.string().url().optional(),
    title: z.string().optional(),
  }),
});

// File part for assistant responses (same as user but for completeness)
const assistantFilePartSchema = z.object({
  type: z.literal("file"),
  mediaType: z.string(),
  data: z.string().optional(), // Base64 data
  url: z.string().url().optional(),
});

// Combined schema for all valid part types in tool approval flow
const toolApprovalPartSchema = z.union([
  textPartSchema,
  filePartSchema,
  assistantFilePartSchema,
  toolInvocationPartSchema,
  toolResultPartSchema,
  reasoningPartSchema,
  stepPartSchema,
  sourcePartSchema,
]);

// Message schema for tool approval flows - strictly typed
const messageSchema = z.object({
  id: z.string().min(1).max(100),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(toolApprovalPartSchema),
});

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  // Either a single new message or all messages (for tool approvals)
  message: userMessageSchema.optional(),
  messages: z.array(messageSchema).optional(),
  selectedChatModel: z.string().min(1).max(200),
  selectedVisibilityType: z.enum(["public", "private"]),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;

