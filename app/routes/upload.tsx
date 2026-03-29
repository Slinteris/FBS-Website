import { useState, useRef, useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Card, CardContent } from "~/components/ui/card";
import { Upload, FileText, X, Lock } from "lucide-react";
import { toast } from "sonner";
import { uploadFile, getPresignedUrl } from "~/lib/spaces.server";
import { sendEmail } from "~/lib/brevo.server";

export const meta: MetaFunction = () => [{ title: "Secure Document Upload — FBS" }];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const documents = formData.getAll("documents") as File[];

  if (!firstName || !email) {
    return { success: false, error: "Name and email are required." };
  }
  if (documents.length === 0 || documents.every((f) => f.size === 0)) {
    return { success: false, error: "Please upload at least one document." };
  }

  try {
    // Upload each file to DO Spaces and collect presigned URLs
    const uploadedLinks: string[] = [];
    for (const file of documents) {
      if (file.size === 0) continue;
      if (file.size > MAX_BYTES) {
        return { success: false, error: `File "${escapeHtml(file.name)}" exceeds the 10 MB limit.` };
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = await uploadFile({ buffer, fileName: file.name, mimeType: file.type || "application/octet-stream" });
      const url = await getPresignedUrl(key);
      uploadedLinks.push(`<li><a href="${url}">${escapeHtml(file.name)}</a> (link valid 7 days)</li>`);
    }

    await sendEmail({
      subject: `Document upload from ${firstName} ${lastName} — ${company}`,
      htmlContent: `
        <h2>Secure Document Upload</h2>
        <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${message ? `<p><strong>Message:</strong><br>${escapeHtml(message)}</p>` : ""}
        <p><strong>Documents:</strong></p>
        <ul>${uploadedLinks.join("")}</ul>
      `,
      replyTo: { email, name: `${firstName} ${lastName}` },
    });
    return { success: true };
  } catch (err) {
    console.error("Upload action failed:", err);
    return { success: false, error: "Something went wrong. Please try again or contact us directly." };
  }
}

const UploadDocuments = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.success) setFiles([]);
  }, [actionData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const oversized = newFiles.filter((f) => f.size > MAX_BYTES);
      if (oversized.length) {
        toast.error("Some files exceed the 10 MB limit and were not added.");
        const valid = newFiles.filter((f) => f.size <= MAX_BYTES);
        setFiles((prev) => [...prev, ...valid]);
      } else {
        setFiles((prev) => [...prev, ...newFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Sync the files state back to the file input before RR v7 reads the form
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      fileInputRef.current.files = dt.files;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* Title */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Secure Document Upload
          </h1>
          <p className="mt-3 text-muted-foreground">
            Upload sensitive documents safely. Files are transmitted securely and sent directly to our team for review.
          </p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6 sm:p-8">
            <Form
              method="post"
              encType="multipart/form-data"
              className="space-y-6"
              onSubmit={handleFormSubmit}
            >
              {/* Contact Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="u-first">First name</Label>
                  <Input id="u-first" name="firstName" placeholder="First name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="u-last">Last name</Label>
                  <Input id="u-last" name="lastName" placeholder="Last name" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="u-company">Company name</Label>
                <Input id="u-company" name="company" placeholder="Company name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="u-email">Email address</Label>
                <Input id="u-email" name="email" type="email" placeholder="Email address" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="u-message">Message (optional)</Label>
                <Textarea
                  id="u-message"
                  name="message"
                  placeholder="Describe the documents you're uploading or any special instructions."
                  rows={3}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload Documents</Label>
                <p className="text-xs text-muted-foreground">
                  Employee Enrollment Forms, Census Data, Payroll Documents, etc. Max 10 MB each.
                </p>
                <div
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50 hover:bg-muted/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Click to select files
                  </span>
                  <span className="text-xs text-muted-foreground/60">
                    PDF, DOC, XLS, CSV, images — up to 10 MB each
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="documents"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
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

              {actionData?.success && (
                <p className="text-sm font-medium text-accent">
                  Documents submitted securely! We'll review them shortly.
                </p>
              )}
              {actionData?.error && (
                <p className="text-sm font-medium text-destructive">{actionData.error}</p>
              )}

              <p className="text-center text-sm font-semibold text-muted-foreground">
                <Lock className="mr-1 inline h-4 w-4" />
                Your documents are encrypted in transit and handled with strict confidentiality.
              </p>

              <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Uploading…" : (
                  <><Lock className="h-4 w-4" /> Submit Documents Securely</>
                )}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadDocuments;
