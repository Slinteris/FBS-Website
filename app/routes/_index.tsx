import { Button } from "~/components/ui/button";
import CobraLetterDialog from "~/components/CobraLetterDialog";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Shield,
  Users,
  FileText,
  Heart,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  Building2,
  Handshake,
  Award,
} from "lucide-react";
import mgbLogo from "~/assets/mgb-health-plan-logo.png";
import hneLogo from "~/assets/health-new-england-logo.png";
import bcbsLogo from "~/assets/bcbs-ma-logo.png";
import uhcLogo from "~/assets/united-hc-logo.jpg";
import cignaLogo from "~/assets/cigna-logo.png";
import hpLogo from "~/assets/harvard-pilgrim-logo.jpg";
import altusLogo from "~/assets/altus-dental-logo.png";
import guardianLogo from "~/assets/guardian-logo.png";
import aetnaLogo from "~/assets/aetna-logo.jpg";
import aflacLogo from "~/assets/aflac-logo.png";
import amGenLogo from "~/assets/american-general-logo.png";
import bostonMutualLogo from "~/assets/boston-mutual-logo.png";
import connecticareLogo from "~/assets/connecticare-logo.png";
import hartfordLogo from "~/assets/hartford-logo.png";
import metlifeLogo from "~/assets/metlife-logo.png";
import principalLogo from "~/assets/principal-logo.png";
import relianceLogo from "~/assets/reliance-std-logo.png";
import sunlifeLogo from "~/assets/sunlife-logo.png";

import heroBg from "~/assets/hero-bg.jpg";
import salHeadshot from "~/assets/sal-headshot.jpeg";
import { Form, Link, useActionData, useNavigation } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { sendEmail } from "~/lib/brevo.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "contact") {
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!firstName || !email) {
      return { success: false, intent: "contact", error: "Name and email are required." };
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

  return { success: false, error: "Unknown form intent." };
}

export const meta: MetaFunction = () => [
  { title: "Flexible Benefit Solutions Insurance Brokerage" },
  { name: "description", content: "Independent employee benefit insurance brokerage serving small & mid-size businesses." },
];

const services = [
  {
    icon: Heart,
    title: "Health, Dental & Vision",
    description:
      "Comprehensive HMO, PPO, EPO style medical plans, dental, and vision plans all tailored to your workforce needs and company budget.",
  },
  {
    icon: Shield,
    title: "Life & Disability",
    description:
      "Protect your employees with base level financial protection with group life, short-term, and long-term disability insurance coverage.  ",
  },
  {
    icon: TrendingUp,
    title: "Level Funded Medical ",
    description:
      "Great options for companies with healthy employee population.  Employers participate in low claim years with return of premium.",
  },
  {
    icon: Users,
    title: "Voluntary Benefits",
    description:
      "Accident, critical illness, hospital indemnity, and supplemental options employees love, and won't cost the company money.",
  },
];

const stats = [
  { value: "25+", label: "Years in Business" },
  { value: "40+", label: "Insurance Carriers" },
  { value: "50+", label: "Licensed States" },
  { value: "98%+", label: "Client Retention" },
];

const reasons = [
  "Personalized plan design & benefit strategy",
  "Dedicated account management team",
  "On-going Administration Support",
  "Employee enrollment & communication support",
  "Annual benchmarking & renewal strategy",
  "Claims advocacy & resolution",
];

const Index = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "contact";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden py-6 md:py-8">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex justify-end mb-2">
            <Link to="/affiliate" className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors underline-offset-2 hover:underline">
              Affiliate Partner Login
            </Link>
          </div>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 bg-secondary/15 text-secondary-foreground">
              <Handshake className="mr-1.5 h-3.5 w-3.5" />
              Trusted Employee Benefit Advisors
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
              Benefits that attract,{" "}
              <span className="text-primary">retain & protect</span> your employees
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We design cost-effective, employee benefit programs that
              keep your people happy and your business competitive — all backed by
              a dedicated "hands-on" full-service insurance professional.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/client-access">Client Access <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline">
                Who We Work With
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-end gap-3 md:mt-0 md:absolute md:bottom-8 md:right-6">
            <Button variant="secondary" size="lg" className="gap-2 shadow-lg" asChild>
              <Link to="/deduction-calculator">
                <TrendingUp className="h-4 w-4" />
                Benefit Payroll Deduction Calculator
              </Link>
            </Button>
            <CobraLetterDialog
              trigger={
                <Button variant="secondary" size="lg" className="gap-2 shadow-lg">
                  <FileText className="h-4 w-4" />
                  COBRA Letter
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary/80 py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-primary-foreground md:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-primary-foreground/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Products */}
      <section id="products" className="bg-card pt-24 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Our Products</Badge>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Comprehensive benefit products
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From group medical and dental to employee pay all voluntary plans, we
              find you and your employees the best coverage at the best price.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card
                key={service.title}
                className="group border-border/50 bg-background transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Carrier Logo Marquee */}
      <section className="bg-primary/90 py-4 overflow-hidden">
        <div className="flex animate-marquee gap-12 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 shrink-0">
              <img src={bcbsLogo} alt="Blue Cross Blue Shield of Massachusetts" className="h-12 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={uhcLogo} alt="UnitedHealthcare" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={cignaLogo} alt="Cigna" className="h-12 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={hpLogo} alt="Harvard Pilgrim Health Care" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={mgbLogo} alt="Mass General Brigham Health Plan" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={hneLogo} alt="Health New England" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={altusLogo} alt="Altus Dental" className="h-12 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={guardianLogo} alt="Guardian" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={aetnaLogo} alt="Aetna" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={aflacLogo} alt="Aflac" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={amGenLogo} alt="American General" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={bostonMutualLogo} alt="Boston Mutual" className="h-12 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={connecticareLogo} alt="ConnectiCare" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={hartfordLogo} alt="The Hartford" className="h-12 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={metlifeLogo} alt="MetLife" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={principalLogo} alt="Principal Financial Group" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={relianceLogo} alt="Reliance Standard" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
              <img src={sunlifeLogo} alt="Sun Life Financial" className="h-10 object-contain rounded bg-white/90 px-3 py-1" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Our Services</Badge>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              How we help your business
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Beyond great products, we provide hands-on support to make managing your benefits effortless.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: "Plan Set Up & Installation", description: "We will draft and deliver new business paperwork on your behalf that will achieve: Fast underwriting, Quick approval." },
              { icon: CheckCircle, title: "Plan Design & Benefit Strategy", description: null },
              { icon: Users, title: "Employee Enrollment Support", description: null },
              { icon: Shield, title: "On-going Administration Support", description: "We provide On-going support: New Hire Enrollment, Employee Updates, ID card requests, Employee Terminations, Claim Resolution, State & Federal Compliance, ACA / HIRD / ERISA." },
            ].map((item) => (
              <Card key={item.title} className="group border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {item.title === "Plan Set Up & Installation" ? (
                      <>Plan Set Up &<br />Installation</>
                    ) : item.title === "Plan Design & Benefit Strategy" ? (
                      <>Plan Design &<br />Benefit Strategy</>
                    ) : item.title}
                  </h3>
                  {item.title === "Employee Enrollment Support" ? (
                    <div className="text-sm leading-relaxed text-muted-foreground">
                      <p>We provide Initial and Open Enrollment Support with custom Employee Communications. You choose what Enrollment method best suits your needs:</p>
                      <ul className="mt-2 list-disc space-y-1 pl-4">
                        <li>In-Person Paper</li>
                        <li>Web Enrollment</li>
                        <li>Data Transfers</li>
                      </ul>
                    </div>
                  ) : item.title === "Plan Set Up & Installation" ? (
                    <div className="text-sm leading-relaxed text-muted-foreground">
                      <p>We will draft and deliver new business paperwork on your behalf that will achieve:</p>
                      <ul className="mt-2 list-disc space-y-1 pl-4">
                        <li>Fast underwriting</li>
                        <li>Quick approval</li>
                        <li>Accurate billing</li>
                      </ul>
                    </div>
                  ) : item.title === "Plan Design & Benefit Strategy" ? (
                    <div className="text-sm leading-relaxed text-muted-foreground">
                      <p>Important factors we look at:</p>
                      <ul className="mt-2 list-disc space-y-1 pl-4">

                        <li>Plan Benefits</li>
                        <li>Deductibles & Copays</li>
                        <li>Provider Networks</li>
                        <li>Employee Population</li>
                        <li>Contribution Strategy</li>
                        <li>Define Employee Eligibility</li>
                      </ul>
                    </div>
                  ) : item.title === "On-going Administration Support" ? (
                    <div className="text-sm leading-relaxed text-muted-foreground">
                      <ul className="list-disc space-y-1 pl-4">
                        <li>New Hire Enrollment</li>
                        <li>Employee Updates</li>
                        <li>ID Card Requests</li>
                        <li>Employee Terminations</li>
                        <li>Claim Resolution</li>
                        <li>State & Federal Compliance</li>
                        <li>ACA / HIRD / ERISA</li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                A broker that works <span className="text-primary">for you</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                As an independent brokerage, we represent your interests — not an
                insurance carrier's. That means unbiased advice, broader market
                access, and solutions built around your cost and benefit goals.
              </p>
              <ul className="mt-8 space-y-4">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, title: "Independent", desc: "Access to 40+ carriers" },
                { icon: Award, title: "Dept of Insurance", desc: "Licensed in all 50 States" },
                { icon: Users, title: "Customer Service", desc: "Dedicated Support Contact" },
                { icon: Handshake, title: "No Cost", desc: "We're paid by the carrier" },
              ].map((item) => (
                <Card key={item.title} className="border-border/50 bg-card">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section id="who-we-work-with" className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">Who We Work With</Badge>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Industries & employers we serve
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From startups to established organizations, we partner with employers across a wide range of industries to deliver benefits that make a difference.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Building2, title: "Small & Mid-Size Businesses", desc: "Tailored plans for companies with 2–500+ employees looking to compete for top talent." },
              { icon: Users, title: "Professional Services", desc: "Law firms, accounting practices, consulting groups, and other professional organizations." },
              { icon: Heart, title: "Healthcare & Nonprofits", desc: "Mission-driven organizations that need competitive benefits on lean budgets." },
              { icon: TrendingUp, title: "Technology & Startups", desc: "Fast-growing companies that need scalable benefits to attract and retain engineers and creators." },
              { icon: Award, title: "Manufacturing & Trades", desc: "Skilled workforce employers who value robust health and disability coverage." },
              { icon: Handshake, title: "Hospitality & Retail", desc: "High-turnover industries that benefit from flexible, easy-to-administer plans." },
            ].map((item) => (
              <Card key={item.title} className="group border-border/50 bg-background transition-all hover:border-primary/30 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to elevate your employee benefits?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Let's start with a no-obligation benefits review. We'll benchmark
            your current plan, identify savings, and show you what's possible.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <a href="#contact"><Phone className="h-4 w-4" /> Call Us Today</a>
            </Button>
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <a href="#contact">Request a Proposal</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-4">Contact Us</Badge>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Let's talk benefits
              </h2>
              <p className="mt-4 text-muted-foreground">
                Whether you're shopping for a new plan or looking to optimize
                what you have, our team is ready to help.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={salHeadshot}
                    alt="Steven A. Linteris"
                    className="h-16 w-16 rounded-full border-2 border-primary/20 object-cover"
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Contact</p>
                    <p className="font-semibold text-foreground">Steven A. Linteris, Principal/Broker</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</p>
                    <p className="font-semibold text-foreground">(978) 465-0121</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">sal@fbsinsurance.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Office</p>
                    <p className="font-semibold text-foreground">61 Pleasant Street, Newburyport MA 01950</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-8">
                <h3 className="mb-6 text-xl font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Request a Free Consultation
                </h3>
                <Form method="post" className="space-y-4">
                  <input type="hidden" name="intent" value="contact" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="firstName"
                      placeholder="First name"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      name="lastName"
                      placeholder="Last name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <input
                    name="company"
                    placeholder="Company name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <textarea
                    name="message"
                    placeholder="Tell us about your current benefits or what you're looking for..."
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />

                  {actionData?.success && actionData.intent === "contact" && (
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
