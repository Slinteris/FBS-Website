import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Lock,
  FileText,
  BarChart3,
  Users,
  ClipboardList,
  ShieldCheck,
  Building2,
  User,
  DollarSign,
  Heart,
  CalendarCheck,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import fbsLogo from "~/assets/fbs-logo.gif";

export const meta: MetaFunction = () => [{ title: "Client Access — FBS" }];

const employerFeatures = [
  { icon: FileText, text: "View & download policy documents and certificates" },
  { icon: Users, text: "Manage employee enrollment and changes" },
  { icon: ClipboardList, text: "Review benefit plan summaries and comparisons" },
  { icon: ShieldCheck, text: "Track compliance deadlines and requirements" },
];

const employeeFeatures = [
  { icon: Heart, text: "View your health, dental & vision plan details" },
  { icon: FileText, text: "Download your benefit summary and ID cards" },
  { icon: CalendarCheck, text: "Check enrollment status and coverage dates" },
  { icon: Users, text: "View and update your dependents" },
  { icon: DollarSign, text: "Access pay stub deductions and contribution info" },
  { icon: HelpCircle, text: "Submit questions and request support" },
];

const LoginCard = ({
  title,
  icon: Icon,
  description,
  features,
  accentColor,
}: {
  title: string;
  icon: React.ElementType;
  description: string;
  features: { icon: React.ElementType; text: string }[];
  accentColor: string;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col">
      <Card className="border-2 flex-1">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h2
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {title}
            </h2>
          </div>

          <form className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Email / Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or username"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-input" />
                Remember me
              </label>
              <a href="#" className="font-medium text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Button type="button" className="w-full" disabled>
              Login — Coming Soon
            </Button>
          </form>

          <div className="mt-4 border-t pt-3 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/#contact" className="font-semibold text-primary hover:underline">
                Request Access
              </Link>
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="mt-5 rounded-xl bg-primary/5 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {description}
            </p>
            <ul className="space-y-2.5">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <feature.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ClientAccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Client Access
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to your secure portal to manage your benefits, view documents, and more.
          </p>
        </div>

        {/* Two Login Cards Side by Side */}
        <div className="grid gap-8 lg:grid-cols-2">
          <LoginCard
            title="Employer Administrators"
            icon={Building2}
            description="Employer Portal Includes"
            features={employerFeatures}
            accentColor="bg-primary/10 text-primary"
          />
          <LoginCard
            title="Employees"
            icon={User}
            description="Employee Portal Includes"
            features={employeeFeatures}
            accentColor="bg-accent/10 text-accent"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientAccess;
