import path from "path";
import { exec } from "child_process";

export async function buildProject(id: string | undefined) {
  if (!id) {
    return;
  }
  return new Promise<string>(async (resolve) => {
    const folderpth = path.join(__dirname, `/output/${id}`);
    const child = exec(`cd ${folderpth} && npm install && npm run build`);
    child.stdout?.on("data", function (data) {
      console.log("stdout: " + data);
    });
    child.stderr?.on("data", function (data) {
      console.log("stderr: " + data);
    });

    child.on("close", function (code) {
      resolve("");
    });
  });
}
