import { createClient, commandOptions } from "redis";
import { downloadFromS3,copyFinalDist } from "./aws";
import { buildProject } from "./utils";
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

const deploy = async () => {
  while (1) {
    const res = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );
    //xyzbss
    //@ts-ignore
    const id = res.element;
    console.log(id);
    await downloadFromS3(`output\\${id}`);
    await buildProject(id);
    await copyFinalDist(id);
    publisher.hSet("status",id,"deployed");
    console.log(publisher.hGet("status",id));
  }
};

deploy();
