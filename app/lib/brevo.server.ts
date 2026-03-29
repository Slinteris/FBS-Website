import { BrevoClient } from "@getbrevo/brevo";

interface SendEmailOptions {
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string } | string;
  attachmentNames?: string[];
}

export async function sendEmail({ subject, htmlContent, replyTo, attachmentNames }: SendEmailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!apiKey) throw new Error("BREVO_API_KEY environment variable is not set");
  if (!notificationEmail) throw new Error("NOTIFICATION_EMAIL environment variable is not set");

  const client = new BrevoClient({ apiKey });

  let finalHtml = htmlContent;
  if (attachmentNames && attachmentNames.length > 0) {
    finalHtml += `<p><strong>Attached files:</strong> ${attachmentNames.join(", ")}</p>`;
  }

  const replyToObj =
    typeof replyTo === "string"
      ? { email: replyTo }
      : replyTo;

  await client.transactionalEmails.sendTransacEmail({
    sender: { name: "FBS Website", email: "noreply@fbsinsurance.com" },
    to: [{ email: notificationEmail }],
    subject,
    htmlContent: finalHtml,
    ...(replyToObj ? { replyTo: replyToObj } : {}),
  });
}
