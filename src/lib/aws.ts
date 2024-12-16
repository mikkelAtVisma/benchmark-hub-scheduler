import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = "benchmark-hub";
const REGION = "eu-central-1";

const getS3Client = () => {
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: "AKIAVMQRO3KCPUAVMK3L",
      secretAccessKey: "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"
    }
  });
};

export const uploadEntry = async (entry: any, filename: string) => {
  const s3Client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `entries/${filename}.json`,
    Body: JSON.stringify(entry),
    ContentType: "application/json"
  });

  await s3Client.send(command);
};

export const getLeaderboardEntries = async () => {
  const s3Client = getS3Client();
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: "entries/"
  });

  const response = await s3Client.send(command);
  if (!response.Contents) return [];

  const entries = await Promise.all(
    response.Contents.map(async (object) => {
      if (!object.Key) return null;

      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: object.Key
      });

      const response = await s3Client.send(getCommand);
      const str = await response.Body?.transformToString();
      if (!str) return null;

      return JSON.parse(str);
    })
  );

  return entries.filter(entry => entry !== null);
};