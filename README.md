# FBS Website

Website for Flexible Benefit Solutions Insurance Brokerage, Inc.

## Stack

React 19 + React Router v7 (SSR) + TypeScript + Tailwind CSS + shadcn/ui

## Development

```bash
cp .env.example .env   # fill in required values
nvm use                # use Node 22 (requires nvm)
npm install
npm run dev            # http://localhost:3000
```

## Build & Start

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for all required variables.

## Deployment

Deployed to a Digital Ocean Droplet via GitHub Actions on push to `main`.
See `docs/superpowers/plans/` for the full deployment runbook.
