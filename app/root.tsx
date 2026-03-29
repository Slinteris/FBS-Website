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
import type { ReactNode } from "react";
import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import { QuoteDialog } from "~/components/QuoteDialog";
import { Button } from "~/components/ui/button";
import { Upload, Menu, X } from "lucide-react";
import fbsLogo from "~/assets/fbs-logo.gif";
import stylesheet from "~/index.css?url";
import type { LinksFunction } from "react-router";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" },
  { rel: "stylesheet", href: stylesheet },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md" aria-label="Main navigation">
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
            <a href="/#services" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Services</a>
            <a href="/#why-us" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why Us</a>
            <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</a>
            <Button size="sm" variant="outline" className="gap-2 w-fit" asChild>
              <Link to="/upload" onClick={() => setMobileMenuOpen(false)}><Upload className="h-4 w-4" /> Upload Documents</Link>
            </Button>
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
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-primary-foreground/80">
            © {new Date().getFullYear()} Flexible Benefit Solutions Insurance Brokerage, Inc. All rights reserved.
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

export default function App() {
  return (
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
