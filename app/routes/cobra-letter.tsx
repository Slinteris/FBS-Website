import { useState } from "react";
import { useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { FileDown } from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import { toast } from "sonner";
import { generateCobraLetterPdf, CobraLetterData } from "~/lib/generateCobraLetterPdf";

export const meta: MetaFunction = () => [
  { title: "COBRA Letter Generator — FBS" },
  { name: "robots", content: "noindex" },
];

const today = new Date().toISOString().split("T")[0];

const defaultForm: CobraLetterData = {
  letterDate: today,
  employerName: "", employerAddress: "", employerCity: "", employerState: "",
  employerZip: "", employerPhone: "", employerContact: "", employerEin: "",
  planName: "", planAdminName: "", planAdminPhone: "",
  employeeName: "", employeeAddress: "", employeeCity: "", employeeState: "", employeeZip: "",
  qualifyingEvent: "", eventDate: "", coverageEndDate: "",
  cobraDurationMonths: "18", coverageType: "", monthlyPremium: "", adminFee: "", totalMonthlyCost: "",
  electionDeadline: "", paymentDeadline: "",
  dependentNames: "",
};

const qualifyingEvents = [
  "Voluntary termination of employment",
  "Involuntary termination of employment",
  "Reduction in work hours",
  "Divorce or legal separation",
  "Death of covered employee",
  "Dependent child aging out of coverage",
  "Medicare entitlement",
];

const CobraLetter = () => {
  const location = useLocation();
  const prefill = (location.state as any)?.prefill;
  const [form, setForm] = useState<CobraLetterData>({
    ...defaultForm,
    ...(prefill ? {
      employerName: prefill.employerName || "",
      employerAddress: prefill.employerAddress || "",
      employerCity: prefill.employerCity || "",
      employerState: prefill.employerState || "",
      employerZip: prefill.employerZip || "",
    } : {}),
  });
  const [noAdminFee, setNoAdminFee] = useState(false);


  const update = (field: keyof CobraLetterData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "coverageEndDate" && value) {
        const d = new Date(value);
        d.setDate(d.getDate() + 60);
        next.electionDeadline = d.toISOString().split("T")[0];
      }
      if (field === "employerName") {
        next.planName = value.trim() ? `${value.trim()} Group Health Plan` : "";
      }
      return next;
    });
  };

  const fmtMoney = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const recalcFees = (rawPremium: string, skipFee: boolean) => {
    const premium = parseFloat(rawPremium.replace(/[^0-9.]/g, "")) || 0;
    const fee = skipFee ? 0 : Math.round(premium * 0.02 * 100) / 100;
    const total = Math.round((premium + fee) * 100) / 100;
    return {
      adminFee: fee > 0 ? fmtMoney(fee) : "",
      totalMonthlyCost: total > 0 ? fmtMoney(total) : "",
    };
  };

  const handlePremiumChange = (val: string) => {
    const raw = val.replace(/[^0-9.]/g, "");
    const fees = recalcFees(raw, noAdminFee);
    setForm((prev) => ({ ...prev, monthlyPremium: raw, ...fees }));
  };

  const handlePremiumBlur = () => {
    const raw = form.monthlyPremium.replace(/[^0-9.]/g, "");
    if (raw) {
      const premium = parseFloat(raw) || 0;
      setForm((prev) => ({ ...prev, monthlyPremium: fmtMoney(premium) }));
    }
  };

  const handleGenerate = () => {
    if (!form.employeeName || !form.coverageType) {
      toast.error("Please enter the employee name and select a coverage type.");
      return;
    }
    generateCobraLetterPdf(form);
    toast.success("Your COBRA letter has been downloaded.");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          COBRA Continuation Coverage Notice
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Fill out the details below to generate a COBRA general notice letter as a PDF.
        </p>

        {/* Employer / Plan Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Employer & Plan Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="letterDate">Letter Date</Label>
                <Input id="letterDate" type="date" value={form.letterDate} onChange={(e) => update("letterDate", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="employerName">Employer Name *</Label>
                <Input id="employerName" value={form.employerName} onChange={(e) => update("employerName", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="employerAddress">Employer Address</Label>
                <Input id="employerAddress" value={form.employerAddress} onChange={(e) => update("employerAddress", e.target.value)} />
              </div>
              <div><Label htmlFor="employerCity">City</Label><Input id="employerCity" value={form.employerCity} onChange={(e) => update("employerCity", e.target.value)} /></div>
              <div><Label htmlFor="employerState">State</Label><Input id="employerState" value={form.employerState} onChange={(e) => update("employerState", e.target.value)} /></div>
              <div><Label htmlFor="employerZip">Zip</Label><Input id="employerZip" value={form.employerZip} onChange={(e) => update("employerZip", e.target.value)} /></div>
              <div><Label htmlFor="employerPhone">Phone</Label><Input id="employerPhone" type="tel" value={form.employerPhone} onChange={(e) => update("employerPhone", e.target.value)} /></div>
              <div><Label htmlFor="employerContact">Contact Person</Label><Input id="employerContact" value={form.employerContact} onChange={(e) => update("employerContact", e.target.value)} /></div>
              <div className="sm:col-span-2"><Label htmlFor="planName">Plan Name</Label><Input id="planName" value={form.planName} onChange={(e) => update("planName", e.target.value)} placeholder="e.g. ABC Company Group Health Plan" /></div>
              <div><Label htmlFor="planAdminName">Plan Administrator Name</Label><Input id="planAdminName" value={form.planAdminName} onChange={(e) => update("planAdminName", e.target.value)} /></div>
              <div><Label htmlFor="planAdminPhone">Plan Administrator Phone</Label><Input id="planAdminPhone" type="tel" value={form.planAdminPhone} onChange={(e) => update("planAdminPhone", e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Employee Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label htmlFor="employeeName">Employee Full Name *</Label><Input id="employeeName" value={form.employeeName} onChange={(e) => update("employeeName", e.target.value)} /></div>
              <div className="sm:col-span-2"><Label htmlFor="employeeAddress">Address</Label><Input id="employeeAddress" value={form.employeeAddress} onChange={(e) => update("employeeAddress", e.target.value)} /></div>
              <div><Label htmlFor="employeeCity">City</Label><Input id="employeeCity" value={form.employeeCity} onChange={(e) => update("employeeCity", e.target.value)} /></div>
              <div><Label htmlFor="employeeState">State</Label><Input id="employeeState" value={form.employeeState} onChange={(e) => update("employeeState", e.target.value)} /></div>
              <div><Label htmlFor="employeeZip">Zip</Label><Input id="employeeZip" value={form.employeeZip} onChange={(e) => update("employeeZip", e.target.value)} /></div>
              <div className="sm:col-span-2"><Label htmlFor="dependentNames">Qualified Beneficiaries (dependents) - Optional</Label><Input id="dependentNames" value={form.dependentNames} onChange={(e) => update("dependentNames", e.target.value)} placeholder="e.g. Jane Smith, John Smith Jr." /></div>
            </div>
          </CardContent>
        </Card>

        {/* Qualifying Event */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Qualifying Event
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="qualifyingEvent">Type of Qualifying Event</Label>
                <Select value={form.qualifyingEvent} onValueChange={(v) => update("qualifyingEvent", v)}>
                  <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                  <SelectContent>
                    {qualifyingEvents.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="eventDate">Date of Event</Label><Input id="eventDate" type="date" value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)} /></div>
              <div><Label htmlFor="coverageEndDate">Coverage End Date</Label><Input id="coverageEndDate" type="date" value={form.coverageEndDate} onChange={(e) => update("coverageEndDate", e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        {/* Coverage Costs */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              COBRA Coverage Costs & Deadlines
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="cobraDurationMonths">Duration (months)</Label>
                <Select value={form.cobraDurationMonths} onValueChange={(v) => update("cobraDurationMonths", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18">18 months</SelectItem>
                    <SelectItem value="29">29 months (disability)</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="coverageType">Coverage Type</Label>
                <Select value={form.coverageType} onValueChange={(v) => update("coverageType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select coverage" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Couple">Couple</SelectItem>
                    <SelectItem value="Single & Child(ren)">Single & Child(ren)</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="monthlyPremium">Monthly Premium ($)</Label><Input id="monthlyPremium" value={form.monthlyPremium} onChange={(e) => handlePremiumChange(e.target.value)} onBlur={handlePremiumBlur} placeholder="Enter amount" /></div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="adminFee">Admin Fee (2%)</Label>
                  <div className="flex items-center gap-1.5">
                    <Checkbox id="noAdminFee" checked={noAdminFee} onCheckedChange={(v) => {
                      const skip = v === true;
                      setNoAdminFee(skip);
                      const fees = recalcFees(form.monthlyPremium, skip);
                      setForm((prev) => ({ ...prev, ...fees }));
                    }} />
                    <Label htmlFor="noAdminFee" className="text-xs font-normal cursor-pointer">No Admin Fee</Label>
                  </div>
                </div>
                <Input id="adminFee" value={form.adminFee} readOnly className="bg-muted" />
              </div>
              <div><Label htmlFor="totalMonthlyCost">Total Monthly Cost</Label><Input id="totalMonthlyCost" value={form.totalMonthlyCost} readOnly className="bg-muted" /></div>
              <div><Label htmlFor="electionDeadline" className="text-xs">Election Deadline (60 Days from Coverage End Date)</Label><Input id="electionDeadline" type="date" value={form.electionDeadline} onChange={(e) => update("electionDeadline", e.target.value)} /></div>
              <div><Label htmlFor="paymentDeadline">Initial Payment Deadline</Label><Input id="paymentDeadline" type="date" value={form.paymentDeadline} onChange={(e) => update("paymentDeadline", e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleGenerate} size="lg" className="w-full gap-2">
          <FileDown className="h-5 w-5" /> Generate & Download COBRA Letter
        </Button>
      </div>
    </div>
  );
};

export default CobraLetter;
