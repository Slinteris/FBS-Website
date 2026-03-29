import type { ActionFunctionArgs } from "react-router";
import { sendEmail } from "~/lib/brevo.server";
import { escapeHtml } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const employees = String(formData.get("employees") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !email) {
    return { success: false, intent: "quote", error: "Name and email are required." };
  }

  try {
    await sendEmail({
      subject: `Quote request from ${escapeHtml(firstName)} ${escapeHtml(lastName)} — ${escapeHtml(company)}`,
      htmlContent: `
        <h2>Quote Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
        <p><strong>Company:</strong> ${company ? escapeHtml(company) : "—"}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : "—"}</p>
        <p><strong>Employees:</strong> ${employees ? escapeHtml(employees) : "—"}</p>
        <p><strong>Message:</strong><br>${message ? escapeHtml(message) : "—"}</p>
      `,
      replyTo: { email, name: `${firstName} ${lastName}` },
    });
  } catch {
    return { success: false, intent: "quote", error: "Failed to send. Please try again." };
  }

  return { success: true, intent: "quote" };
}
