import { S3 } from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { get } from "http";

dotenv.config();

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const downloadFromS3 = async (prefix: string) => {
  const allFilesList = await s3
    .listObjectsV2({
      Bucket: "vercel-sahib",
      Prefix: prefix,
    })
    .promise();
  const allPromises =
    allFilesList.Contents?.forEach(async (file) => {
      const Key = file.Key;

      return new Promise<string>(async (resolve) => {
        if (!Key) {
          resolve("");
          return;
        }

        const finalOutputPath = path.join(__dirname, Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirname = path.dirname(finalOutputPath);

        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true });
        }
        s3.getObject({
          Bucket: "vercel-sahib",
          Key,
        })
          .createReadStream()
          .pipe(outputFile)
          .on("finish", () => {
            resolve("");
          });
      });
    }) || [];

  return Promise.all(allPromises);
};


export const copyFinalDist=async(id:string|undefined)=>{
    if(!id){
        return;
    }
    const folderPath = path.join(__dirname,`/output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
    console.log("All done");
}


const getAllFiles=(folderPath:string)=>{
    let resp:string[]=[];
    const allFilesList=fs.readdirSync(folderPath);

    allFilesList?.forEach(file => {
        const fullPath=path.join(folderPath,file);

        if(fs.statSync(fullPath).isDirectory()){
           resp=resp.concat( getAllFiles(fullPath));
        }else{
            resp.push(fullPath);
        }

    })
    return resp;
}


const uploadFile= async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-sahib",
        Key: fileName,
    }).promise();
    console.log(response);
}