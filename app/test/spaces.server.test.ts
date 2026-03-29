import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockSend, mockGetSignedUrl } = vi.hoisted(() => ({
  mockSend: vi.fn().mockResolvedValue({}),
  mockGetSignedUrl: vi.fn().mockResolvedValue("https://spaces.example.com/presigned"),
}));

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: vi.fn().mockImplementation((params: object) => ({ input: params })),
  GetObjectCommand: vi.fn().mockImplementation((params: object) => ({ input: params })),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: mockGetSignedUrl,
}));

import { uploadFile, getPresignedUrl } from "~/lib/spaces.server";

describe("uploadFile", () => {
  beforeEach(() => {
    process.env.DO_SPACES_KEY = "test-key";
    process.env.DO_SPACES_SECRET = "test-secret";
    process.env.DO_SPACES_BUCKET = "fbs-docs";
    process.env.DO_SPACES_ENDPOINT = "https://nyc3.digitaloceanspaces.com";
    process.env.DO_SPACES_REGION = "nyc3";
    vi.clearAllMocks();
    mockSend.mockResolvedValue({});
    mockGetSignedUrl.mockResolvedValue("https://spaces.example.com/presigned");
  });

  afterEach(() => {
    delete process.env.DO_SPACES_KEY;
    delete process.env.DO_SPACES_SECRET;
    delete process.env.DO_SPACES_BUCKET;
    delete process.env.DO_SPACES_ENDPOINT;
    delete process.env.DO_SPACES_REGION;
  });

  it("uploads a buffer and returns a storage key", async () => {
    const key = await uploadFile({
      buffer: Buffer.from("hello"),
      fileName: "test.pdf",
      mimeType: "application/pdf",
    });

    expect(mockSend).toHaveBeenCalledOnce();
    expect(key).toMatch(/^uploads\/.+test\.pdf$/);
  });

  it("sanitises the file name in the key", async () => {
    const key = await uploadFile({
      buffer: Buffer.from("x"),
      fileName: "my file (1).pdf",
      mimeType: "application/pdf",
    });

    expect(key).not.toContain(" ");
    expect(key).not.toContain("(");
    expect(key).not.toContain(")");
  });

  it("throws if DO_SPACES_KEY is missing", async () => {
    delete process.env.DO_SPACES_KEY;
    await expect(
      uploadFile({ buffer: Buffer.from("x"), fileName: "x.pdf", mimeType: "application/pdf" })
    ).rejects.toThrow("DO_SPACES_KEY");
  });

  it("throws if DO_SPACES_SECRET is missing", async () => {
    delete process.env.DO_SPACES_SECRET;
    await expect(
      uploadFile({ buffer: Buffer.from("x"), fileName: "x.pdf", mimeType: "application/pdf" })
    ).rejects.toThrow("DO_SPACES_SECRET");
  });
});

describe("getPresignedUrl", () => {
  beforeEach(() => {
    process.env.DO_SPACES_KEY = "test-key";
    process.env.DO_SPACES_SECRET = "test-secret";
    process.env.DO_SPACES_BUCKET = "fbs-docs";
    process.env.DO_SPACES_ENDPOINT = "https://nyc3.digitaloceanspaces.com";
    process.env.DO_SPACES_REGION = "nyc3";
    vi.clearAllMocks();
    mockGetSignedUrl.mockResolvedValue("https://spaces.example.com/presigned");
  });

  afterEach(() => {
    delete process.env.DO_SPACES_KEY;
    delete process.env.DO_SPACES_SECRET;
    delete process.env.DO_SPACES_BUCKET;
    delete process.env.DO_SPACES_ENDPOINT;
    delete process.env.DO_SPACES_REGION;
  });

  it("returns a presigned URL for a given key", async () => {
    const url = await getPresignedUrl("uploads/123-test.pdf");

    expect(url).toBe("https://spaces.example.com/presigned");
    expect(mockGetSignedUrl).toHaveBeenCalledOnce();
  });

  it("uses 7-day expiry by default", async () => {
    await getPresignedUrl("uploads/123-test.pdf");

    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      { expiresIn: 604800 }
    );
  });

  it("accepts a custom expiry", async () => {
    await getPresignedUrl("uploads/123-test.pdf", 3600);

    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      { expiresIn: 3600 }
    );
  });
});
