import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { CheckCircle2, Building2 } from "lucide-react";

interface PartnerInfoFormProps {
  onComplete: () => void;
}

const PartnerInfoForm = ({ onComplete }: PartnerInfoFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Info
    businessName: "",
    businessType: "",
    ein: "",
    payCompensationTo: "",
    partnerName: "",
    partnerEmail: "",
    cellPhone: "",
    officePhone: "",
    partnerTitle: "",
    yearsInBusiness: "",
    businessAddress: "",
    city: "",
    state: "",
    zip: "",
    // Contact Info
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    // Partnership Details
    servicesOffered: "",
    targetMarket: "",
    currentClients: "",
    referralMethod: "",
    expectedReferrals: "",
    // Payment Info
    payableTo: "",
    paymentMethod: "",
    additionalNotes: "",
  });

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — will connect to backend later
    onComplete();
  };

  const totalSteps = 4;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h2
            className="text-xl font-bold text-foreground"
          >
            Partner Profile Setup
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete your partner profile so we can best support your referral
          business.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i + 1 <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground mb-1">
                  Partner Information
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Step 1 of {totalSteps}
                </p>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Business / Company Name
                  </label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    placeholder="ABC Financial Services"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Business Type
                  </label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(v) => update("businessType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpa">CPA / Accounting Firm</SelectItem>
                      <SelectItem value="tax-prep">
                        Tax Preparation Service
                      </SelectItem>
                      <SelectItem value="financial-advisor">
                        Financial Advisor
                      </SelectItem>
                      <SelectItem value="insurance">Insurance Agency</SelectItem>
                      <SelectItem value="business-consultant">Business Consultant</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Tax ID / SS#
                    </label>
                    <Input
                      value={formData.ein}
                      onChange={(e) => update("ein", e.target.value)}
                      placeholder=""
                    />
                  </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Pay Compensation to:
                  </label>
                  <Select
                    value={formData.payCompensationTo}
                    onValueChange={(v) => update("payCompensationTo", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="company-tax-id" className="pl-2">Pay to Company Tax ID #</SelectItem>
                      <SelectItem value="social-security" className="pl-2">Pay to Social Security #</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      value={formData.partnerName}
                      onChange={(e) => update("partnerName", e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Title
                    </label>
                    <Input
                      value={formData.partnerTitle}
                      onChange={(e) => update("partnerTitle", e.target.value)}
                      placeholder="e.g. Managing Partner"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.partnerEmail}
                    onChange={(e) => update("partnerEmail", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Cell Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.cellPhone}
                      onChange={(e) => update("cellPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Office Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.officePhone}
                      onChange={(e) => update("officePhone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Business Address
                  </label>
                  <Input
                    value={formData.businessAddress}
                    onChange={(e) => update("businessAddress", e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      City
                    </label>
                    <Input
                      value={formData.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      State
                    </label>
                    <Input
                      value={formData.state}
                      onChange={(e) => update("state", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      ZIP
                    </label>
                    <Input
                      value={formData.zip}
                      onChange={(e) => update("zip", e.target.value)}
                      placeholder="ZIP"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground mb-1">
                  Primary Contact
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Step 2 of {totalSteps}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => update("contactName", e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Title / Role
                    </label>
                    <Input
                      value={formData.contactTitle}
                      onChange={(e) => update("contactTitle", e.target.value)}
                      placeholder="Managing Partner"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => update("contactEmail", e.target.value)}
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => update("contactPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground mb-1">
                  Partnership Details
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Step 3 of {totalSteps}
                </p>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Services You Currently Offer
                  </label>
                  <Textarea
                    value={formData.servicesOffered}
                    onChange={(e) => update("servicesOffered", e.target.value)}
                    placeholder="e.g. Tax preparation, bookkeeping, financial planning..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Target Market / Client Base
                  </label>
                  <Input
                    value={formData.targetMarket}
                    onChange={(e) => update("targetMarket", e.target.value)}
                    placeholder="e.g. Small businesses, high-net-worth individuals"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Approximate Number of Active Clients
                  </label>
                  <Input
                    value={formData.currentClients}
                    onChange={(e) => update("currentClients", e.target.value)}
                    placeholder="e.g. 50-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    How Will You Refer Clients?
                  </label>
                  <Select
                    value={formData.referralMethod}
                    onValueChange={(v) => update("referralMethod", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct referral / introduction</SelectItem>
                      <SelectItem value="website">Link on my website</SelectItem>
                      <SelectItem value="email">Email campaigns</SelectItem>
                      <SelectItem value="social">Social media</SelectItem>
                      <SelectItem value="multiple">Multiple methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Expected Monthly Referrals
                  </label>
                  <Input
                    value={formData.expectedReferrals}
                    onChange={(e) => update("expectedReferrals", e.target.value)}
                    placeholder="e.g. 5-10"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground mb-1">
                  Payment & Additional Info
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Step 4 of {totalSteps}
                </p>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Payable To (Name or Business)
                  </label>
                  <Input
                    value={formData.payableTo}
                    onChange={(e) => update("payableTo", e.target.value)}
                    placeholder="Business name or individual name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Preferred Payment Method
                  </label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(v) => update("paymentMethod", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ach">ACH / Direct Deposit</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="venmo">Venmo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Additional Notes (optional)
                  </label>
                  <Textarea
                    value={formData.additionalNotes}
                    onChange={(e) => update("additionalNotes", e.target.value)}
                    placeholder="Anything else you'd like us to know..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < totalSteps ? (
                <Button type="button" onClick={() => setStep((s) => s + 1)}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Submit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerInfoForm;
