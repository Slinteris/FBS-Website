# FBS Website

Website for **Flexible Benefit Solutions Insurance Brokerage, Inc.** — a Massachusetts-based insurance broker offering group health, dental, vision, life, and supplemental benefits to employers.

## Stack

- **React 19** + **React Router v7** (SSR/file-based routing)
- **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **Brevo** — transactional email
- **Digital Ocean Spaces** (S3-compatible) — file uploads
- **PM2** — process management in production
- **Nginx** — reverse proxy in production

## Routes

| Path | Description |
|------|-------------|
| `/` | Public landing page (services, carriers, contact) |
| `/affiliate` | Affiliate/partner login stub |
| `/client-access` | Client portal login stub |
| `/client-intake` | New client intake form |
| `/cobra-letter` | COBRA letter generator |
| `/deduction-calculator` | Payroll deduction calculator |
| `/upload` | Secure file upload (DO Spaces) |

## Development

```bash
cp .env.example .env   # fill in required values
nvm use                # Node 22 (requires nvm)
npm install
npm run dev            # http://localhost:3000
```

Other dev commands:

```bash
npm run typecheck      # type-check + generate route types
npm run lint           # ESLint
npm test               # Vitest unit tests (single run)
npm run test:watch     # Vitest watch mode
```

## Production Build

```bash
npm run build          # outputs to ./build/
npm start              # serves with react-router-serve on PORT 3000
```

PM2 (used on the server) reads `.env` automatically via `ecosystem.config.cjs`:

```bash
pm2 start ecosystem.config.cjs
pm2 reload fbs-website   # zero-downtime reload
pm2 logs fbs-website
```

Nginx proxies port 80/443 → localhost:3000.

## Environment Variables

Copy `.env.example` and fill in all values before starting:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `3000`) |
| `BREVO_API_KEY` | Brevo transactional email API key |
| `DO_SPACES_KEY` | Digital Ocean Spaces access key |
| `DO_SPACES_SECRET` | Digital Ocean Spaces secret |
| `DO_SPACES_BUCKET` | Spaces bucket name |
| `DO_SPACES_ENDPOINT` | Spaces endpoint URL |
| `DO_SPACES_REGION` | Spaces region (e.g. `nyc3`) |
| `NOTIFICATION_EMAIL` | Address that receives form submission alerts |

## Deployment

Deployed automatically to a **Digital Ocean Droplet** via **GitHub Actions** on every push to `main`. The workflow SSH's into the server, runs `npm ci && npm run build`, and reloads PM2.

See `docs/superpowers/plans/` for the full deployment runbook.
