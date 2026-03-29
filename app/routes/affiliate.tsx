import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { LogIn, UserPlus, Link2, Copy, BarChart3, Users, DollarSign, Code } from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import fbsLogo from "~/assets/fbs-logo.gif";
import PartnerInfoForm from "~/components/PartnerInfoForm";

export const meta: MetaFunction = () => [{ title: "Affiliate Partner — FBS" }];

const earningsData = [
  { month: "Jan", earned: 0 },
  { month: "Feb", earned: 0 },
  { month: "Mar", earned: 0 },
  { month: "Apr", earned: 0 },
  { month: "May", earned: 0 },
  { month: "Jun", earned: 0 },
];

type View = "login" | "signup" | "dashboard";
type DashboardTab = "profile" | "overview";

const AffiliateLogin = () => {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — will connect to backend later
    setView("dashboard");
  };




  const referralLink = "fbspartner.com/ref/PARTNER123";
  const htmlButton = `<a href="https://fbspartner.com/ref/PARTNER123" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;font-family:sans-serif;font-size:14px;font-weight:600;text-decoration:none;border-radius:6px;">Health Insurance Review</a>`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlButton);
  };

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link to="/"><img src={fbsLogo} alt="FBS" className="h-16" /></Link>
            <Button variant="ghost" size="sm" onClick={() => setView("login")}>Sign Out</Button>
          </div>
        </nav>

        <div className="mx-auto max-w-4xl px-6 py-12">
              <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Affiliate Partner Dashboard
              </h1>
              <p className="text-muted-foreground mb-8">Track your referrals and manage your partner account.</p>

              {/* Referral Link Card */}
              <Card className="mb-8 border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Your Referral Link</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Share this link on your website, emails, or social media. All visits and sign-ups will be tracked to your account.
                  </p>
                  <div className="flex gap-2">
                    <Input value={referralLink} readOnly className="font-mono text-sm bg-muted" />
                    <Button variant="outline" size="icon" onClick={copyLink} title="Copy link">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* HTML Button Embed */}
                  <div className="mt-5 pt-5 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="h-5 w-5 text-primary" />
                      <h2 className="font-semibold text-foreground">Embeddable HTML Button</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Copy this HTML code and paste it into your website to add a referral button.
                    </p>
                    <div className="mb-3 rounded-md bg-muted p-3">
                      <code className="text-xs text-muted-foreground break-all whitespace-pre-wrap">{htmlButton}</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="gap-2" onClick={copyHtml}>
                        <Copy className="h-4 w-4" /> Copy HTML
                      </Button>
                      <span className="text-xs text-muted-foreground">Preview:</span>
                      <a href="#" onClick={(e) => e.preventDefault()} style={{ display: "inline-block", padding: "8px 16px", background: "#2563eb", color: "#fff", fontFamily: "sans-serif", fontSize: "13px", fontWeight: 600, textDecoration: "none", borderRadius: "6px" }}>
                        Health Insurance Review
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr] mb-8">
                {/* Left column: Referrals + Conversions stacked */}
                <div className="flex flex-col gap-4 [&>*]:flex-1">
                  {[
                    { icon: Users, label: "Total Referrals", value: "0" },
                    { icon: BarChart3, label: "Conversions", value: "0" },
                  ].map((stat) => (
                    <Card key={stat.label}>
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Right column: Referral Money Earned with graph */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">$0.00</p>
                        <p className="text-xs text-muted-foreground">Referral Money Earned</p>
                      </div>
                    </div>
                    <div className="h-[140px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={earningsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
                          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Earned"]} />
                          <Line type="monotone" dataKey="earned" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Referrals Placeholder */}
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p className="text-sm">No referrals yet. Share your link to get started!</p>
                </CardContent>
              </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Partner Program Highlights */}
          <div className="flex-1 rounded-xl border border-primary/10 bg-muted/40 p-6">
            <h2 className="text-lg font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
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
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                Affiliate Partner Login
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access your referral dashboard.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
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
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                Become an Affiliate Partner
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Join our referral program and earn commissions for every client you refer.
              </p>
            </div>
            <PartnerInfoForm onComplete={() => setView("dashboard")} />
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
