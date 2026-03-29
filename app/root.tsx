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
