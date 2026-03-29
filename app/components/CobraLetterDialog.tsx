import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { FileText } from "lucide-react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

interface CobraLetterDialogProps {
  trigger: React.ReactNode;
}

const CobraLetterDialog = ({ trigger }: CobraLetterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const canProceed = name.trim() && email.trim() && agreed;

  const handleProceed = () => {
    if (!canProceed) return;
    setOpen(false);
    navigate("/cobra-letter", {
      state: { prefill: { employerName: name, employerEmail: email, employerState: state } },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            COBRA Letter Information
          </DialogTitle>
          <DialogDescription>
            Please provide your company information before creating a COBRA letter.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div>
            <Label htmlFor="cobra-name">Your Name *</Label>
            <Input
              id="cobra-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label htmlFor="cobra-email">Email *</Label>
            <Input
              id="cobra-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor="cobra-state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-3 rounded-md border border-border bg-muted/50 p-3">
            <Checkbox
              id="cobra-disclaimer"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-0.5"
            />
            <Label htmlFor="cobra-disclaimer" className="text-xs leading-relaxed font-normal cursor-pointer">
              I acknowledge that this COBRA letter is drafted from the Model Notice found on the
              U.S. Department of Labor website and should be used for illustrative purposes only.
              FBS Insurance Brokerage, Inc. shares no responsibility for the use of this letter.
              Please refer to legal counsel with questions or concerns.
            </Label>
          </div>
        </div>

        <Button onClick={handleProceed} disabled={!canProceed} className="w-full gap-2">
          <FileText className="h-4 w-4" /> Continue to COBRA Letter
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CobraLetterDialog;
