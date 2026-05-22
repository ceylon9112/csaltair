# Frase Security ROI IQ

Client-side Security ROI Calculator for Frase Security sales reps and prospects.

## Stack

- Vite + React + TypeScript
- No backend — all calculation logic runs in the browser
- Static build works offline and supports `file://` when built with relative base path

## Key behaviors

- **Five vertical templates** pre-populate editable defaults (Retail, Restaurant, Office, Property Management, Manufacturing/Warehouse)
- **Employee hourly cost** is a first-class input — editable every session (default $25/hr)
- **ROI classification thresholds** are editable every session via the collapsible *ROI Classification Thresholds* panel (defaults: Strong ≤24 mo, Moderate ≤48 mo)
- Guard service savings are **opt-in** via toggle
- Hard savings and operational value are always shown separately
- Weak and inconclusive outcomes show a prominent callout
- Print/PDF via browser print dialog (assumptions and access control sections hidden in print)

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically http://localhost:5173).

## Build static files

```bash
npm run build
npm run preview
```

The `dist/` folder can be hosted on any static host or opened after build.

## Source PRD

`../SaltAIr-Platform/frase_security_roi_iq_prd.md`

## Calculation module

Pure logic lives in `src/lib/calculate.ts` — separated from UI for auditability and testing.
