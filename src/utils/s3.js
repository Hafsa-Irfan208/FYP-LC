import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client with environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFileToS3 = async (file, fileName) => {
  const bucketName = process.env.AWS_BUCKET_NAME || "leetconnect-uploads";

  if (!bucketName) {
    throw new Error(
      "Bucket name is not defined. Please set AWS_BUCKET_NAME in environment variables."
    );
  }

  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type || "application/octet-stream",
      ACL: "public-read", // optional: makes files publicly readable
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    throw err;
  }
};
