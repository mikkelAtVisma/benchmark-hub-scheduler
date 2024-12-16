import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/*
Important: Set this CORS configuration in your S3 bucket:

{
    "CORSRules": [
        {
            "AllowedHeaders": [
                "*"
            ],
            "AllowedMethods": [
                "PUT",
                "POST",
                "GET"
            ],
            "AllowedOrigins": [
                "*"
            ],
            "ExposeHeaders": []
        }
    ]
}
*/

// Only use these values for local development and testing
const DEV_ACCESS_KEY = "your-dev-access-key";
const DEV_SECRET_KEY = "your-dev-secret-key";
const DEV_BUCKET = "your-dev-bucket";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || DEV_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || DEV_SECRET_KEY,
  },
});

export const uploadToS3 = async (file: File, filename: string): Promise<string> => {
  try {
    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME || DEV_BUCKET;
    
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