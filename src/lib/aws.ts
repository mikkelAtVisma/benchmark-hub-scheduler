import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

export const uploadToS3 = async (file: File, filename: string): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME || "",
      Key: filename,
      Body: file,
      ContentType: file.type,
    });

    await s3Client.send(command);
    return `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};