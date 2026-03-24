# ShieldPulse

ShieldPulse is an independent product analytics case study for a fictional mobile cybersecurity app. It is designed to show how a product analyst could turn telemetry, app store data, experiment thinking, and privacy-aware measurement into a clear weekly readout for product leadership.

Problem statement: how should a mobile security team use telemetry, store data, and experiment results to improve activation, retention, and trust?

## What This Project Shows

- A portfolio-safe weekly executive readout for a subscription mobile security app
- A concise KPI layer covering acquisition, activation, protection usage, and retention
- Evidence-backed recommendations grounded in Amplitude-style funnels, app store analytics, Firebase telemetry, and qualitative support signals
- A measurement-plan page that makes the analyst thinking explicit: event taxonomy, funnel definitions, instrumentation gaps, privacy guardrails, and experiment ideas

## Product Story

ShieldPulse is framed as an internal analytics surface for a mobile security team. The current weekly readout highlights one core issue:

- Store conversion improved after a creative refresh
- Onboarding completion and first scan completion dropped after a permission-flow change
- Downstream protection engagement remains healthy for users who reach first value
- Trial start and paid conversion softened because permission friction is showing up before users fully trust the product

This gives the project a believable analyst narrative without needing a large codebase or a live data warehouse.

## Analyst Questions Answered

- Which workstream needs attention first this week?
- Are store conversion gains translating into healthy installs?
- Where is trust friction showing up in the onboarding flow?
- Does first product value predict deeper protection usage?
- Is monetization softness a pricing problem or a product-sequencing problem?
- What should the team instrument next before iterating again?

## Screens

- Home: current-week executive readout with KPI strip and four workstream sections
- Archive route: prior-week comparison view using a second mock reporting window
- Measurement plan: event taxonomy, funnel definitions, instrumentation gaps, privacy guardrails, and experiment backlog

## Metric Stack And Data Sources

- App Store Connect / Google Play Console: store conversion, listing performance, rating trend
- Amplitude: onboarding funnel, permission steps, first scan completion, retained protection behavior
- Firebase Crashlytics / Performance: crash-free sessions and protection workflow stability
- Warehouse snapshot: weekly protected devices, trial starts, paid conversion
- Support sentiment: permission confusion, setup complexity, and qualitative trust feedback

## Key Findings

1. Acquisition is improving, especially on iOS, after the creative refresh.
2. Activation is the biggest risk this week because the new permission explainer delays first value.
3. Protection usage remains strong once users complete their first scan.
4. Revenue softness appears downstream of activation friction, not a standalone pricing issue.

## Recommended Moves

1. Move the first quick scan ahead of the real-time protection permission request.
2. Reuse the best-performing iOS creative proof points in Google Play experiments.
3. Retime the premium ask to immediately follow a successful first scan.
4. Add more granular permission telemetry before the next onboarding iteration.

## Tech Stack

- `apps/web`: Next.js 14 App Router, React, Tailwind CSS, Vitest
- `apps/api`: FastAPI backend kept lightweight and optional for the demo
- Mock-first data layer so the case study works cleanly without live infrastructure

## Local Setup

### Frontend

1. Install dependencies with `npm.cmd install`
2. Run the app with `npm.cmd run dev:web`
3. Open the local URL printed by Next.js

### Checks

1. Run tests with `npm.cmd run test:web`
2. Build the app with `npm.cmd run build:web`

### Optional API

1. Install Python 3.11+
2. Create a virtual environment inside `apps/api`
3. Install dependencies from `apps/api/pyproject.toml`
4. Run `uvicorn app.main:app --reload --app-dir apps/api`

The web app is intentionally mock-friendly, so the case study still works even if the API is not running.
