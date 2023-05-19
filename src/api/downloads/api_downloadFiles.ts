import { Request, Response } from "express";
import AWS from "aws-sdk";
import { foldername } from "../../constants";

// Configure AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const api_downloadFiles = async (req: Request, res: Response) => {
  const { file } = req.query;
  const key = `${foldername}/${file}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };

  try {
    // Retrieve the file from S3
    const s3Object = await s3.getObject(params).promise();

    // Set the appropriate response headers
    res.setHeader("Content-disposition", `attachment; filename=${key}`);
    res.setHeader("Content-type", s3Object.ContentType!);

    // Send the file as the response
    res.send(s3Object.Body);
  } catch (error) {
    console.error("Error retrieving file from S3:", error);
    res.status(500).send("Error retrieving file from S3");
  }
};
export default api_downloadFiles;
