import path from "path";
import { basicGenSum } from "./chains/basicGenSum";
import { splitGenSum } from "./chains/splitGenSum";
import { associateGenSum } from "./chains/associateGenSum";
import { evalSum } from "./chains/evalSum";
import { outputRender } from "./render";
import fs from "fs";
import { getFormattedDate } from "./utils";

export async function runTest({
  testName,
  content,
  chunkSize = 200,
  chunkOverlap = 40,
  sampleSize = 5,
}: {
  testName: string;
  content: string;
  chunkSize?: number;
  chunkOverlap?: number;
  sampleSize?: number;
}) {
  const basicRes = await basicGenSum({
    content,
  });
  const evalBasicRes = await evalSum({
    content: basicRes.content,
    summary: basicRes.summary,
  });
  const basicRenderResult = outputRender(basicRes, evalBasicRes);

  const splitRes = await splitGenSum({
    content,
    chunkSize,
    chunkOverlap,
    sampleSize,
  });
  const evalSplitRes = await evalSum({
    content: splitRes.content,
    summary: splitRes.summary,
  });
  const splitRenderResult = outputRender(splitRes, evalSplitRes);

  const associateRes = await associateGenSum({
    content,
    chunkSize,
    chunkOverlap,
    sampleSize,
  });
  const evalAssociateRes = await evalSum({
    content: associateRes.content,
    summary: associateRes.summary,
  });
  const associateRenderResult = outputRender(associateRes, evalAssociateRes);

  const dateString = getFormattedDate();

  const markdownContent = `
# Test Results for ${testName}
**Date:** ${dateString}

**Parameters:**
- **Chunk Size:** ${chunkSize}
- **Chunk Overlap:** ${chunkOverlap}
- **Sample Size:** ${sampleSize}

**Evaluation Scoring Criteria:**
- **Coherence (1-5):** How logically and clearly the summary presents the information.
- **Consistency (1-5):** How factually accurate the summary is compared to the source.
- **Fluency (1-3):** The grammatical and structural quality of the summary.
- **Relevance (1-5):** How well the summary captures the important information from the source.

**Average Score Range:** 1 to 4.5


${basicRenderResult}
  
${splitRenderResult}
  
${associateRenderResult}
    `;

  const results = {
    basic: { res: basicRes, evalRes: evalBasicRes },
    split: { res: splitRes, evalRes: evalSplitRes },
    associate: { res: associateRes, evalRes: evalAssociateRes },
  };

  const testFolderName = `${testName}-${dateString}`;
  const outputDir = path.resolve(__dirname, "../output", testFolderName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, "results.md"), markdownContent);
  fs.writeFileSync(
    path.join(outputDir, "basicGenSum.json"),
    JSON.stringify(results.basic, null, 2)
  );
  fs.writeFileSync(
    path.join(outputDir, "splitGenSum.json"),
    JSON.stringify(results.split, null, 2)
  );
  fs.writeFileSync(
    path.join(outputDir, "associateGenSum.json"),
    JSON.stringify(results.associate, null, 2)
  );
}
