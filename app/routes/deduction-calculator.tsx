import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "~/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Calculator, ArrowLeft, User, Mail, Printer } from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import fbsLogo from "~/assets/fbs-logo.gif";

export const meta: MetaFunction = () => [{ title: "Deduction Calculator — FBS" }];

type ContributionMode = "percentage" | "flat";

interface BenefitTier {
  tier: string;
  monthlyPremium: number;
  employerContribution: number;
  mode: ContributionMode;
}

interface BenefitCategory {
  name: string;
  tiers: BenefitTier[];
}

const defaultBenefits: BenefitCategory[] = [
  {
    name: "Medical",
    tiers: [
      { tier: "Employee Only", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Employee & Spouse", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Employee & Child(ren)", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Family", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
    ],
  },
  {
    name: "Dental",
    tiers: [
      { tier: "Employee Only", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Employee & Spouse", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Employee & Child(ren)", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Family", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
    ],
  },
  {
    name: "Vision",
    tiers: [
      { tier: "Employee Only", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Employee & Spouse", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Employee & Child(ren)", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
      { tier: "Family", monthlyPremium: 0, employerContribution: 0, mode: "percentage" },
    ],
  },
];

const payPeriodOptions = [
  { value: "12", label: "12 — Monthly" },
  { value: "24", label: "24 — Bi-Monthly" },
  { value: "26", label: "26 — Bi-Weekly" },
  { value: "52", label: "52 — Weekly" },
];
// Numeric input that formats on blur, allows free typing while focused
function NumericInput({ value, onChange, decimals = 2, className }: {
  value: number;
  onChange: (val: string) => void;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(decimals > 0 ? value.toFixed(decimals) : String(Math.ceil(value)));
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focused) {
      setDisplay(decimals > 0 ? value.toFixed(decimals) : String(Math.ceil(value)));
    }
  }, [value, focused, decimals]);

  return (
    <Input
      ref={ref}
      type="number"
      step={decimals > 0 ? "0.01" : "1"}
      value={display}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setDisplay(decimals > 0 ? value.toFixed(decimals) : String(Math.ceil(value)));
      }}
      onChange={(e) => {
        setDisplay(e.target.value);
        onChange(e.target.value);
      }}
      className={className}
    />
  );
}


function AccessGate({ onAccess }: { onAccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setNameError("");
    setEmailError("");
    if (!name.trim()) { setNameError("Please enter your name."); valid = false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) { setEmailError("Please enter a valid email address."); valid = false; }
    if (valid) onAccess();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Calculator className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Benefit Payroll Deduction Calculator</CardTitle>
          <CardDescription className="text-base">Enter your information below to access the calculator tool.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="gate-name" className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Full Name</Label>
              <Input id="gate-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              {nameError && <p className="text-sm text-destructive">{nameError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gate-email" className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Email Address</Label>
              <Input id="gate-email" type="email" placeholder="john@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full gap-2"><Calculator className="h-4 w-4" /> Access Calculator</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DeductionCalculator() {
  const [hasAccess, setHasAccess] = useState(false);
  const [payPeriods, setPayPeriods] = useState("26");
  const [benefits, setBenefits] = useState<BenefitCategory[]>(defaultBenefits);

  const periods = parseInt(payPeriods);

  const updateTier = (catIdx: number, tierIdx: number, updates: Partial<BenefitTier>) => {
    setBenefits((prev) =>
      prev.map((cat, ci) =>
        ci === catIdx
          ? { ...cat, tiers: cat.tiers.map((t, ti) => (ti === tierIdx ? { ...t, ...updates } : t)) }
          : cat
      )
    );
  };

  const handleFieldChange = (catIdx: number, tierIdx: number, field: string, value: string) => {
    const num = parseFloat(value) || 0;
    const tier = benefits[catIdx].tiers[tierIdx];

    switch (field) {
      case "monthlyPremium":
        updateTier(catIdx, tierIdx, { monthlyPremium: num });
        break;
      case "employerContribution":
        updateTier(catIdx, tierIdx, { employerContribution: num });
        break;
      case "employerPct": {
        const empContrib = (tier.monthlyPremium * num) / 100;
        updateTier(catIdx, tierIdx, { employerContribution: Math.round(empContrib * 100) / 100 });
        break;
      }
      case "employeeContribution": {
        const newEmployer = tier.monthlyPremium - num;
        updateTier(catIdx, tierIdx, { employerContribution: Math.max(0, Math.round(newEmployer * 100) / 100) });
        break;
      }
      case "employeePct": {
        const empContrib2 = tier.monthlyPremium * (1 - num / 100);
        updateTier(catIdx, tierIdx, { employerContribution: Math.max(0, Math.round(empContrib2 * 100) / 100) });
        break;
      }
      case "perPaycheck": {
        const employeeMonthly = (num * periods) / 12;
        const newEmployer2 = tier.monthlyPremium - employeeMonthly;
        updateTier(catIdx, tierIdx, { employerContribution: Math.max(0, Math.round(newEmployer2 * 100) / 100) });
        break;
      }
    }
  };

  if (!hasAccess) {
    return <AccessGate onAccess={() => setHasAccess(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Benefit Payroll Deduction Calculator</h1>
          </div>
          <Link to="/">
            <Button variant="secondary" size="sm" className="gap-1"><ArrowLeft className="h-4 w-4" /> Home</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Pay Period Selection */}
        <Card>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-lg">Payroll Pay Periods</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="flex items-center justify-between">
              <div className="max-w-xs space-y-1">
                <Label className="text-primary font-bold text-base">Number of Pay Periods Per Year</Label>
                <Select value={payPeriods} onValueChange={setPayPeriods}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {payPeriodOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img src={fbsLogo} alt="Flexible Benefit Solutions logo" className="h-12 object-contain" />
                <a href="mailto:info@flexiblebenefit.com">
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <Mail className="h-3 w-3" /> Need Help? Contact Us
                  </Button>
                </a>
                <a href="tel:978-465-0121" className="text-base font-bold text-muted-foreground hover:text-primary transition-colors w-full text-center">978-465-0121</a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefit Tables */}
        {benefits.map((category, catIdx) => (
          <Card key={category.name}>
            <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
              <CardTitle className="text-lg">{category.name} Payroll Deductions</CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => window.print()} variant="outline" size="sm" className="gap-1">
                  <Printer className="h-3.5 w-3.5" /> Print Summary
                </Button>
                <Button onClick={() => {
                  const payLabel = payPeriodOptions.find(o => o.value === payPeriods)?.label || payPeriods;
                  const subject = encodeURIComponent(`Benefit Payroll Deductions Summary`);
                  let emailBody = `BENEFIT PAYROLL DEDUCTIONS SUMMARY\n`;
                  emailBody += `Pay Periods Per Year: ${payLabel}\n\n`;
                  benefits.forEach(cat => {
                    const title = `${cat.name.toUpperCase()} PAYROLL DEDUCTIONS`;
                    emailBody += `${title}\n${'_'.repeat(title.length)}\n\n`;
                    cat.tiers.forEach(t => {
                      const empContrib = Math.max(0, t.monthlyPremium - t.employerContribution);
                      const employerPct = t.monthlyPremium > 0 ? Math.ceil((t.employerContribution / t.monthlyPremium) * 100) : 0;
                      const employeePct = t.monthlyPremium > 0 ? Math.ceil((empContrib / t.monthlyPremium) * 100) : 0;
                      const perPay = ((empContrib * 12) / periods).toFixed(2);
                      emailBody += `  ${t.tier}\n`;
                      emailBody += `    Monthly Premium:      $${t.monthlyPremium.toFixed(2)}\n`;
                      emailBody += `    Employer Contribution: $${t.employerContribution.toFixed(2)} (${employerPct}%)\n`;
                      emailBody += `    Employee Contribution: $${empContrib.toFixed(2)} (${employeePct}%)\n`;
                      emailBody += `    Per Paycheck Deduction: $${perPay}\n\n`;
                    });
                  });
                  emailBody += `This calculator provides estimates only. Actual deductions may vary based on your employer's plan.`;
                  window.open(`mailto:?subject=${subject}&body=${encodeURIComponent(emailBody)}`);
                }} variant="outline" size="sm" className="gap-1">
                  <Mail className="h-3.5 w-3.5" /> Email Summary
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto py-2 px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px] align-bottom">Coverage<br />Tier</TableHead>
                    <TableHead className="text-center min-w-[110px] align-bottom">Calculation<br />Mode</TableHead>
                    <TableHead className="text-right min-w-[110px] align-bottom">Monthly<br />Premium</TableHead>
                    <TableHead className="text-right min-w-[110px] align-bottom">Employer<br />Contribution $</TableHead>
                    <TableHead className="text-right min-w-[90px] align-bottom">Employer<br />%</TableHead>
                    <TableHead className="text-right min-w-[110px] align-bottom">Employee<br />Contribution $</TableHead>
                    <TableHead className="text-right min-w-[90px] align-bottom">Employee<br />%</TableHead>
                    <TableHead className="text-right min-w-[110px] align-bottom">Per Paycheck<br />Deduction<br /><span className="text-xs font-normal text-muted-foreground">({payPeriods} periods)</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.tiers.map((tier, tierIdx) => {
                    const employeeContribution = Math.max(0, tier.monthlyPremium - tier.employerContribution);
                    const employerPct = tier.monthlyPremium > 0 ? (tier.employerContribution / tier.monthlyPremium) * 100 : 0;
                    const employeePct = tier.monthlyPremium > 0 ? (employeeContribution / tier.monthlyPremium) * 100 : 0;
                    const perPaycheck = (employeeContribution * 12) / periods;
                    const isFlat = tier.mode === "flat";
                    const isOverLimit = tier.employerContribution > tier.monthlyPremium;

                    return (
                        <TableRow key={tier.tier}>
                        <TableCell className="font-medium">{tier.tier}</TableCell>
                        <TableCell className="text-center">
                          <Select value={tier.mode} onValueChange={(val: ContributionMode) => updateTier(catIdx, tierIdx, { mode: val })}>
                            <SelectTrigger className="w-28 h-8 text-xs mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="flat">Flat Amount</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <NumericInput value={tier.monthlyPremium}
                            onChange={(val) => handleFieldChange(catIdx, tierIdx, "monthlyPremium", val)}
                            className="w-24 h-8 text-sm text-right ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <NumericInput value={tier.employerContribution}
                            onChange={(val) => handleFieldChange(catIdx, tierIdx, "employerContribution", val)}
                            className="w-24 h-8 text-sm text-right ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          {isFlat ? (
                            <span className="text-sm text-muted-foreground">{Math.ceil(employerPct)}%</span>
                          ) : (
                            <NumericInput value={employerPct} decimals={0}
                              onChange={(val) => handleFieldChange(catIdx, tierIdx, "employerPct", val)}
                              className="w-20 h-8 text-sm text-right ml-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <NumericInput value={employeeContribution}
                            onChange={(val) => handleFieldChange(catIdx, tierIdx, "employeeContribution", val)}
                            className="w-24 h-8 text-sm text-right ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          {isFlat ? (
                            <span className="text-sm text-muted-foreground">{Math.ceil(employeePct)}%</span>
                          ) : (
                            <NumericInput value={employeePct} decimals={0}
                              onChange={(val) => handleFieldChange(catIdx, tierIdx, "employeePct", val)}
                              className="w-20 h-8 text-sm text-right ml-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isOverLimit ? (
                            <span className="text-sm font-semibold text-destructive">Error</span>
                          ) : (
                            <NumericInput value={perPaycheck}
                              onChange={(val) => handleFieldChange(catIdx, tierIdx, "perPaycheck", val)}
                              className="w-24 h-8 text-sm text-right ml-auto font-semibold text-primary" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        <p className="text-xs text-center text-muted-foreground pb-8">
          This calculator provides estimates only. Actual deductions may vary based on your employer's plan.
        </p>
      </div>
    </div>
  );
}
