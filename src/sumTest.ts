import path from "path";
import fs from "fs/promises";
import { parse } from "json2csv";
import { getFormattedDate } from "./utils";

interface EvalData {
  coherence: number;
  consistency: number;
  fluency: number;
  relevance: number;
  avg: number;
}

interface TestResults {
  testName: string;
  basicCoherence: number;
  basicConsistency: number;
  basicFluency: number;
  basicRelevance: number;
  basicAvg: number;
  splitCoherence: number;
  splitConsistency: number;
  splitFluency: number;
  splitRelevance: number;
  splitAvg: number;
  associateCoherence: number;
  associateConsistency: number;
  associateFluency: number;
  associateRelevance: number;
  associateAvg: number;
  splitOnlyCoherence: number;
  splitOnlyConsistency: number;
  splitOnlyFluency: number;
  splitOnlyRelevance: number;
  splitOnlyAvg: number;
}

async function readEvalData(filePath: string): Promise<EvalData> {
  const data = await fs.readFile(filePath, "utf8");
  const jsonData = JSON.parse(data);
  return jsonData.evalRes;
}

async function generateCSV() {
  const outputDir = path.resolve(__dirname, "../output");
  const sumTestDir = path.resolve(__dirname, "../sumTest");
  const folders = await fs.readdir(outputDir);
  const results: TestResults[] = [];

  for (const folder of folders) {
    const folderPath = path.join(outputDir, folder);
    const stat = await fs.stat(folderPath);

    if (stat.isDirectory()) {
      const basicEval = await readEvalData(path.join(folderPath, "basicGenSum.json"));
      const splitEval = await readEvalData(path.join(folderPath, "splitGenSum.json"));
      const associateEval = await readEvalData(path.join(folderPath, "associateGenSum.json"));
      const splitOnlyEval = await readEvalData(path.join(folderPath, "splitOnlyGenSum.json"));

      results.push({
        testName: folder,
        basicCoherence: basicEval.coherence,
        basicConsistency: basicEval.consistency,
        basicFluency: basicEval.fluency,
        basicRelevance: basicEval.relevance,
        basicAvg: basicEval.avg,
        splitCoherence: splitEval.coherence,
        splitConsistency: splitEval.consistency,
        splitFluency: splitEval.fluency,
        splitRelevance: splitEval.relevance,
        splitAvg: splitEval.avg,
        associateCoherence: associateEval.coherence,
        associateConsistency: associateEval.consistency,
        associateFluency: associateEval.fluency,
        associateRelevance: associateEval.relevance,
        associateAvg: associateEval.avg,
        splitOnlyCoherence: splitOnlyEval.coherence,
        splitOnlyConsistency: splitOnlyEval.consistency,
        splitOnlyFluency: splitOnlyEval.fluency,
        splitOnlyRelevance: splitOnlyEval.relevance,
        splitOnlyAvg: splitOnlyEval.avg,
      });
    }
  }

  const csvFields = [
    "testName",
    "basicAvg",
    "splitOnlyAvg",
    "splitAvg",
    "associateAvg",
    "basicCoherence",
    "basicConsistency",
    "basicFluency",
    "basicRelevance",
    "splitOnlyCoherence",
    "splitOnlyConsistency",
    "splitOnlyFluency",
    "splitOnlyRelevance",
    "splitCoherence",
    "splitConsistency",
    "splitFluency",
    "splitRelevance",
    "associateCoherence",
    "associateConsistency",
    "associateFluency",
    "associateRelevance",
  ];

  const csvData = results.map((result) => ({
    testName: result.testName,
    basicCoherence: result.basicCoherence,
    basicConsistency: result.basicConsistency,
    basicFluency: result.basicFluency,
    basicRelevance: result.basicRelevance,
    basicAvg: result.basicAvg,
    splitCoherence: result.splitCoherence,
    splitConsistency: result.splitConsistency,
    splitFluency: result.splitFluency,
    splitRelevance: result.splitRelevance,
    splitAvg: result.splitAvg,
    associateCoherence: result.associateCoherence,
    associateConsistency: result.associateConsistency,
    associateFluency: result.associateFluency,
    associateRelevance: result.associateRelevance,
    associateAvg: result.associateAvg,
    splitOnlyCoherence: result.splitOnlyCoherence,
    splitOnlyConsistency: result.splitOnlyConsistency,
    splitOnlyFluency: result.splitOnlyFluency,
    splitOnlyRelevance: result.splitOnlyRelevance,
    splitOnlyAvg: result.splitOnlyAvg,
  }));

  // Calculate averages
  const averages: TestResults = {
    testName: "Average",
    basicCoherence: csvData.reduce((sum, row) => sum + row.basicCoherence, 0) / csvData.length,
    basicConsistency: csvData.reduce((sum, row) => sum + row.basicConsistency, 0) / csvData.length,
    basicFluency: csvData.reduce((sum, row) => sum + row.basicFluency, 0) / csvData.length,
    basicRelevance: csvData.reduce((sum, row) => sum + row.basicRelevance, 0) / csvData.length,
    basicAvg: csvData.reduce((sum, row) => sum + row.basicAvg, 0) / csvData.length,
    splitCoherence: csvData.reduce((sum, row) => sum + row.splitCoherence, 0) / csvData.length,
    splitConsistency: csvData.reduce((sum, row) => sum + row.splitConsistency, 0) / csvData.length,
    splitFluency: csvData.reduce((sum, row) => sum + row.splitFluency, 0) / csvData.length,
    splitRelevance: csvData.reduce((sum, row) => sum + row.splitRelevance, 0) / csvData.length,
    splitAvg: csvData.reduce((sum, row) => sum + row.splitAvg, 0) / csvData.length,
    associateCoherence:
      csvData.reduce((sum, row) => sum + row.associateCoherence, 0) / csvData.length,
    associateConsistency:
      csvData.reduce((sum, row) => sum + row.associateConsistency, 0) / csvData.length,
    associateFluency: csvData.reduce((sum, row) => sum + row.associateFluency, 0) / csvData.length,
    associateRelevance:
      csvData.reduce((sum, row) => sum + row.associateRelevance, 0) / csvData.length,
    associateAvg: csvData.reduce((sum, row) => sum + row.associateAvg, 0) / csvData.length,
    splitOnlyCoherence:
      csvData.reduce((sum, row) => sum + row.splitOnlyCoherence, 0) / csvData.length,
    splitOnlyConsistency:
      csvData.reduce((sum, row) => sum + row.splitOnlyConsistency, 0) / csvData.length,
    splitOnlyFluency: csvData.reduce((sum, row) => sum + row.splitOnlyFluency, 0) / csvData.length,
    splitOnlyRelevance:
      csvData.reduce((sum, row) => sum + row.splitOnlyRelevance, 0) / csvData.length,
    splitOnlyAvg: csvData.reduce((sum, row) => sum + row.splitOnlyAvg, 0) / csvData.length,
  };

  csvData.push(averages);

  const csv = parse(csvData, { fields: csvFields });
  await fs.mkdir(sumTestDir, { recursive: true });
  await fs.writeFile(path.join(sumTestDir, `results-${getFormattedDate()}.csv`), csv);

  console.log("CSV file has been generated successfully.");
}

generateCSV().catch((error) => {
  console.error("Error generating CSV:", error);
});
