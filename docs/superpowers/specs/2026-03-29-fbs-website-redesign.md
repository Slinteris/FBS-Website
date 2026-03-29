# FBS Website — Redesign & Deployment Spec

**Date:** 2026-03-29
**Project:** Flexible Benefit Solutions Insurance Brokerage website
**Status:** Approved

---

## Context

The current codebase was scaffolded by Lovable.dev as a design prototype — React 18 + Vite + React Router v6 + shadcn/ui + Tailwind CSS. It has no backend integration, no deployment config, and several placeholder features. The goal is to migrate it to a production-ready, maintainable stack and deploy it on Digital Ocean.

---

## Goals

- Migrate to React Router v7 (framework mode) + React 19 — one framework handles both frontend and server-side logic, replacing the need for a separate Express backend
- Deploy on a $6/mo Digital Ocean Droplet with full CI/CD automation via GitHub Actions
- Make the following features actually work at launch:
  - Contact form (landing page)
  - Quote request dialog
  - Document upload (files → DO Spaces + email notification)
- Keep all other pages (client access portal, affiliate dashboard) as UI stubs for now
- Use Brevo for transactional email (same account as the ol360 project)

---

## Architecture

```
GitHub repo (main branch)
        │
        │  push
        ▼
GitHub Actions CI/CD
  1. npm ci + npm run build  (fail fast — never deploys a broken build)
  2. SSH into Droplet
  3. git pull + npm ci --omit=dev + npm run build + pm2 restart
        │
        ▼
$6 DO Droplet (Ubuntu 24.04 LTS)
  ┌─────────────────────────┐
  │  Nginx (reverse proxy)  │  ← SSL termination (Certbot/Let's Encrypt)
  │     port 80/443         │    Gzip compression, static asset caching
  └───────────┬─────────────┘
              │ proxy_pass :3000
  ┌───────────▼─────────────┐
  │  PM2 → Node.js process  │
  │  React Router v7 app    │  ← Routes, Loaders, Actions
  │     port 3000           │
  └─────────────────────────┘
              │
      ┌───────┴────────┐
      │                │
  DO Spaces         Brevo API
  (file uploads)    (email notifications)
```

### Services

| Service | Purpose | Notes |
|---|---|---|
| DO Droplet | App server | Ubuntu 24.04 LTS, $6/mo |
| Nginx | Reverse proxy | SSL termination, gzip, static cache |
| PM2 | Process manager | Auto-restart, survives reboots |
| Certbot | SSL | Let's Encrypt, systemd auto-renewal |
| DO Spaces | File storage | S3-compatible, document uploads |
| Brevo | Transactional email | Same account as ol360 project |

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React Router v7 (framework mode) | Replaces Vite + RR6 + any Express backend |
| UI library | React 19 | Upgrade from React 18 during migration |
| Styling | Tailwind CSS (latest) | Existing config preserved |
| Components | shadcn/ui | Existing components preserved |
| Forms | React Hook Form + Zod | Existing validation logic preserved |
| PDF generation | jsPDF | Existing lib files preserved |
| Email | Brevo Node.js SDK | Same account as ol360 |
| File storage | AWS SDK v3 (S3-compatible) | Points to DO Spaces endpoint |
| Runtime | Node.js 22 LTS via nvm | Pinned via `.nvmrc` |
| Server OS | Ubuntu 24.04 LTS | DO Droplet |

### Removed from current stack
- `react-query` — loaders handle server data fetching in RR v7
- `next-themes` — dark mode not required at launch, can be re-added later
- `lovable-tagger` — dev dependency for Lovable.dev, no longer needed

---

## File Structure After Migration

```
/
├── .nvmrc                    # Node version pin (22)
├── .env                      # Not committed — secrets on server
├── .env.example              # Committed — documents required env vars
├── app/
│   ├── root.tsx              # App shell: nav, footer, global providers
│   ├── routes/
│   │   ├── _index.tsx        # Landing page (/) — contact + quote actions
│   │   ├── client-intake.tsx # /client-intake — PDF download (client-side)
│   │   ├── client-access.tsx # /client-access — UI stub
│   │   ├── deduction-calculator.tsx
│   │   ├── cobra-letter.tsx
│   │   ├── upload-documents.tsx  # /upload-documents — real action
│   │   ├── affiliate.tsx     # /affiliate — UI stub
│   │   └── $.tsx             # 404
│   ├── components/           # Existing components (largely unchanged)
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── QuoteDialog.tsx
│   │   ├── CobraLetterDialog.tsx
│   │   ├── PartnerInfoForm.tsx
│   │   └── NavLink.tsx
│   ├── lib/
│   │   ├── brevo.server.ts       # Brevo email helper (server-only)
│   │   ├── spaces.server.ts      # DO Spaces upload helper (server-only)
│   │   ├── generateIntakePdf.ts  # Existing — unchanged
│   │   ├── generateCobraLetterPdf.ts  # Existing — unchanged
│   │   └── utils.ts
│   └── hooks/
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── public/                   # Static assets (favicon, robots.txt)
├── react-router.config.ts    # RR v7 config (SSR enabled)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts            # Managed by RR v7 plugin
```

---

## Server-Side Actions (Features That Must Work at Launch)

### 1. Contact Form — `_index.tsx` action
- Receives: name, email, phone, company, message
- Sends email to FBS team via Brevo
- Returns: success/error state to display in UI

### 2. Quote Request Dialog — `_index.tsx` action (separate intent)
- Receives: name, email, company, message, optional file attachment
- Sends email + attachment to FBS team via Brevo
- Returns: success/error state

### 3. Document Upload — `upload-documents.tsx` action
- Receives: name, email, company, message, one or more files (up to 10MB each)
- Uploads files to DO Spaces (private bucket)
- Sends email to FBS team via Brevo with: submitter info + pre-signed download links (7-day expiry)
- Returns: success/error state

---

## Deployment Pipeline

### Droplet initial setup (one-time, manual)
1. Create Ubuntu 24.04 LTS Droplet ($6/mo)
2. Install nvm → Node.js 22 LTS → npm
3. Install PM2 globally, configure startup script
4. Install Nginx, configure reverse proxy to port 3000
5. Point domain DNS to Droplet IP
6. Install Certbot, issue Let's Encrypt cert, verify systemd auto-renewal timer
7. Create deploy user with SSH key matching GitHub Actions secret
8. Clone repo, create `.env`, run first build and PM2 start

### GitHub Actions — `.github/workflows/deploy.yml`
Trigger: push to `main`

```
Steps:
1. Checkout code
2. Setup Node (from .nvmrc)
3. npm ci
4. npm run build           ← fail fast: aborts if build errors
5. SSH into Droplet:
   a. cd ~/fbs-website
   b. git pull origin main
   c. npm ci --omit=dev
   d. npm run build
   e. pm2 restart fbs-website
```

### Required GitHub Secrets
```
DO_SSH_KEY            Private key for deploy user on Droplet
DO_HOST               Droplet IP address
BREVO_API_KEY         Brevo API key
DO_SPACES_KEY         DO Spaces access key
DO_SPACES_SECRET      DO Spaces secret key
DO_SPACES_BUCKET      Bucket name
DO_SPACES_ENDPOINT    e.g. https://nyc3.digitaloceanspaces.com
NOTIFICATION_EMAIL    FBS team email address for alerts
```

### `.env.example` (committed to repo)
```
NODE_ENV=production
PORT=3000
BREVO_API_KEY=
DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_SPACES_BUCKET=
DO_SPACES_ENDPOINT=
NOTIFICATION_EMAIL=
```

---

## SSL Auto-Renewal

Certbot (installed via snap) registers a systemd timer that runs twice daily and renews certificates with < 30 days remaining. No manual intervention required. Nginx reloads automatically after renewal via a deploy hook.

```bash
# Verify timer is active (one-time check after setup)
systemctl status snap.certbot.renew.timer
```

---

## Codebase Improvements (Beyond Migration)

These are issues in the current Lovable.dev output to fix during migration:

| Issue | Fix |
|---|---|
| `package.json` name is `"vite_react_shadcn_ts"` | Rename to `"fbs-website"` |
| No `.env.example` | Add during migration |
| No `.nvmrc` | Add with Node 22 |
| `README.md` is a placeholder | Update with project info and setup instructions |
| Forms have no submission handlers | Add RR v7 actions |
| No error boundaries | Add root-level error boundary in `root.tsx` |
| No loading states on form submits | Use RR v7 `useNavigation()` for pending UI |
| Client access login forms prevent default but do nothing | Mark clearly as "coming soon" or remove submit button |

---

## Out of Scope (Deferred)

- Client access portal authentication (backend)
- Affiliate dashboard (real data, tracking)
- Dark mode toggle
- Database integration
- Admin interface for managing submissions
