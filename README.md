# Gun2Gun — AI LiveOps & Game Design Workbench

> **A domain-specific AI workbench for turning game context into structured LiveOps and game-design decisions.**

Gun2Gun explores how AI can support real product workflows — not by creating another generic chatbot, but by constraining generation around specific game-design tasks.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/) [![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

## Product problem

LiveOps and game-design teams repeatedly turn product context into event concepts, quests, progression ideas, economy recommendations and KPI hypotheses. That work is structured enough to benefit from software, but open-ended enough to benefit from AI.

Gun2Gun turns that workflow into a repeatable system.

## What it does

| Workflow | Output |
|---|---|
| LiveOps | Event concepts and operational ideas |
| GDD | Structured game-design documents |
| Quests | Objectives, rewards and narrative hooks |
| Economy | Balance and monetisation recommendations |
| KPIs | Retention, ARPU, conversion and related hypotheses |

## Architecture

```text
React / Vite UI
       │
       │ POST /api/ai/liveops
       ▼
Express + TypeScript
       │
       ├── Request validation
       ├── Context handling
       ├── Task-specific prompt orchestration
       └── Error handling
       │
       ▼
Gemini API
       │
       ▼
Structured product output
```

The model API key stays on the server. The browser never receives the provider secret.

## Why the architecture matters

The important engineering choice is the **domain boundary around AI**. Instead of exposing an unrestricted model, the backend selects instructions based on the requested workflow and returns structured output suitable for a product workflow.

This makes it easier to add:

- structured JSON responses
- persistence
- evaluation datasets
- retrieval over domain documentation
- usage/cost telemetry
- authentication and workspace isolation

## Run locally

```bash
git clone https://github.com/Rrachet/Gun2Gun.git
cd Gun2Gun
npm install
```

Create `.env` from `.env.example` and configure the Gemini API key, then run:

```bash
npm run dev
```

Never commit provider keys or other secrets.

## Engineering considerations

- Server-side provider credentials
- Explicit API boundary
- Task-specific prompt orchestration
- Success/error JSON responses
- Domain-constrained AI workflows
- Clear separation between UI and model integration

## Roadmap

- [ ] Persist generated artifacts and prompt history
- [ ] Authentication and workspace isolation
- [ ] Evaluation datasets and automated prompt-quality tests
- [ ] Structured JSON outputs
- [ ] Retrieval over game-design documentation
- [ ] API contract tests
- [ ] Usage, cost and latency telemetry
- [ ] Rate limiting

## Built by

**Amarnath Mishra** — Product Analyst / Product Builder with a full-stack engineering background, interested in AI-native products and practical software systems.

## License

MIT
