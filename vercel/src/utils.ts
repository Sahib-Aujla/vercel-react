import fs from "fs";
import * as path from "path";
const MAX_LENGTH = 6;

export function genreateID() {
  const subset = "1234567890abcdefghijklmnopqrstuvwxyz";
  let ans = "";
  for (let i = 0; i < MAX_LENGTH; i++) {
    ans += subset[Math.floor(Math.random() * subset.length)];
  }
  return ans;
}

export function getAllFilePaths(root: string) {
  let resp: string[] = [];
  const allfiles = fs.readdirSync(root);

  allfiles.forEach((file) => {
    const fullFilePath = path.join(root, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      resp = resp.concat(getAllFilePaths(fullFilePath));
    } else {
      resp.push(fullFilePath);
    }
  });

  return resp;
}
