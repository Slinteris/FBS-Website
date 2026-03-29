import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { LogIn } from "lucide-react";
import type { MetaFunction } from "react-router";
import PartnerInfoForm from "~/components/PartnerInfoForm";

export const meta: MetaFunction = () => [
  { title: "Affiliate Partner — FBS" },
  { name: "robots", content: "noindex" },
];

type View = "login" | "signup";

const AffiliateLogin = () => {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Partner Program Highlights */}
          <div className="flex-1 rounded-xl border border-primary/10 bg-muted/40 p-6">
            <h2 className="text-lg font-bold text-foreground mb-1">
              Our Partner Program
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Built on <span className="font-semibold text-foreground">Transparency, Trust &amp; Respect</span> — where the client's needs always come first.
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>We honor and respect your existing client relationships — our role is to support, never to displace.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Client needs stay front and center — every recommendation is made with their best interest in mind.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Full transparency in communication, commissions, and strategy — no hidden agendas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>We work to strengthen your current vendor relationships, keeping your clients fulfilled and focused.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Dedicated referral tracking, real-time reporting, and no cost to join.</span>
              </li>
            </ul>
          </div>

          {/* Login / Signup Form */}
          <div className="w-full lg:w-[400px] shrink-0">
        {view === "login" ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">
                Affiliate Partner Login
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access your referral dashboard.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                  </div>
                  <Button type="button" className="w-full" disabled>Login — Coming Soon</Button>
                </form>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button onClick={() => setView("signup")} className="font-semibold text-primary hover:underline">
                    Create Account
                  </button>
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">
                Become an Affiliate Partner
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Join our referral program and earn commissions for every client you refer.
              </p>
            </div>
            <PartnerInfoForm onComplete={() => setView("login")} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => setView("login")} className="font-semibold text-primary hover:underline">
                Sign In
              </button>
            </p>
          </>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLogin;
