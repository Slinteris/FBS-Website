import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Shield,
  Users,
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
  Quote,
} from "lucide-react";
import { QuoteDialog } from "~/components/QuoteDialog";
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
import { escapeHtml } from "~/lib/utils";

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

    try {
      await sendEmail({
        subject: `New consultation request from ${escapeHtml(firstName)} ${escapeHtml(lastName)}`,
        htmlContent: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
        <p><strong>Company:</strong> ${company ? escapeHtml(company) : "—"}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : "—"}</p>
        <p><strong>Message:</strong><br>${message ? escapeHtml(message) : "—"}</p>
      `,
        replyTo: { email, name: `${firstName} ${lastName}` },
      });
    } catch {
      return { success: false, intent: "contact", error: "Failed to send. Please try again." };
    }

    return { success: true, intent: "contact" };
  }

  return { success: false, error: "Unknown form intent." };
}

export const meta: MetaFunction = () => [
  { title: "Flexible Benefit Solutions Insurance Brokerage" },
  { name: "description", content: "Independent employee benefit insurance brokerage serving small & mid-size businesses in Newburyport, MA. Health, dental, vision, life & disability plans for companies with 2–500+ employees." },
  { tagName: "link", rel: "canonical", href: "https://www.fbsinsurance.com/" },
  {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "InsuranceAgency",
      name: "Flexible Benefit Solutions Insurance Brokerage, Inc.",
      url: "https://www.fbsinsurance.com",
      telephone: "+19784650121",
      email: "sal@fbsinsurance.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "61 Pleasant Street",
        addressLocality: "Newburyport",
        addressRegion: "MA",
        postalCode: "01950",
        addressCountry: "US",
      },
      description: "Independent employee benefit insurance brokerage serving small & mid-size businesses.",
      areaServed: "US",
      priceRange: "Free consultation",
    },
  },
];

const products = [
  {
    icon: Heart,
    title: "Health, Dental & Vision",
    description:
      "Comprehensive HMO, PPO, EPO medical plans plus dental and vision — tailored to your workforce and budget.",
  },
  {
    icon: Shield,
    title: "Life & Disability",
    description:
      "Group life, short-term and long-term disability coverage to protect your employees financially.",
  },
  {
    icon: TrendingUp,
    title: "Level Funded Medical",
    description:
      "Ideal for healthy employee populations. Employers participate in low claim years with return of premium.",
  },
  {
    icon: Users,
    title: "Voluntary Benefits",
    description:
      "Accident, critical illness, hospital indemnity, and supplemental options — at no cost to the company.",
  },
];

const reasons = [
  "Personalized plan design & benefit strategy",
  "Dedicated account management",
  "Plan setup, installation & underwriting",
  "Employee enrollment & communication support",
  "On-going administration & compliance (ACA, HIRD, ERISA)",
  "Claims advocacy & resolution",
];

// TODO: Replace with real client testimonials
const testimonials = [
  {
    quote: "Sal and his team made switching our benefits provider completely painless. We saved 15% on our premiums without sacrificing coverage.",
    name: "Client Name",
    company: "Company Name",
  },
  {
    quote: "Having a dedicated broker who actually picks up the phone when we have a question has been a game-changer for our HR team.",
    name: "Client Name",
    company: "Company Name",
  },
  {
    quote: "FBS handled everything from plan design to employee enrollment. Their expertise in level-funded plans saved us thousands.",
    name: "Client Name",
    company: "Company Name",
  },
];

const Index = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "contact";

  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCta(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/75" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Benefits that attract, retain & protect your employees
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              For over 25 years, we've helped small and mid-size businesses design
              cost-effective benefit programs — with access to 40+ carriers
              and hands-on, full-service support.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <QuoteDialog
                trigger={
                  <Button size="lg" className="gap-2">
                    Get a Free Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                }
              />
              <Button size="lg" variant="outline" className="gap-2 bg-background/50" asChild>
                <a href="tel:978-465-0121">
                  <Phone className="h-4 w-4" /> (978) 465-0121
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Carrier Logo Marquee */}
      <section className="bg-primary/90 py-4 overflow-hidden">
        <div className="flex animate-marquee gap-12 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 shrink-0">
              <img src={bcbsLogo} alt="Blue Cross Blue Shield of Massachusetts" className="h-12 object-contain rounded bg-white/90 px-3 py-1" width={120} height={48} loading="lazy" />
              <img src={uhcLogo} alt="UnitedHealthcare" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={cignaLogo} alt="Cigna" className="h-12 object-contain rounded bg-white/90 px-3 py-1" width={120} height={48} loading="lazy" />
              <img src={hpLogo} alt="Harvard Pilgrim Health Care" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={mgbLogo} alt="Mass General Brigham Health Plan" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={hneLogo} alt="Health New England" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={altusLogo} alt="Altus Dental" className="h-12 object-contain rounded bg-white/90 px-3 py-1" width={120} height={48} loading="lazy" />
              <img src={guardianLogo} alt="Guardian" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={aetnaLogo} alt="Aetna" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={aflacLogo} alt="Aflac" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={amGenLogo} alt="American General" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={bostonMutualLogo} alt="Boston Mutual" className="h-12 object-contain rounded bg-white/90 px-3 py-1" width={120} height={48} loading="lazy" />
              <img src={connecticareLogo} alt="ConnectiCare" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={hartfordLogo} alt="The Hartford" className="h-12 object-contain rounded bg-white/90 px-3 py-1" width={120} height={48} loading="lazy" />
              <img src={metlifeLogo} alt="MetLife" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={principalLogo} alt="Principal Financial Group" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={relianceLogo} alt="Reliance Standard" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
              <img src={sunlifeLogo} alt="Sun Life Financial" className="h-10 object-contain rounded bg-white/90 px-3 py-1" width={100} height={40} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Comprehensive benefit products
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From group medical and dental to voluntary plans, we find the
              best coverage at the best price.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card
                key={product.title}
                className="group border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <product.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold font-body text-foreground">
                    {product.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                A broker that works <span className="text-primary">for you</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                As an independent brokerage, we represent your interests — not a
                carrier's. That means unbiased advice, broader market
                access, and solutions built around your goals.
              </p>
              <ul className="mt-8 space-y-4">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm font-medium text-foreground">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>
              <blockquote className="mt-8 border-l-4 border-secondary pl-6">
                <p className="text-lg font-medium italic text-foreground/80">
                  "We don't just sell insurance — we manage your entire benefits program."
                </p>
              </blockquote>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, title: "Independent", desc: "Access to 40+ carriers" },
                { icon: Award, title: "Licensed", desc: "All 50 states" },
                { icon: Users, title: "Full Service", desc: "Dedicated support contact" },
                { icon: Handshake, title: "No Cost", desc: "We're paid by the carrier" },
              ].map((item) => (
                <Card key={item.title} className="border-border/50 bg-background">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold font-body text-foreground">
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

      {/* About */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2 flex justify-center">
              <img
                src={salHeadshot}
                alt="Steven A. Linteris"
                className="w-full max-w-xs rounded-2xl object-cover aspect-[4/5] shadow-lg"
              />
            </div>
            <div className="lg:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
                Meet Your Broker
              </p>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
                Steven A. Linteris
              </h2>
              <p className="mt-1 text-lg text-muted-foreground">
                Principal & Broker
              </p>
              {/* TODO: Replace with Sal's actual bio */}
              <p className="mt-6 leading-relaxed text-muted-foreground">
                With over 25 years in employee benefits, Sal founded Flexible Benefit
                Solutions on a simple principle: every business deserves a broker who
                puts their interests first. As an independent brokerage, we're not tied
                to any single carrier — which means you get unbiased advice and access
                to the best plans on the market.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                From plan design to claims resolution, Sal and his team provide the kind
                of hands-on, personal service that larger firms simply can't match.
                That's why our client retention rate exceeds 98%.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="outline" className="gap-2" asChild>
                  <a href="tel:978-465-0121"><Phone className="h-4 w-4" /> (978) 465-0121</a>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <a href="mailto:sal@fbsinsurance.com"><Mail className="h-4 w-4" /> sal@fbsinsurance.com</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
            What our clients say
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {/* TODO: Replace placeholder testimonials with real client quotes */}
            {testimonials.map((t, i) => (
              <div key={i} className="relative">
                <Quote className="absolute -top-3 -left-2 h-10 w-10 text-secondary/40" />
                <blockquote className="pl-8 text-base leading-relaxed text-foreground/80 italic">
                  {t.quote}
                </blockquote>
                <div className="mt-4 pl-8">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-secondary-foreground md:text-4xl">
            Ready to elevate your employee benefits?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-secondary-foreground/80">
            Start with a no-obligation benefits review. We'll benchmark
            your current plan, identify savings, and show you what's possible.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <QuoteDialog
              trigger={
                <Button size="lg" className="gap-2 h-14 px-10 text-base bg-white text-secondary hover:bg-white/90">
                  Request a Free Quote
                </Button>
              }
            />
            <Button size="lg" className="gap-2 h-14 px-10 text-base border-2 border-white bg-transparent text-white hover:bg-white/10" asChild>
              <a href="tel:978-465-0121"><Phone className="h-5 w-5" /> (978) 465-0121</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Let's talk benefits
              </h2>
              <p className="mt-4 text-muted-foreground">
                Whether you're shopping for a new plan or optimizing
                what you have, we're ready to help.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={salHeadshot}
                    alt="Steven A. Linteris"
                    className="h-14 w-14 rounded-full border-2 border-primary/20 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Steven A. Linteris</p>
                    <p className="text-sm text-muted-foreground">Principal / Broker</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</p>
                    <a href="tel:978-465-0121" className="font-semibold text-foreground hover:text-primary transition-colors">(978) 465-0121</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                    <a href="mailto:sal@fbsinsurance.com" className="font-semibold text-foreground hover:text-primary transition-colors">sal@fbsinsurance.com</a>
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
                <h3 className="mb-6 text-xl font-bold font-body text-foreground">
                  Request a Free Consultation
                </h3>
                <Form method="post" className="space-y-4">
                  <input type="hidden" name="intent" value="contact" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="c-first">First name</Label>
                      <Input id="c-first" name="firstName" placeholder="First name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-last">Last name</Label>
                      <Input id="c-last" name="lastName" placeholder="Last name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-company">Company name</Label>
                    <Input id="c-company" name="company" placeholder="Company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-email">Email address</Label>
                    <Input id="c-email" name="email" type="email" placeholder="Email address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-phone">Phone number</Label>
                    <Input id="c-phone" name="phone" type="tel" placeholder="Phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-message">Message</Label>
                    <Textarea
                      id="c-message"
                      name="message"
                      placeholder="Tell us about your current benefits or what you're looking for..."
                      rows={4}
                    />
                  </div>

                  {actionData?.success && actionData.intent === "contact" && (
                    <p className="text-sm font-medium text-secondary">
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

      {/* Floating CTA */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          showFloatingCta
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <QuoteDialog
          trigger={
            <Button size="lg" className="rounded-full shadow-xl h-12 px-6 gap-2">
              Get a Quote <ArrowRight className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default Index;
