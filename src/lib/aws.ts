import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
  region: "us-east-1", // Replace with your region
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY", // Replace with your access key
    secretAccessKey: "YOUR_SECRET_KEY", // Replace with your secret key
  },
});

export const uploadToS3 = async (file: File, filename: string) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const params = {
      Bucket: "your-bucket-name", // Replace with your bucket name
      Key: filename,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(params));
    return `https://your-bucket-name.s3.amazonaws.com/${filename}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};