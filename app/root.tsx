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
import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import { QuoteDialog } from "~/components/QuoteDialog";
import { Button } from "~/components/ui/button";
import { Upload, Menu, X, ChevronDown, Calculator, FileText } from "lucide-react";
import fbsLogo from "~/assets/fbs-logo.gif";
import stylesheet from "~/index.css?url";
import type { LinksFunction } from "react-router";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" },
  { rel: "stylesheet", href: stylesheet },
];

function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Client Tools
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-card p-1.5 shadow-lg">
          <Link
            to="/deduction-calculator"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Calculator className="h-4 w-4 text-secondary" />
            Deduction Calculator
          </Link>
          <Link
            to="/cobra-letter"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <FileText className="h-4 w-4 text-secondary" />
            COBRA Letter
          </Link>
          <Link
            to="/upload"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Upload className="h-4 w-4 text-secondary" />
            Upload Documents
          </Link>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card" aria-label="Main navigation">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={fbsLogo} alt="Flexible Benefit Solutions Insurance Brokerage, Inc." className="h-16" />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="/#products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Products</a>
          <a href="/#why-us" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why Us</a>
          <a href="/#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</a>
          <ToolsDropdown />
          <QuoteDialog trigger={<Button size="sm">Get a Quote</Button>} />
        </div>
        <button
          type="button"
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="border-t bg-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="/#products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Products</a>
            <a href="/#why-us" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why Us</a>
            <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</a>
            <div className="border-t pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client Tools</p>
              <div className="flex flex-col gap-2">
                <Link to="/deduction-calculator" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Calculator className="h-4 w-4 text-secondary" /> Deduction Calculator
                </Link>
                <Link to="/cobra-letter" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <FileText className="h-4 w-4 text-secondary" /> COBRA Letter
                </Link>
                <Link to="/upload" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Upload className="h-4 w-4 text-secondary" /> Upload Documents
                </Link>
              </div>
            </div>
            <div onClick={() => setMobileMenuOpen(false)}>
              <QuoteDialog trigger={<Button size="sm" className="w-fit">Get a Quote</Button>} />
            </div>
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-primary-foreground">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
              <li><a href="/#products" className="hover:text-primary-foreground transition-colors">Products</a></li>
              <li><a href="/#why-us" className="hover:text-primary-foreground transition-colors">Why Us</a></li>
              <li><a href="/#contact" className="hover:text-primary-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-foreground">Client Tools</h3>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/upload" className="hover:text-primary-foreground transition-colors">Document Upload</Link></li>
              <li><Link to="/deduction-calculator" className="hover:text-primary-foreground transition-colors">Deduction Calculator</Link></li>
              <li><Link to="/cobra-letter" className="hover:text-primary-foreground transition-colors">COBRA Letter</Link></li>
              <li><Link to="/client-access" className="hover:text-primary-foreground transition-colors">Client Access</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-foreground">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
              <li><a href="tel:978-465-0121" className="hover:text-primary-foreground transition-colors">(978) 465-0121</a></li>
              <li><a href="mailto:sal@fbsinsurance.com" className="hover:text-primary-foreground transition-colors">sal@fbsinsurance.com</a></li>
              <li>61 Pleasant St, Newburyport MA</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-foreground">Partners</h3>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/affiliate" className="hover:text-primary-foreground transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-foreground/20 pt-6">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Flexible Benefit Solutions Insurance Brokerage, Inc. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-primary-foreground/40">
            Protected by reCAPTCHA.{" "}
            <a href="https://policies.google.com/privacy" className="underline hover:text-primary-foreground/60">Privacy</a>
            {" · "}
            <a href="https://policies.google.com/terms" className="underline hover:text-primary-foreground/60">Terms</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
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

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function App() {
  const content = (
    <TooltipProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <Toaster />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </TooltipProvider>
  );

  if (!recaptchaSiteKey) return content;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      {content}
    </GoogleReCaptchaProvider>
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error — FBS</title>
        <style>{`
          body { margin: 0; font-family: sans-serif; background: #f5f7f9; color: #1f2430; }
          .error-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 1rem; padding: 1.5rem; text-align: center; }
          h1 { font-size: 1.875rem; font-weight: 700; margin: 0; }
          p { color: #6b7280; margin: 0; }
          a { color: #1F407C; text-underline-offset: 4px; }
          a:hover { opacity: 0.8; }
        `}</style>
      </head>
      <body>
        <div className="error-container">
          <h1>Something went wrong</h1>
          <p>{message}</p>
          <a href="/">Return home</a>
        </div>
      </body>
    </html>
  );
}
