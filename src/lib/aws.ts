import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


// Only use these values for local development and testing
const DEV_ACCESS_KEY = "AKIAYZXPSXXWKUZ6Z74D";
const DEV_SECRET_KEY = "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";
const DEV_BUCKET = "test-bucket-benchmark-upload";

const s3Client = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: DEV_ACCESS_KEY,
    secretAccessKey: DEV_SECRET_KEY,
  },
});

export const uploadToS3 = async (file: File, filename: string): Promise<string> => {
  try {
    const bucketName = DEV_BUCKET;
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: file,
      ContentType: file.type,
    });

    await s3Client.send(command);
    return `https://${bucketName}.s3.amazonaws.com/${filename}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};