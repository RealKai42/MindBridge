import path from "path";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import { runTest } from "./testRunner";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const inputDir = path.resolve(__dirname, "../input");

async function main() {
  const files = await fs.readdir(inputDir);
  const txtFiles = files.filter((file) => path.extname(file) === ".txt");

  const promises = txtFiles.map(async (file) => {
    const filePath = path.join(inputDir, file);
    const data = await fs.readFile(filePath, "utf8");
    const testName = path.basename(file, ".txt");

    return runTest({
      testName,
      content: data,
    });
  });

  await Promise.all(promises);
}

main();
