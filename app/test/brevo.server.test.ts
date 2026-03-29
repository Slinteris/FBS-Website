import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Brevo SDK before importing the module under test
vi.mock("@getbrevo/brevo", () => {
  const sendTransacEmail = vi.fn().mockResolvedValue({ response: { statusCode: 201 } });
  const setApiKey = vi.fn();
  return {
    TransactionalEmailsApi: vi.fn().mockImplementation(() => ({ setApiKey, sendTransacEmail })),
    TransactionalEmailsApiApiKeys: { apiKey: "apiKey" },
    SendSmtpEmail: vi.fn().mockImplementation((data) => data),
  };
});

import { sendEmail } from "~/lib/brevo.server";

describe("sendEmail", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-key";
    process.env.NOTIFICATION_EMAIL = "team@fbsinsurance.com";
    vi.clearAllMocks();
  });

  it("sends an email with subject and htmlContent", async () => {
    const { TransactionalEmailsApi } = await import("@getbrevo/brevo");
    const mockInstance = new (TransactionalEmailsApi as any)();

    await sendEmail({
      subject: "New contact form submission",
      htmlContent: "<p>Hello</p>",
    });

    expect(mockInstance.sendTransacEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "New contact form submission",
        htmlContent: "<p>Hello</p>",
        to: [{ email: "team@fbsinsurance.com" }],
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
