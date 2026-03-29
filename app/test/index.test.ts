import { describe, it, expect, vi, afterEach } from "vitest";
import type { ActionFunctionArgs } from "react-router";
import { action } from "../routes/_index";

// Hoist mock references so they're available inside vi.mock factory
const mockSendEmail = vi.hoisted(() => vi.fn());

vi.mock("~/lib/brevo.server", () => ({
  sendEmail: mockSendEmail,
}));

function makeArgs(formData: FormData): ActionFunctionArgs {
  return {
    request: new Request("http://localhost/", { method: "POST", body: formData }),
    params: {},
    context: {},
  } as ActionFunctionArgs;
}

describe("action – contact intent", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends email and returns success", async () => {
    mockSendEmail.mockResolvedValueOnce(undefined);
    const formData = new FormData();
    formData.set("intent", "contact");
    formData.set("firstName", "John");
    formData.set("email", "john@example.com");
    formData.set("message", "Hello");
    const result = await action(makeArgs(formData));
    expect(mockSendEmail).toHaveBeenCalledOnce();
    expect(result).toEqual({ success: true, intent: "contact" });
  });

  it("returns error when email fails", async () => {
    mockSendEmail.mockRejectedValueOnce(new Error("API down"));
    const formData = new FormData();
    formData.set("intent", "contact");
    formData.set("firstName", "John");
    formData.set("email", "john@example.com");
    const result = await action(makeArgs(formData));
    expect(result).toMatchObject({ success: false, intent: "contact" });
  });

  it("returns error when firstName is missing", async () => {
    const formData = new FormData();
    formData.set("intent", "contact");
    formData.set("email", "john@example.com");
    const result = await action(makeArgs(formData));
    expect(result).toMatchObject({ success: false, intent: "contact" });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("returns error when email is missing", async () => {
    const formData = new FormData();
    formData.set("intent", "contact");
    formData.set("firstName", "John");
    const result = await action(makeArgs(formData));
    expect(result).toMatchObject({ success: false, intent: "contact" });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});

describe("action – quote intent", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends email and returns success", async () => {
    mockSendEmail.mockResolvedValueOnce(undefined);
    const formData = new FormData();
    formData.set("intent", "quote");
    formData.set("firstName", "Jane");
    formData.set("lastName", "Smith");
    formData.set("company", "Acme");
    formData.set("email", "jane@acme.com");
    formData.set("phone", "555-1234");
    formData.set("employees", "50");
    formData.set("message", "Need group benefits");
    const result = await action(makeArgs(formData));
    expect(mockSendEmail).toHaveBeenCalledOnce();
    expect(result).toEqual({ success: true, intent: "quote" });
  });

  it("returns error when email fails", async () => {
    mockSendEmail.mockRejectedValueOnce(new Error("API down"));
    const formData = new FormData();
    formData.set("intent", "quote");
    formData.set("firstName", "Jane");
    formData.set("email", "jane@acme.com");
    const result = await action(makeArgs(formData));
    expect(result).toMatchObject({ success: false, intent: "quote" });
  });

  it("returns error when firstName is missing", async () => {
    const formData = new FormData();
    formData.set("intent", "quote");
    formData.set("email", "jane@acme.com");
    const result = await action(makeArgs(formData));
    expect(result).toMatchObject({ success: false, intent: "quote" });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("returns error when email is missing", async () => {
    const formData = new FormData();
    formData.set("intent", "quote");
    formData.set("firstName", "Jane");
    const result = await action(makeArgs(formData));
    expect(result).toMatchObject({ success: false, intent: "quote" });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
