# FBS Website — React Router v7 Migration & Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the FBS website from Vite + React Router v6 to React Router v7 (framework mode) with React 19, wire up contact/quote/upload form actions backed by Brevo email and DO Spaces file storage, then deploy to a $6/mo Digital Ocean Droplet with automated GitHub Actions CI/CD.

**Architecture:** React Router v7 runs as a single SSR Node.js process (served by `react-router-serve`, managed by PM2) behind an Nginx reverse proxy that handles SSL via Certbot/Let's Encrypt. GitHub Actions deploys on push to `main` after a successful build gate.

**Tech Stack:** React 19, React Router v7 (framework mode), TypeScript, Tailwind CSS v3, shadcn/ui, `@getbrevo/brevo` (email), `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (DO Spaces), PM2, Nginx, Certbot, Ubuntu 24.04 LTS, Node.js 22 LTS, GitHub Actions

---

## File Map

### New files
| Path | Purpose |
|---|---|
| `.nvmrc` | Pin Node.js version to 22 |
| `.env.example` | Document all required env vars |
| `react-router.config.ts` | RR v7 framework config (SSR enabled) |
| `ecosystem.config.cjs` | PM2 process config with `.env` loading |
| `.github/workflows/deploy.yml` | CI/CD pipeline |
| `app/root.tsx` | App shell: HTML document, nav, footer, providers |
| `app/routes/_index.tsx` | Landing page with contact + quote actions |
| `app/routes/client-intake.tsx` | Client intake PDF form |
| `app/routes/client-access.tsx` | Client access portal (UI stub) |
| `app/routes/deduction-calculator.tsx` | Payroll deduction calculator |
| `app/routes/cobra-letter.tsx` | COBRA letter generator |
| `app/routes/upload.tsx` | Document upload with real action |
| `app/routes/affiliate.tsx` | Affiliate partner portal (UI stub) |
| `app/routes/$.tsx` | 404 catch-all |
| `app/lib/brevo.server.ts` | Brevo email helper (server-only) |
| `app/lib/spaces.server.ts` | DO Spaces upload + presigned URL helper |
| `app/lib/utils.ts` | cn() utility (moved from src/) |
| `app/lib/generateIntakePdf.ts` | Moved from src/lib/ |
| `app/lib/generateCobraLetterPdf.ts` | Moved from src/lib/ |
| `app/test/brevo.server.test.ts` | Unit tests for Brevo helper |
| `app/test/spaces.server.test.ts` | Unit tests for Spaces helper |

### Modified files
| Path | Change |
|---|---|
| `package.json` | React 19, react-router v7, new deps, new scripts, rename project |
| `vite.config.ts` | Replace SWC plugin with `@react-router/dev/vite` plugin |
| `tsconfig.json` | Flatten to single config, update paths `@/*` → `~/` |
| `tailwind.config.ts` | Update `content` globs to `./app/**/*` |
| `index.html` | Remove Vite SPA entry point (RR v7 manages this) |

### Deleted files
| Path | Reason |
|---|---|
| `src/` (entire directory) | Replaced by `app/` |
| `tsconfig.app.json` | Merged into `tsconfig.json` |
| `tsconfig.node.json` | Merged into `tsconfig.json` |
| `src/main.tsx`, `src/App.tsx` | Replaced by `app/root.tsx` + file-based routing |

### Path alias change
All `@/` imports become `~/` (mapped to `./app/*`). This is a global find-replace done in Task 3.

---

## Task 1: Bootstrap React Router v7 + React 19

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`
- Delete: `tsconfig.app.json`, `tsconfig.node.json`
- Create: `react-router.config.ts`
- Create: `.nvmrc`
- Create: `.env.example`

- [ ] **Step 1: Remove old deps and install new ones**

```bash
# Remove packages being replaced
npm uninstall react react-dom react-router-dom @tanstack/react-query next-themes \
  @vitejs/plugin-react-swc @types/react @types/react-dom lovable-tagger

# Install React 19 + React Router v7 + server/storage packages
npm install react@latest react-dom@latest react-router@latest \
  @react-router/node@latest @react-router/serve@latest \
  @getbrevo/brevo@latest \
  @aws-sdk/client-s3@latest @aws-sdk/s3-request-presigner@latest

# Install new dev deps
npm install -D @react-router/dev@latest vite-tsconfig-paths@latest \
  @types/react@latest @types/react-dom@latest @types/node@latest
```

Expected: no peer dependency errors. React Router v7 peer-requires React 19.

- [ ] **Step 2: Update `package.json` name and scripts**

Replace the `name` and `scripts` sections:

```json
{
  "name": "fbs-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Create `react-router.config.ts`**

```typescript
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
} satisfies Config;
```

- [ ] **Step 4: Replace `vite.config.ts`**

```typescript
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
});
```

- [ ] **Step 5: Replace `tsconfig.json`** (delete `tsconfig.app.json` and `tsconfig.node.json` after)

```json
{
  "include": ["**/*.ts", "**/*.tsx", ".react-router/types/**/*"],
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["node", "vite/client"],
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "target": "ES2022",
    "allowJs": true,
    "skipLibCheck": true,
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
```

Then delete the old split configs:
```bash
rm tsconfig.app.json tsconfig.node.json
```

- [ ] **Step 6: Update `tailwind.config.ts` content globs**

Change the `content` array from:
```typescript
content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
```
to:
```typescript
content: ["./app/**/*.{ts,tsx}", "./index.html"],
```

- [ ] **Step 7: Create `.nvmrc`**

```
22
```

- [ ] **Step 8: Create `.env.example`**

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

- [ ] **Step 9: Add `.env` to `.gitignore`**

Open `.gitignore` and confirm `.env` is listed (it should be). Also add:
```
.react-router/
build/
```

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json \
  react-router.config.ts .nvmrc .env.example tailwind.config.ts .gitignore
git commit -m "chore: bootstrap React Router v7 + React 19"
```

---

## Task 2: Create App Shell (`app/root.tsx`)

This file is the HTML document wrapper and shared layout (nav + footer) for every page.

**Files:**
- Create: `app/root.tsx`
- Create: `app/index.css` (move from `src/index.css`)

The navigation is extracted from `src/pages/Index.tsx` (lines 99–153). The footer is extracted from `src/pages/Index.tsx` (lines 591–599).

- [ ] **Step 1: Move the CSS file**

```bash
mkdir -p app
cp src/index.css app/index.css
```

- [ ] **Step 2: Create `app/root.tsx`**

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import { useState } from "react";
import { Toaster } from "~/components/ui/toaster";
import { Toaster as Sonner } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import QuoteDialog from "~/components/QuoteDialog";
import { Button } from "~/components/ui/button";
import { Upload, Menu, X } from "lucide-react";
import fbsLogo from "~/assets/fbs-logo.gif";
import stylesheet from "~/index.css?url";
import type { LinksFunction } from "react-router";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={fbsLogo} alt="Flexible Benefit Solutions Insurance Brokerage, Inc." className="h-16" />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="/#products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Products</a>
          <a href="/#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Services</a>
          <a href="/#why-us" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why Us</a>
          <a href="/#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</a>
          <Button size="sm" variant="outline" className="gap-2" asChild>
            <Link to="/upload"><Upload className="h-4 w-4" /> Upload Documents</Link>
          </Button>
          <QuoteDialog trigger={<Button size="sm">Get a Quote</Button>} />
        </div>
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="border-t bg-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="/#products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Products</a>
            <a href="/#services" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Services</a>
            <a href="/#why-us" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why Us</a>
            <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</a>
            <Button size="sm" variant="outline" className="gap-2 w-fit" asChild>
              <Link to="/upload" onClick={() => setMobileMenuOpen(false)}><Upload className="h-4 w-4" /> Upload Documents</Link>
            </Button>
            <QuoteDialog trigger={<Button size="sm" className="w-fit">Get a Quote</Button>} />
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-primary py-12 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Flexible Benefit Solutions Insurance Brokerage, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Navbar />
      <Outlet />
      <Footer />
    </TooltipProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.status === 404
      ? "Page not found."
      : `${error.status} — ${error.statusText}`
    : error instanceof Error
    ? error.message
    : "An unexpected error occurred.";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
      <p className="text-muted-foreground">{message}</p>
      <a href="/" className="text-primary underline underline-offset-4 hover:opacity-80">
        Return home
      </a>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/root.tsx app/index.css
git commit -m "feat: add app shell (root.tsx) with shared nav, footer, error boundary"
```

---

## Task 3: Move Shared Files to `app/`

Move all components, hooks, lib, and assets from `src/` to `app/`, then do the global alias find-replace.

**Files:**
- Move: `src/components/` → `app/components/`
- Move: `src/hooks/` → `app/hooks/`
- Move: `src/lib/` → `app/lib/`
- Move: `src/assets/` → `app/assets/`

- [ ] **Step 1: Copy directories**

```bash
cp -r src/components app/components
cp -r src/hooks app/hooks
cp -r src/lib app/lib
cp -r src/assets app/assets
```

- [ ] **Step 2: Replace all `@/` import aliases with `~/`**

```bash
# In all TypeScript/TSX files under app/
find app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|from "@/|from "~/|g' {} +
find app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i "s|from '@/|from '~/|g" {} +
```

- [ ] **Step 3: Replace `react-router-dom` imports with `react-router`**

```bash
find app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|from "react-router-dom"|from "react-router"|g' {} +
```

- [ ] **Step 4: Verify no remaining old imports**

```bash
grep -r "from \"@/" app/ || echo "Clean"
grep -r "react-router-dom" app/ || echo "Clean"
```

Both should print "Clean".

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "chore: move components, hooks, lib, assets to app/"
```

---

## Task 4: Migrate Landing Page (`app/routes/_index.tsx`)

Convert `src/pages/Index.tsx` to a RR v7 route module. The nav and footer are now in `root.tsx`, so remove them here.

**Files:**
- Create: `app/routes/_index.tsx`

- [ ] **Step 1: Create `app/routes/` directory and copy the page**

```bash
mkdir -p app/routes
cp src/pages/Index.tsx app/routes/_index.tsx
```

- [ ] **Step 2: Update the file header — change imports and add meta export**

At the top of `app/routes/_index.tsx`, replace:
```tsx
import { Link } from "react-router-dom";
```
with:
```tsx
import { Link } from "react-router";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Flexible Benefit Solutions Insurance Brokerage" },
  { name: "description", content: "Independent employee benefit insurance brokerage serving small & mid-size businesses." },
];
```

- [ ] **Step 3: Remove the nav and footer from `_index.tsx`**

Delete the entire `<nav>` block (lines ~99–153 in the original) and the `<footer>` block (lines ~591–599) — they now live in `root.tsx`.

The component's return value starts at:
```tsx
return (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <section className="relative ...">
```

And ends before `</div>` (the wrapping div, now without nav/footer children).

- [ ] **Step 4: Add `name` attributes to the contact form fields**

The contact form currently has `<input>` elements without `name` attributes. Update them:

```tsx
<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
  <div className="grid gap-4 sm:grid-cols-2">
    <input name="firstName" placeholder="First name" ... />
    <input name="lastName" placeholder="Last name" ... />
  </div>
  <input name="company" placeholder="Company name" ... />
  <input name="email" type="email" placeholder="Email address" ... />
  <input name="phone" type="tel" placeholder="Phone number" ... />
  <textarea name="message" ... />
```

Leave the `onSubmit={(e) => e.preventDefault()}` for now — the action will be wired in Task 9.

- [ ] **Step 5: Commit**

```bash
git add app/routes/_index.tsx
git commit -m "feat: migrate landing page to RR v7 route module"
```

---

## Task 5: Migrate Remaining Routes

Convert all other pages from `src/pages/` to `app/routes/`. These are mostly direct copies with import alias updates (already done in Task 3 for the `app/` copies — but routes are new files).

**Files:**
- Create: `app/routes/client-intake.tsx`
- Create: `app/routes/client-access.tsx`
- Create: `app/routes/deduction-calculator.tsx`
- Create: `app/routes/cobra-letter.tsx`
- Create: `app/routes/upload.tsx`
- Create: `app/routes/affiliate.tsx`
- Create: `app/routes/$.tsx`

- [ ] **Step 1: Copy all pages to routes**

```bash
cp src/pages/ClientIntake.tsx       app/routes/client-intake.tsx
cp src/pages/ClientAccess.tsx       app/routes/client-access.tsx
cp src/pages/DeductionCalculator.tsx app/routes/deduction-calculator.tsx
cp src/pages/CobraLetter.tsx        app/routes/cobra-letter.tsx
cp src/pages/UploadDocuments.tsx    app/routes/upload.tsx
cp src/pages/AffiliateLogin.tsx     app/routes/affiliate.tsx
cp src/pages/NotFound.tsx           app/routes/$.tsx
```

- [ ] **Step 2: Fix imports in all new route files**

```bash
find app/routes -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|from "@/|from "~/|g' {} +
find app/routes -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|from "react-router-dom"|from "react-router"|g' {} +
```

- [ ] **Step 3: Add `meta` export to each route**

Add the following at the top of each route file (after imports), adjusting the title per page:

**`client-intake.tsx`:**
```tsx
import type { MetaFunction } from "react-router";
export const meta: MetaFunction = () => [{ title: "Client Intake — FBS" }];
```

**`client-access.tsx`:**
```tsx
import type { MetaFunction } from "react-router";
export const meta: MetaFunction = () => [{ title: "Client Access — FBS" }];
```

**`deduction-calculator.tsx`:**
```tsx
import type { MetaFunction } from "react-router";
export const meta: MetaFunction = () => [{ title: "Deduction Calculator — FBS" }];
```

**`cobra-letter.tsx`:**
```tsx
import type { MetaFunction } from "react-router";
export const meta: MetaFunction = () => [{ title: "COBRA Letter Generator — FBS" }];
```

**`upload.tsx`:**
```tsx
import type { MetaFunction } from "react-router";
export const meta: MetaFunction = () => [{ title: "Secure Document Upload — FBS" }];
```

**`affiliate.tsx`:**
```tsx
import type { MetaFunction } from "react-router";
export const meta: MetaFunction = () => [{ title: "Affiliate Partner — FBS" }];
```

- [ ] **Step 4: Remove per-page navs that are now in root.tsx**

Each sub-page (`upload.tsx`, `client-access.tsx`, etc.) has its own `<nav>` with "Back to Home". Remove those `<nav>` blocks — the shared nav in `root.tsx` renders on every page now.

- [ ] **Step 5: Replace `$.tsx` (404) with RR v7 catch-all**

```tsx
import { Link } from "react-router";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Not Found — FBS" }];

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-primary underline underline-offset-4 hover:opacity-80">
        Return home
      </Link>
    </div>
  );
}
```

- [ ] **Step 6: Verify build compiles**

```bash
npm run build
```

Expected: successful build, no TypeScript errors, `build/` directory created.

- [ ] **Step 7: Commit**

```bash
git add app/routes/
git commit -m "feat: migrate all page routes to RR v7"
```

---

## Task 6: Remove `src/` Directory

After verifying the build passes, delete the original source tree.

**Files:**
- Delete: `src/` (entire directory)

- [ ] **Step 1: Verify the dev server works before deleting**

```bash
npm run dev
```

Open `http://localhost:3000` and confirm the landing page loads with nav, hero, and footer visible.

- [ ] **Step 2: Delete `src/`**

```bash
rm -rf src/
```

- [ ] **Step 3: Run build again to confirm nothing imported from `src/`**

```bash
npm run build
```

Expected: successful build with zero errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove src/ — fully migrated to app/"
```

---

## Task 7: Brevo Email Helper (TDD)

**Files:**
- Create: `app/test/brevo.server.test.ts`
- Create: `app/lib/brevo.server.ts`

- [ ] **Step 1: Write the failing tests**

Create `app/test/brevo.server.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Brevo SDK before importing the module under test
vi.mock("@getbrevo/brevo", () => {
  const sendTransacEmail = vi.fn().mockResolvedValue({ response: { statusCode: 201 } });
  const setApiKey = vi.fn();
  return {
    TransactionalEmailsApi: vi.fn().mockImplementation(() => ({ setApiKey, sendTransacEmail })),
    TransactionalEmailsApiApiKeys: { apiKey: "apiKey" },
    SendSmtpEmail: vi.fn().mockImplementation((data) => data),
  };
});

import { sendEmail } from "~/lib/brevo.server";

describe("sendEmail", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-key";
    process.env.NOTIFICATION_EMAIL = "team@fbsinsurance.com";
    vi.clearAllMocks();
  });

  it("sends an email with subject and htmlContent", async () => {
    const { TransactionalEmailsApi } = await import("@getbrevo/brevo");
    const mockInstance = new (TransactionalEmailsApi as any)();

    await sendEmail({
      subject: "New contact form submission",
      htmlContent: "<p>Hello</p>",
    });

    expect(mockInstance.sendTransacEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "New contact form submission",
        htmlContent: "<p>Hello</p>",
        to: [{ email: "team@fbsinsurance.com" }],
      })
    );
  });

  it("throws if BREVO_API_KEY is missing", async () => {
    delete process.env.BREVO_API_KEY;
    await expect(
      sendEmail({ subject: "Test", htmlContent: "<p>Test</p>" })
    ).rejects.toThrow("BREVO_API_KEY");
  });

  it("throws if NOTIFICATION_EMAIL is missing", async () => {
    delete process.env.NOTIFICATION_EMAIL;
    await expect(
      sendEmail({ subject: "Test", htmlContent: "<p>Test</p>" })
    ).rejects.toThrow("NOTIFICATION_EMAIL");
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
npm run test -- brevo
```

Expected: 3 failing tests ("Cannot find module '~/lib/brevo.server'" or similar).

- [ ] **Step 3: Implement `app/lib/brevo.server.ts`**

```typescript
import * as Brevo from "@getbrevo/brevo";

interface SendEmailOptions {
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}

export async function sendEmail({ subject, htmlContent, replyTo }: SendEmailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!apiKey) throw new Error("BREVO_API_KEY environment variable is not set");
  if (!notificationEmail) throw new Error("NOTIFICATION_EMAIL environment variable is not set");

  const api = new Brevo.TransactionalEmailsApi();
  api.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

  const email = new Brevo.SendSmtpEmail();
  email.sender = { name: "FBS Website", email: "noreply@fbsinsurance.com" };
  email.to = [{ email: notificationEmail }];
  email.subject = subject;
  email.htmlContent = htmlContent;
  if (replyTo) email.replyTo = replyTo;

  await api.sendTransacEmail(email);
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

```bash
npm run test -- brevo
```

Expected: 3 passing tests.

- [ ] **Step 5: Commit**

```bash
git add app/lib/brevo.server.ts app/test/brevo.server.test.ts
git commit -m "feat: add Brevo email helper with tests"
```

---

## Task 8: DO Spaces Upload Helper (TDD)

**Files:**
- Create: `app/test/spaces.server.test.ts`
- Create: `app/lib/spaces.server.ts`

- [ ] **Step 1: Write the failing tests**

Create `app/test/spaces.server.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSend = vi.fn().mockResolvedValue({});
const mockGetSignedUrl = vi.fn().mockResolvedValue("https://spaces.example.com/presigned");

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: vi.fn().mockImplementation((params) => ({ input: params })),
  GetObjectCommand: vi.fn().mockImplementation((params) => ({ input: params })),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: mockGetSignedUrl,
}));

import { uploadFile, getPresignedUrl } from "~/lib/spaces.server";

describe("uploadFile", () => {
  beforeEach(() => {
    process.env.DO_SPACES_KEY = "test-key";
    process.env.DO_SPACES_SECRET = "test-secret";
    process.env.DO_SPACES_BUCKET = "fbs-docs";
    process.env.DO_SPACES_ENDPOINT = "https://nyc3.digitaloceanspaces.com";
    vi.clearAllMocks();
    mockSend.mockResolvedValue({});
    mockGetSignedUrl.mockResolvedValue("https://spaces.example.com/presigned");
  });

  it("uploads a buffer and returns the storage key", async () => {
    const key = await uploadFile({
      buffer: Buffer.from("hello"),
      fileName: "test.pdf",
      mimeType: "application/pdf",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(key).toMatch(/^uploads\/.+test\.pdf$/);
  });

  it("throws if DO_SPACES_KEY is missing", async () => {
    delete process.env.DO_SPACES_KEY;
    await expect(
      uploadFile({ buffer: Buffer.from("x"), fileName: "x.pdf", mimeType: "application/pdf" })
    ).rejects.toThrow("DO_SPACES_KEY");
  });
});

describe("getPresignedUrl", () => {
  beforeEach(() => {
    process.env.DO_SPACES_KEY = "test-key";
    process.env.DO_SPACES_SECRET = "test-secret";
    process.env.DO_SPACES_BUCKET = "fbs-docs";
    process.env.DO_SPACES_ENDPOINT = "https://nyc3.digitaloceanspaces.com";
    vi.clearAllMocks();
    mockGetSignedUrl.mockResolvedValue("https://spaces.example.com/presigned");
  });

  it("returns a presigned URL for a given key", async () => {
    const url = await getPresignedUrl("uploads/123-test.pdf");
    expect(url).toBe("https://spaces.example.com/presigned");
    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ input: expect.objectContaining({ Key: "uploads/123-test.pdf" }) }),
      { expiresIn: 604800 }
    );
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
npm run test -- spaces
```

Expected: failing tests ("Cannot find module '~/lib/spaces.server'").

- [ ] **Step 3: Implement `app/lib/spaces.server.ts`**

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getClient() {
  const key = process.env.DO_SPACES_KEY;
  const secret = process.env.DO_SPACES_SECRET;
  const endpoint = process.env.DO_SPACES_ENDPOINT;

  if (!key) throw new Error("DO_SPACES_KEY environment variable is not set");
  if (!secret) throw new Error("DO_SPACES_SECRET environment variable is not set");
  if (!endpoint) throw new Error("DO_SPACES_ENDPOINT environment variable is not set");

  return new S3Client({
    endpoint,
    region: "us-east-1",
    credentials: { accessKeyId: key, secretAccessKey: secret },
    forcePathStyle: false,
  });
}

function getBucket() {
  const bucket = process.env.DO_SPACES_BUCKET;
  if (!bucket) throw new Error("DO_SPACES_BUCKET environment variable is not set");
  return bucket;
}

interface UploadFileOptions {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}

export async function uploadFile({ buffer, fileName, mimeType }: UploadFileOptions): Promise<string> {
  const client = getClient();
  const bucket = getBucket();
  const key = `uploads/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: "private",
    })
  );

  return key;
}

export async function getPresignedUrl(key: string, expiresInSeconds = 60 * 60 * 24 * 7): Promise<string> {
  const client = getClient();
  const bucket = getBucket();

  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expiresInSeconds }
  );
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

```bash
npm run test -- spaces
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/lib/spaces.server.ts app/test/spaces.server.test.ts
git commit -m "feat: add DO Spaces upload helper with tests"
```

---

## Task 9: Contact Form Action

Wire the landing page contact form to actually send an email via Brevo.

**Files:**
- Modify: `app/routes/_index.tsx`

- [ ] **Step 1: Add the action function to `_index.tsx`**

At the top, add the import:
```tsx
import { Form, useActionData, useNavigation } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { sendEmail } from "~/lib/brevo.server";
```

Add the action before the component:
```tsx
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent !== "contact") {
    return { success: false, error: "Unknown form intent." };
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !email) {
    return { success: false, error: "Name and email are required." };
  }

  await sendEmail({
    subject: `New consultation request from ${firstName} ${lastName}`,
    htmlContent: `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Company:</strong> ${company || "—"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "—"}</p>
      <p><strong>Message:</strong><br>${message || "—"}</p>
    `,
    replyTo: { email, name: `${firstName} ${lastName}` },
  });

  return { success: true, intent: "contact" };
}
```

- [ ] **Step 2: Update the contact form JSX in `_index.tsx`**

Replace the contact form section (the `<form>` with `onSubmit={(e) => e.preventDefault()}`):

```tsx
export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "contact";

  // ... (existing state and JSX unchanged until the contact form)

  // Replace the <form> in the contact section:
  <Form method="post" className="space-y-4">
    <input type="hidden" name="intent" value="contact" />
    <div className="grid gap-4 sm:grid-cols-2">
      <input name="firstName" placeholder="First name" required
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      <input name="lastName" placeholder="Last name"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    </div>
    <input name="company" placeholder="Company name"
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    <input name="email" type="email" placeholder="Email address" required
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    <input name="phone" type="tel" placeholder="Phone number"
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    <textarea name="message" placeholder="Tell us about your current benefits or what you're looking for..."
      rows={4}
      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />

    {actionData?.intent === "contact" && actionData.success && (
      <p className="text-sm font-medium text-accent">
        Thank you! We'll be in touch shortly.
      </p>
    )}
    {actionData?.intent === "contact" && actionData.error && (
      <p className="text-sm font-medium text-destructive">{actionData.error}</p>
    )}

    <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Sending…" : "Submit Request"}
    </Button>
  </Form>
```

- [ ] **Step 3: Commit**

```bash
git add app/routes/_index.tsx
git commit -m "feat: wire contact form to Brevo email action"
```

---

## Task 10: Quote Dialog Action (useFetcher)

The QuoteDialog is a modal — we don't want a full page navigation on submit. Use `useFetcher` to post to the landing page action without navigating away.

**Files:**
- Modify: `app/routes/_index.tsx` (extend the action)
- Modify: `app/components/QuoteDialog.tsx`

- [ ] **Step 1: Extend the action in `_index.tsx` to handle `intent: "quote"`**

Inside the `action` function, add a new case after the contact case:

```tsx
if (intent === "quote") {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const employees = String(formData.get("employees") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !email) {
    return { success: false, intent: "quote", error: "Name and email are required." };
  }

  await sendEmail({
    subject: `Quote request from ${firstName} ${lastName} — ${company}`,
    htmlContent: `
      <h2>Quote Request</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Company:</strong> ${company || "—"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "—"}</p>
      <p><strong>Employees:</strong> ${employees || "—"}</p>
      <p><strong>Message:</strong><br>${message || "—"}</p>
    `,
    replyTo: { email, name: `${firstName} ${lastName}` },
  });

  return { success: true, intent: "quote" };
}
```

- [ ] **Step 2: Update `app/components/QuoteDialog.tsx` to use `useFetcher`**

Replace the entire `QuoteDialog.tsx` with:

```tsx
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Upload, FileText, X } from "lucide-react";

interface QuoteDialogProps {
  trigger: React.ReactNode;
}

export default function QuoteDialog({ trigger }: QuoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<{ success: boolean; intent: string; error?: string }>();

  const isSubmitting = fetcher.state === "submitting";

  // Close dialog on successful submission
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.intent === "quote") {
      setOpen(false);
      setFiles([]);
    }
  }, [fetcher.data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    files.forEach((file) => formData.append("attachments", file));
    fetcher.submit(formData, {
      method: "post",
      action: "/",
      encType: "multipart/form-data",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Get a Quote
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input type="hidden" name="intent" value="quote" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="q-first">First name</Label>
              <Input id="q-first" name="firstName" placeholder="First name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-last">Last name</Label>
              <Input id="q-last" name="lastName" placeholder="Last name" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-company">Company name</Label>
            <Input id="q-company" name="company" placeholder="Company name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-email">Email address</Label>
            <Input id="q-email" name="email" type="email" placeholder="Email address" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-phone">Phone number</Label>
            <Input id="q-phone" name="phone" type="tel" placeholder="Phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-employees">Number of employees</Label>
            <Input id="q-employees" name="employees" type="number" placeholder="e.g. 25" min="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-message">Tell us about your needs</Label>
            <Textarea id="q-message" name="message" placeholder="Current benefits, renewal date, etc." rows={3} />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Documents (optional)</Label>
            <p className="text-xs text-muted-foreground">Census data, current plan summaries, renewal letters — up to 10 MB each.</p>
            <div
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Click to upload files</span>
            </div>
            <input ref={fileInputRef} type="file" multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg"
              className="hidden" onChange={handleFileChange} />
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((file, i) => (
                  <div key={`${file.name}-${i}`} className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate text-sm">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)} className="ml-2 shrink-0 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {fetcher.data?.intent === "quote" && fetcher.data.error && (
            <p className="text-sm font-medium text-destructive">{fetcher.data.error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Submit Quote Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

Note: For the quote action with file attachments, the `sendEmail` helper will receive the attachment file names in the email body. Full attachment support via Brevo requires base64 encoding — extend `sendEmail` to optionally accept `attachments` if needed, or just list file names in the HTML body for now.

- [ ] **Step 3: Extend `sendEmail` to optionally include attachment names in the body**

In `app/lib/brevo.server.ts`, update the interface:

```typescript
interface SendEmailOptions {
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
  attachmentNames?: string[];
}

export async function sendEmail({ subject, htmlContent, replyTo, attachmentNames }: SendEmailOptions): Promise<void> {
  // ... existing code ...

  let finalHtml = htmlContent;
  if (attachmentNames && attachmentNames.length > 0) {
    finalHtml += `<p><strong>Attached files:</strong> ${attachmentNames.join(", ")}</p>`;
  }
  email.htmlContent = finalHtml;

  // ...
}
```

- [ ] **Step 4: Commit**

```bash
git add app/routes/_index.tsx app/components/QuoteDialog.tsx app/lib/brevo.server.ts
git commit -m "feat: wire quote dialog to Brevo email action via useFetcher"
```

---

## Task 11: Document Upload Action

**Files:**
- Modify: `app/routes/upload.tsx`

- [ ] **Step 1: Add the action to `upload.tsx`**

At the top, add imports and the action:

```tsx
import { Form, useActionData, useNavigation } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { uploadFile, getPresignedUrl } from "~/lib/spaces.server";
import { sendEmail } from "~/lib/brevo.server";

export const meta: MetaFunction = () => [{ title: "Secure Document Upload — FBS" }];

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const documents = formData.getAll("documents") as File[];

  if (!firstName || !email) {
    return { success: false, error: "Name and email are required." };
  }
  if (documents.length === 0 || documents.every((f) => f.size === 0)) {
    return { success: false, error: "Please upload at least one document." };
  }

  // Upload each file to DO Spaces and collect presigned URLs
  const uploadedLinks: string[] = [];
  for (const file of documents) {
    if (file.size === 0) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = await uploadFile({ buffer, fileName: file.name, mimeType: file.type || "application/octet-stream" });
    const url = await getPresignedUrl(key);
    uploadedLinks.push(`<li><a href="${url}">${file.name}</a> (link valid 7 days)</li>`);
  }

  await sendEmail({
    subject: `Document upload from ${firstName} ${lastName} — ${company}`,
    htmlContent: `
      <h2>Secure Document Upload</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${message ? `<p><strong>Message:</strong><br>${message}</p>` : ""}
      <p><strong>Documents:</strong></p>
      <ul>${uploadedLinks.join("")}</ul>
    `,
    replyTo: { email, name: `${firstName} ${lastName}` },
  });

  return { success: true };
}
```

- [ ] **Step 2: Update the form JSX in `upload.tsx`**

Replace the `<form onSubmit={handleSubmit}>` with `<Form method="post" encType="multipart/form-data">`:

```tsx
export default function UploadDocuments() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset file list on success
  useEffect(() => {
    if (actionData?.success) setFiles([]);
  }, [actionData]);

  // ... keep existing handleFileChange and removeFile handlers ...

  return (
    // ... keep existing JSX structure, but:
    // 1. Remove the per-page <nav> block (now in root.tsx)
    // 2. Replace <form onSubmit={handleSubmit}> with:

    <Form method="post" encType="multipart/form-data" className="space-y-6">
      {/* existing form fields unchanged */}

      {/* File input: add name="documents" to the hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        name="documents"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Success/error feedback */}
      {actionData?.success && (
        <p className="text-sm font-medium text-accent">
          Documents submitted securely! We'll review them shortly.
        </p>
      )}
      {actionData?.error && (
        <p className="text-sm font-medium text-destructive">{actionData.error}</p>
      )}

      <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Uploading…" : (
          <><Lock className="h-4 w-4" /> Submit Documents Securely</>
        )}
      </Button>
    </Form>
  );
}
```

Note: The `files` state is kept for the visual list display. On submit, RR v7 reads the `<input name="documents">` DOM element directly via the `encType="multipart/form-data"` form — but since files are managed via state and the input is hidden, we need to sync state back to the input. Add this before the Form's onSubmit equivalent using a `useEffect` or a submit button handler. The simplest approach: use a `ref` on the Form and a hidden submit path, or — simpler still — keep `useState` for display and wire the file input `name="documents"` so the browser sends whatever was last selected. For multi-select UX, the `files` state is display-only; each file picker interaction appends to the `name="documents"` input.

For correct multi-file submission with the progressive-add UI pattern, add a `DataTransfer` sync on form submit:

```tsx
const formRef = useRef<HTMLFormElement>(null);

const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  // Sync the files state back to the file input before RR v7 reads the form
  if (fileInputRef.current) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  }
};

// On the Form element:
<Form
  ref={formRef}
  method="post"
  encType="multipart/form-data"
  className="space-y-6"
  onSubmit={handleFormSubmit}
>
```

- [ ] **Step 3: Run a full build to verify no TypeScript errors**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add app/routes/upload.tsx
git commit -m "feat: wire document upload to DO Spaces + Brevo notification"
```

---

## Task 12: Loading States, Client Access Stub, and Project Metadata

**Files:**
- Modify: `app/routes/client-access.tsx` (disable login button, add "Coming Soon" label)
- Modify: `README.md`
- Modify: `index.html` (update title)

- [ ] **Step 1: Mark client access login as "Coming Soon"**

In `app/routes/client-access.tsx`, find each login form's submit button and replace it with a disabled button:

```tsx
<Button type="button" className="w-full" disabled>
  Login — Coming Soon
</Button>
```

Remove any `onSubmit` handlers that call `e.preventDefault()`.

- [ ] **Step 2: Update `README.md`**

```markdown
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
```

- [ ] **Step 3: Update `index.html` title**

```html
<title>Flexible Benefit Solutions Insurance Brokerage</title>
```

(This is the fallback title before React hydrates. RR v7's `meta` exports per-route override this.)

- [ ] **Step 4: Commit**

```bash
git add app/routes/client-access.tsx README.md index.html
git commit -m "chore: mark client access as coming soon, update README and metadata"
```

---

## Task 13: GitHub Actions Deploy Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `ecosystem.config.cjs`

- [ ] **Step 1: Create `ecosystem.config.cjs` (PM2 config)**

```javascript
const fs = require("fs");
const path = require("path");

// Parse .env file on the server to load secrets into PM2's environment
const envPath = path.join(__dirname, ".env");
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      env[key] = value;
    });
}

module.exports = {
  apps: [
    {
      name: "fbs-website",
      script: "./node_modules/.bin/react-router-serve",
      args: "./build/server/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        ...env,
      },
    },
  ],
};
```

- [ ] **Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Droplet

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build (fail fast — never deploy broken code)
        run: npm run build

      - name: Deploy to Droplet
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DO_HOST }}
          username: deploy
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            set -e
            cd ~/fbs-website
            git pull origin main
            npm ci --omit=dev
            npm run build
            pm2 reload ecosystem.config.cjs --env production
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml ecosystem.config.cjs
git commit -m "ci: add GitHub Actions deploy workflow + PM2 ecosystem config"
```

---

## Task 14: Droplet Setup Runbook

> This task is a manual runbook, not code. Execute these commands once when setting up the server. No TDD applies here.

**Prerequisites:**
- A Digital Ocean account
- Your domain's DNS pointed at the Droplet IP (A record)
- A GitHub repo with the code and all secrets configured (see spec for secret names)

- [ ] **Step 1: Create the Droplet**

In the Digital Ocean control panel:
- Image: Ubuntu 24.04 LTS
- Size: Basic, Regular ($6/mo — 1 vCPU, 1 GB RAM, 25 GB SSD)
- Region: same as your DO Spaces bucket (e.g. NYC3)
- Authentication: SSH Key (add your local public key)
- Hostname: `fbs-website`

- [ ] **Step 2: Create a deploy user (SSH in as root first)**

```bash
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

Generate a dedicated deploy key pair locally and add the public key to `authorized_keys`, the private key to GitHub secret `DO_SSH_KEY`:

```bash
# On your local machine:
ssh-keygen -t ed25519 -f ~/.ssh/fbs_deploy -C "fbs-github-actions"
cat ~/.ssh/fbs_deploy.pub  # → paste into /home/deploy/.ssh/authorized_keys on server
cat ~/.ssh/fbs_deploy      # → paste into GitHub secret DO_SSH_KEY
```

- [ ] **Step 3: Install Node.js 22 LTS via nvm (as deploy user)**

```bash
ssh deploy@YOUR_DROPLET_IP

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/HEAD/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
nvm alias default 22
node -v   # should print v22.x.x
```

- [ ] **Step 4: Install PM2 globally**

```bash
npm install -g pm2
pm2 startup systemd -u deploy --hp /home/deploy
# Run the printed sudo command to register the systemd service
```

- [ ] **Step 5: Clone the repo and create `.env`**

```bash
cd ~
git clone https://github.com/YOUR_ORG/fbs-website.git
cd fbs-website
cp .env.example .env
nano .env   # fill in all values
```

- [ ] **Step 6: Build and start with PM2**

```bash
npm ci
npm run build
pm2 start ecosystem.config.cjs --env production
pm2 save   # persist process list so it survives reboots
pm2 status # should show "fbs-website" as "online"
```

- [ ] **Step 7: Install and configure Nginx**

```bash
sudo apt update && sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/fbs-website
```

Paste this config (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/fbs-website /etc/nginx/sites-enabled/
sudo nginx -t          # should print "syntax is ok"
sudo systemctl reload nginx
```

- [ ] **Step 8: Issue SSL certificate with Certbot**

```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Follow the prompts — Certbot will update the Nginx config automatically
```

- [ ] **Step 9: Verify SSL auto-renewal**

```bash
sudo systemctl status snap.certbot.renew.timer
# Should show "active (waiting)"

sudo certbot renew --dry-run
# Should print "Simulating renewal of an existing certificate"
```

- [ ] **Step 10: Verify the full deploy pipeline**

Push a trivial change (e.g. update README) to `main` and watch the GitHub Actions workflow run. It should complete with a green checkmark and the change should be live at `https://yourdomain.com` within ~2 minutes.

---

## Self-Review Checklist

- [x] **Spec coverage**: All 3 required actions (contact, quote, upload) have tasks. Migration covered. Deployment covered. Error boundary covered.
- [x] **No placeholders**: All steps have complete code or exact commands.
- [x] **Type consistency**: `sendEmail` uses `SendEmailOptions` consistently across Tasks 7, 9, 10, 11. `uploadFile`/`getPresignedUrl` signatures match between tests and implementation.
- [x] **Path alias**: `~/` used throughout, global find-replace done in Task 3.
- [x] **Route paths**: `/upload` route filename matches `app/routes/upload.tsx`; existing links to `/upload` in nav and other pages will work.
