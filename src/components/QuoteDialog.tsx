import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface QuoteDialogProps {
  trigger: React.ReactNode;
}

const QuoteDialog = ({ trigger }: QuoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Quote request submitted! We'll be in touch shortly.");
    setFiles([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Get a Quote
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Fill out the form below and upload any relevant documents. We'll get back to you as soon as possible to discuss.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="q-first">First name</Label>
              <Input id="q-first" placeholder="First name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-last">Last name</Label>
              <Input id="q-last" placeholder="Last name" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-company">Company name</Label>
            <Input id="q-company" placeholder="Company name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-email">Email address</Label>
            <Input id="q-email" type="email" placeholder="Email address" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-phone">Phone number</Label>
            <Input id="q-phone" type="tel" placeholder="Phone number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-employees">Number of employees</Label>
            <Input id="q-employees" type="number" placeholder="e.g. 25" min="1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-message">Tell us about your needs</Label>
            <Textarea
              id="q-message"
              placeholder="Current benefits, what you're looking for, renewal date, etc."
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Documents</Label>
            <p className="text-xs text-muted-foreground">
              Census data, current plan summaries, renewal letters, etc.
            </p>
            <div
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Click to upload files
              </span>
              <span className="text-xs text-muted-foreground/60">
                PDF, DOC, XLS, CSV up to 10MB each
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileChange}
            />

            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate text-sm">{file.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Submit Quote Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
