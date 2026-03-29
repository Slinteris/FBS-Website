import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { FileDown } from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import { useToast } from "~/hooks/use-toast";
import { generateIntakePdf } from "~/lib/generateIntakePdf";

export const meta: MetaFunction = () => [{ title: "Client Intake — FBS" }];

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  dob: string;
  ssn: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  // Company Info
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyPhone: string;
  companyContact: string;
  // Employment
  jobTitle: string;
  employeeCount: string;
  annualIncome: string;
  // Medical Premiums
  premiumSingle: string;
  premiumCouple: string;
  premiumEeChildren: string;
  premiumFamily: string;
  coverageEndDate: string;
  // Checkboxes
  currentlyInsured: boolean;
  cobraEligible: boolean;
  interestedDental: boolean;
  interestedVision: boolean;
  interestedLife: boolean;
  interestedDisability: boolean;
}

const defaultForm: FormData = {
  firstName: "", lastName: "", dob: "", ssn: "",
  address: "", city: "", state: "", zip: "", phone: "", email: "",
  companyName: "", companyAddress: "", companyCity: "", companyState: "",
  companyZip: "", companyPhone: "", companyContact: "",
  jobTitle: "", employeeCount: "", annualIncome: "",
  premiumSingle: "", premiumCouple: "", premiumEeChildren: "", premiumFamily: "",
  coverageEndDate: "",
  currentlyInsured: false, cobraEligible: false,
  interestedDental: false, interestedVision: false,
  interestedLife: false, interestedDisability: false,
};

const ClientIntake = () => {
  const [form, setForm] = useState<FormData>(defaultForm);
  const { toast } = useToast();

  const update = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = () => {
    if (!form.firstName || !form.lastName) {
      toast({ title: "Missing info", description: "Please enter at least a first and last name.", variant: "destructive" });
      return;
    }
    generateIntakePdf(form);
    toast({ title: "PDF Generated", description: "Your client intake document has been downloaded." });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Client Intake Form
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Complete the form below and generate a PDF document with all the details.
        </p>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Personal Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="ssn">SSN (last 4)</Label>
                <Input id="ssn" maxLength={4} value={form.ssn} onChange={(e) => update("ssn", e.target.value)} placeholder="XXXX" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input id="zip" value={form.zip} onChange={(e) => update("zip", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Company Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input id="companyAddress" value={form.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="companyCity">City</Label>
                <Input id="companyCity" value={form.companyCity} onChange={(e) => update("companyCity", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="companyState">State</Label>
                <Input id="companyState" value={form.companyState} onChange={(e) => update("companyState", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="companyZip">Zip Code</Label>
                <Input id="companyZip" value={form.companyZip} onChange={(e) => update("companyZip", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input id="companyPhone" type="tel" value={form.companyPhone} onChange={(e) => update("companyPhone", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="companyContact">Company Contact Person</Label>
                <Input id="companyContact" value={form.companyContact} onChange={(e) => update("companyContact", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Employment Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="employeeCount">Number of Employees</Label>
                <Input id="employeeCount" type="number" value={form.employeeCount} onChange={(e) => update("employeeCount", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="annualIncome">Annual Income</Label>
                <Input id="annualIncome" value={form.annualIncome} onChange={(e) => update("annualIncome", e.target.value)} placeholder="$" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Premiums */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Current Medical Premiums
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="premiumSingle">Single</Label>
                <Input id="premiumSingle" value={form.premiumSingle} onChange={(e) => update("premiumSingle", e.target.value)} placeholder="$" />
              </div>
              <div>
                <Label htmlFor="premiumCouple">Couple</Label>
                <Input id="premiumCouple" value={form.premiumCouple} onChange={(e) => update("premiumCouple", e.target.value)} placeholder="$" />
              </div>
              <div>
                <Label htmlFor="premiumEeChildren">EE & Child(ren)</Label>
                <Input id="premiumEeChildren" value={form.premiumEeChildren} onChange={(e) => update("premiumEeChildren", e.target.value)} placeholder="$" />
              </div>
              <div>
                <Label htmlFor="premiumFamily">Family</Label>
                <Input id="premiumFamily" value={form.premiumFamily} onChange={(e) => update("premiumFamily", e.target.value)} placeholder="$" />
              </div>
              <div>
                <Label htmlFor="coverageEndDate">Date Coverage Will End</Label>
                <Input id="coverageEndDate" type="date" value={form.coverageEndDate} onChange={(e) => update("coverageEndDate", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coverage Interest Checkboxes */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Additional Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                ["currentlyInsured", "Currently Insured"],
                ["cobraEligible", "COBRA Eligible"],
                ["interestedDental", "Interested in Dental"],
                ["interestedVision", "Interested in Vision"],
                ["interestedLife", "Interested in Life Insurance"],
                ["interestedDisability", "Interested in Disability"],
              ] as [keyof FormData, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={form[key] as boolean}
                    onCheckedChange={(checked) => update(key, !!checked)}
                  />
                  <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleGenerate} size="lg" className="w-full gap-2">
          <FileDown className="h-5 w-5" /> Generate & Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ClientIntake;
