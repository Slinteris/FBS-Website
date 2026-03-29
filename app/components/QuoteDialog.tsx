import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useFetcher } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Upload, FileText, X } from "lucide-react";

interface QuoteDialogProps {
  trigger: ReactNode;
}

export function QuoteDialog({ trigger }: QuoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher<{ success: boolean; intent: string; error?: string }>();

  const isSubmitting = fetcher.state === "submitting";

  // Close dialog on successful submission (with delay so user sees success message)
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.intent === "quote") {
      const timer = setTimeout(() => {
        setOpen(false);
        formRef.current?.reset();
        setFiles([]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [fetcher.data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    files.forEach((file) => formData.append("attachments", file));
    fetcher.submit(formData, {
      method: "post",
      action: "/",
      encType: "multipart/form-data",
    });
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
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input type="hidden" name="intent" value="quote" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="q-first">First name</Label>
              <Input id="q-first" name="firstName" placeholder="First name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-last">Last name</Label>
              <Input id="q-last" name="lastName" placeholder="Last name" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-company">Company name</Label>
            <Input id="q-company" name="company" placeholder="Company name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-email">Email address</Label>
            <Input id="q-email" name="email" type="email" placeholder="Email address" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-phone">Phone number</Label>
            <Input id="q-phone" name="phone" type="tel" placeholder="Phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-employees">Number of employees</Label>
            <Input id="q-employees" name="employees" type="number" placeholder="e.g. 25" min="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-message">Tell us about your needs</Label>
            <Textarea id="q-message" name="message" placeholder="Current benefits, renewal date, etc." rows={3} />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Documents (optional)</Label>
            <p className="text-xs text-muted-foreground">Census data, current plan summaries, renewal letters — up to 10 MB each.</p>
            <div
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Click to upload files</span>
              <span className="text-xs text-muted-foreground/60">PDF, DOC, XLS, CSV up to 10MB each</span>
            </div>
            <input ref={fileInputRef} type="file" multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg"
              className="hidden" onChange={handleFileChange} />
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((file, i) => (
                  <div key={`${file.name}-${i}`} className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate text-sm">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)} className="ml-2 shrink-0 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {fetcher.data?.intent === "quote" && fetcher.data.success && (
            <p className="text-sm text-green-600">Quote request sent! We'll be in touch shortly.</p>
          )}
          {fetcher.data?.intent === "quote" && !fetcher.data.success && fetcher.data.error && (
            <p className="text-sm text-red-600">{fetcher.data.error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Submit Quote Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
