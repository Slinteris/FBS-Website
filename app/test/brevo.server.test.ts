import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendTransacEmail = vi.fn().mockResolvedValue({});

vi.mock("@getbrevo/brevo", () => ({
  BrevoClient: vi.fn().mockImplementation(() => ({
    transactionalEmails: { sendTransacEmail },
  })),
}));

import { sendEmail } from "~/lib/brevo.server";

describe("sendEmail", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-key";
    process.env.NOTIFICATION_EMAIL = "team@fbsinsurance.com";
    vi.clearAllMocks();
    sendTransacEmail.mockResolvedValue({});
  });

  afterEach(() => {
    delete process.env.BREVO_API_KEY;
    delete process.env.NOTIFICATION_EMAIL;
  });

  it("sends an email with subject and htmlContent", async () => {
    await sendEmail({
      subject: "New contact form submission",
      htmlContent: "<p>Hello</p>",
    });

    expect(sendTransacEmail).toHaveBeenCalledOnce();
    expect(sendTransacEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "New contact form submission",
        htmlContent: "<p>Hello</p>",
        to: [{ email: "team@fbsinsurance.com" }],
        sender: { name: "FBS Website", email: "noreply@fbsinsurance.com" },
      })
    );
  });

  it("appends attachment names to htmlContent when provided", async () => {
    await sendEmail({
      subject: "Quote request",
      htmlContent: "<p>Quote details</p>",
      attachmentNames: ["census.pdf", "current-plan.xlsx"],
    });

    expect(sendTransacEmail).toHaveBeenCalledOnce();
    const callArg = sendTransacEmail.mock.calls[0][0] as { htmlContent: string };
    expect(callArg.htmlContent).toContain("census.pdf");
    expect(callArg.htmlContent).toContain("current-plan.xlsx");
  });

  it("sets replyTo when provided", async () => {
    await sendEmail({
      subject: "Test",
      htmlContent: "<p>Test</p>",
      replyTo: { email: "user@example.com", name: "Test User" },
    });

    expect(sendTransacEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: { email: "user@example.com", name: "Test User" },
      })
    );
  });

  it("throws if BREVO_API_KEY is missing", async () => {
    delete process.env.BREVO_API_KEY;
    await expect(
      sendEmail({ subject: "Test", htmlContent: "<p>Test</p>" })
    ).rejects.toThrow("BREVO_API_KEY");
  });

  it("throws if NOTIFICATION_EMAIL is missing", async () => {
    delete process.env.NOTIFICATION_EMAIL;
    await expect(
      sendEmail({ subject: "Test", htmlContent: "<p>Test</p>" })
    ).rejects.toThrow("NOTIFICATION_EMAIL");
  });
});
