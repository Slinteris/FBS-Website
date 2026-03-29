import * as Brevo from "@getbrevo/brevo";

interface SendEmailOptions {
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
  attachmentNames?: string[];
}

export async function sendEmail({ subject, htmlContent, replyTo, attachmentNames }: SendEmailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!apiKey) throw new Error("BREVO_API_KEY environment variable is not set");
  if (!notificationEmail) throw new Error("NOTIFICATION_EMAIL environment variable is not set");

  const api = new Brevo.TransactionalEmailsApi();
  api.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

  const email = new Brevo.SendSmtpEmail();
  email.sender = { name: "FBS Website", email: "noreply@fbsinsurance.com" };
  email.to = [{ email: notificationEmail }];
  email.subject = subject;

  let finalHtml = htmlContent;
  if (attachmentNames && attachmentNames.length > 0) {
    finalHtml += `<p><strong>Attached files:</strong> ${attachmentNames.join(", ")}</p>`;
  }
  email.htmlContent = finalHtml;

  if (replyTo) email.replyTo = replyTo;

  await api.sendTransacEmail(email);
}
