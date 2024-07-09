import { S3 } from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});


export const uploadFile=async(fileName:string, localPath:string)=>{

    const fileContent=fs.readFileSync(localPath);

    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-sahib",
        Key: fileName,
    }).promise();
    console.log(response);
}