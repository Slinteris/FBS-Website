import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getClient(): S3Client {
  const key = process.env.DO_SPACES_KEY;
  const secret = process.env.DO_SPACES_SECRET;
  const endpoint = process.env.DO_SPACES_ENDPOINT;
  const region = process.env.DO_SPACES_REGION ?? "us-east-1";

  if (!key) throw new Error("DO_SPACES_KEY environment variable is not set");
  if (!secret) throw new Error("DO_SPACES_SECRET environment variable is not set");
  if (!endpoint) throw new Error("DO_SPACES_ENDPOINT environment variable is not set");

  return new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId: key, secretAccessKey: secret },
    forcePathStyle: false,
  });
}

function getBucket(): string {
  const bucket = process.env.DO_SPACES_BUCKET;
  if (!bucket) throw new Error("DO_SPACES_BUCKET environment variable is not set");
  return bucket;
}

interface UploadFileOptions {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}

export async function uploadFile({ buffer, fileName, mimeType }: UploadFileOptions): Promise<string> {
  const client = getClient();
  const bucket = getBucket();
  const sanitised = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `uploads/${Date.now()}-${sanitised}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: "private",
    })
  );

  return key;
}

export async function getPresignedUrl(key: string, expiresInSeconds = 60 * 60 * 24 * 7): Promise<string> {
  const client = getClient();
  const bucket = getBucket();

  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expiresInSeconds }
  );
}
