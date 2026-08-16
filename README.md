# Gun2Gun — AI LiveOps & Game Design Workbench

> An AI-powered engineering prototype for generating structured LiveOps concepts, quests, game-design documents, and economy recommendations from natural-language game context.

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/UI-React-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Backend](https://img.shields.io/badge/Server-Express-000000?logo=express&logoColor=white)](https://expressjs.com/)

## Problem

LiveOps and game-design teams repeatedly turn product context into event concepts, quests, progression ideas, economy recommendations, and KPI hypotheses. This project explores how an AI workbench can turn that workflow into a structured, repeatable engineering system rather than a generic chatbot.

## What it does

The application exposes a server-side AI endpoint that accepts a request, operation type, and game context, then generates structured Markdown output for:

- **LiveOps event concepts**
- **Game Design Documents (GDDs)**
- **Quest and challenge proposals**
- **Economy and balance analysis**
- **Retention, ARPU, conversion, and other KPI hypotheses**

The server uses Gemini 2.5 Flash and keeps the model API key on the server rather than exposing it to the browser.

## Architecture

```text
React UI
   │
   │ POST /api/ai/liveops
   ▼
Express + TypeScript Server
   │
   ├── Request/context handling
   ├── Prompt orchestration
   └── Error handling
   │
   ▼
Google Gemini API
   │
   ▼
Structured LiveOps / GDD output
```

## AI design

The backend changes the model's instruction based on the requested operation. For example, a GDD request asks for an event summary, player archetypes, progression loop, monetization strategy, and KPI impact; a quest request focuses on player motivation, objectives, rewards, and narrative hooks.

This is intentionally domain-specific: the AI is constrained by a game-design workflow instead of being exposed as an unrestricted chat interface.

## Tech stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Motion |
| Backend | Node.js, Express, TypeScript |
| AI | Google Gemini API / Gemini 2.5 Flash |
| Visualisation | Recharts |
| UI | Lucide React |
| Build | Vite, esbuild, tsx |

## Running locally

```bash
git clone https://github.com/Rrachet/Gun2Gun.git
cd Gun2Gun
npm install
```

Create a `.env` file based on `.env.example` and provide your Gemini API key.

```bash
npm run dev
```

The application runs through the Express/Vite development server.

## Engineering considerations

### Server-side API key handling

The Gemini client is initialized from an environment variable on the server. The browser never needs the provider secret.

### Failure handling

The API returns explicit success/error JSON responses and logs provider errors server-side.

### Prompt specialization

Instead of one giant prompt, the backend selects task-specific instructions for GDD, quests, and balance analysis. This makes the system easier to extend with new workflows.

## What I learned

- Integrating an LLM into a real web application.
- Designing domain-specific AI workflows instead of generic chat.
- Keeping model credentials server-side.
- Building API boundaries around AI functionality.
- Turning unstructured model output into a repeatable product workflow.

## Roadmap

- [ ] Persist generated artifacts and prompt history
- [ ] Add authentication and workspace/project isolation
- [ ] Add evaluation datasets for prompt quality
- [ ] Add structured JSON outputs alongside Markdown
- [ ] Add retrieval over game-design documentation
- [ ] Add automated tests for API contracts
- [ ] Add usage/cost telemetry and rate limiting

## Author

**Amarnath Mishra** — Computer Science Engineer building full-stack, AI, and data-driven software systems.

[GitHub](https://github.com/Rrachet)