# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Atmo is an AI-powered climate science Q&A web application focused on West African (Ghana) climate context. It uses a 3-step LLM chain (Decompose → Explain → Synthesize) to provide high-quality climate explanations.

## Development Commands

```bash
# Backend (FastAPI with hot reload)
uvicorn backend.app:app --reload

# Frontend dev server
cd frontend && npm run dev

# Frontend production build
cd frontend && npm run build
```

The app serves the frontend build from `frontend/build` at the root URL.

## Architecture

### Backend Stack
- **FastAPI** - Web framework with automatic OpenAPI docs at `/docs`
- **SQLite** - Local database at `data/atmo.db` for chat sessions
- **Nvidia NIM** - LLM provider via OpenAI-compatible API (`meta/llama-3.3-70b-instruct`)

### Key Backend Files
| File | Purpose |
|------|---------|
| `backend/app.py` | FastAPI entry point, HTTP endpoints |
| `backend/main.py` | Service orchestration layer (3-step chain) |
| `backend/llm.py` | LLM client (Nvidia NIM) |
| `backend/database.py` | SQLite operations for sessions/messages |
| `backend/prompts.py` | LLM prompt templates |

### API Endpoints
- `POST /ask` - Streaming climate Q&A (returns SSE)
- `GET /sessions` - List all chat sessions
- `GET /history/{session_id}` - Get session messages
- `PATCH /sessions/{session_id}` - Rename session
- `DELETE /sessions/{session_id}` - Delete session

### 3-Step LLM Chain (`backend/main.py`)
1. **Decomposer** - Identifies key climate concepts from user question (JSON response)
2. **Explainer** - Provides scientific explanation of identified concepts (JSON response)
3. **Synthesizer** - Generates final conversational answer with history context (streaming)

### Reasoning Markers
LLM responses include markers for frontend rendering:
- `[[START_THOUGHT]]...[[END_THOUGHT]]` - Analysis/reasoning display
- `[[START_FACT]]...[[END_FACT]]` - Scientific facts
- `[[START_ANSWER]]...[[END_ANSWER]]` - Final answer

### Database Schema (`backend/database.py`)
- **messages**: id, session_id, role, content, timestamp
- **sessions_meta**: session_id (PK), title, updated_at

### Frontend Stack
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- Radix UI for accessible components
- Lucide React for icons

### Frontend Key Components
| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Main app, chat logic, API calls |
| `frontend/src/components/ChatSidebar.tsx` | Session management |
| `frontend/src/components/ChatMessage.tsx` | Message rendering with marker parsing |

## Environment Variables

Create `.env` in project root:
```
NVIDIA_API_KEY=your_nvidia_api_key_here
```

## Code Conventions

- **Python**: Follows Python 3.8+ standards, uses type hints
- **TypeScript**: Standard React patterns, interfaces for types
- **Imports**: Backend uses `backend.` prefix (e.g., `from backend.main import ...`)
- **Response handling**: Frontend parses streaming response chunks and updates state incrementally

## Current Branch Context

This repository is on `project-reorganization` branch after a structural refactor:
- Backend files moved from root to `backend/` directory
- UI code moved from `ui_design_figma/` to `frontend/`
- Static assets in `assets/`, data in `data/`
