import express from "express";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
app.get("/*", async (req, res) => {
  const host = req.hostname;


  const id = host.split(".")[0];

  let filePath = req.path;

  console.log(filePath);
  if (filePath.startsWith("/assets")) {
    let p = filePath.split("/");
    p=p.slice(1);
    filePath = p.join(`\\`);
    filePath = "/" + filePath;
  }
  console.log({ filePath });
  const contents = await s3
    .getObject({
      Bucket: "vercel-sahib",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);
  res.send(contents.Body);
});

app.listen(3001);
