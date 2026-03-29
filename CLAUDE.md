# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with HMR (port 3000)
npm run build        # Production build (SSR)
npm run start        # Serve production build
npm run typecheck    # Generate route types + TypeScript check
npm run lint         # ESLint
npm run test         # Run unit tests once
npm run test:watch   # Run tests in watch mode
```

Run a single test file:
```bash
npx vitest run app/test/brevo.server.test.ts
```

## Architecture

**Stack:** React 19, React Router v7 (SSR), TypeScript, Tailwind CSS, shadcn/ui, Vite, Node.js 24.

This is a single full-stack app — not a monorepo. Server and client code coexist in `app/`.

### Routing

File-based routing via React Router v7. Routes live in `app/routes/`. Route metadata is re-exported in `app/routes.ts`. SSR is enabled (`react-router.config.ts`).

| Route | Purpose |
|-------|---------|
| `_index.tsx` | Landing page with hero, services, carriers, quote dialog |
| `upload.tsx` | Secure document upload to Digital Ocean Spaces |
| `client-intake.tsx` | Client intake form + jsPDF generation |
| `cobra-letter.tsx` | COBRA letter generator |
| `deduction-calculator.tsx` | Interactive payroll deduction calculator |
| `affiliate.tsx` / `client-access.tsx` | Login stubs (not yet implemented) |
| `$.tsx` | Catch-all 404 |

### Server/Client Boundary

Files suffixed `.server.ts` are server-only and excluded from the client bundle automatically:
- `app/lib/brevo.server.ts` — transactional email via Brevo SDK v5
- `app/lib/spaces.server.ts` — file uploads via AWS SDK v3 (Digital Ocean Spaces S3-compatible)

Form submissions use React Router's `action()` / `loader()` pattern. Client forms POST via `<Form>` or `useFetcher()`, server actions return data consumed by `useActionData()`.

### Key Utilities

- `app/lib/utils.ts` — `cn()` (Tailwind class merging) and `escapeHtml()` (sanitize user input before email HTML)
- `app/lib/generateCobraLetterPdf.ts` / `generateIntakePdf.ts` — client-side PDF generation with jsPDF
- `app/components/ui/` — 30+ shadcn/ui Radix primitive components

## Environment Variables

Copy `.env.example` to `.env`. Required:

| Variable | Purpose |
|----------|---------|
| `BREVO_API_KEY` | Brevo transactional email |
| `DO_SPACES_KEY` / `DO_SPACES_SECRET` | Digital Ocean Spaces credentials |
| `DO_SPACES_BUCKET` / `DO_SPACES_ENDPOINT` / `DO_SPACES_REGION` | Spaces bucket config |
| `NOTIFICATION_EMAIL` | Email address for upload notifications |

## Testing

- **Unit tests:** Vitest, files in `app/test/`. Environment is Node (not jsdom). Globals enabled (`describe`, `it`, `expect` without imports).
- **E2E tests:** Playwright (`playwright.config.ts`).

## Deployment

Pushes to `main` trigger GitHub Actions (`.github/workflows/deploy.yml`), which SSH into a Digital Ocean droplet, pulls, runs `npm ci && npm run build`, then reloads PM2:
```bash
pm2 reload ecosystem.config.cjs --env production
```

The app runs on port 3000 behind Nginx.
