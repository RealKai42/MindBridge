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
    basicCoherence: calculateAverage(csvData.map((row) => row.basicCoherence)),
    basicConsistency: calculateAverage(csvData.map((row) => row.basicConsistency)),
    basicFluency: calculateAverage(csvData.map((row) => row.basicFluency)),
    basicRelevance: calculateAverage(csvData.map((row) => row.basicRelevance)),
    basicAvg: calculateAverage(csvData.map((row) => row.basicAvg)),
    splitCoherence: calculateAverage(csvData.map((row) => row.splitCoherence)),
    splitConsistency: calculateAverage(csvData.map((row) => row.splitConsistency)),
    splitFluency: calculateAverage(csvData.map((row) => row.splitFluency)),
    splitRelevance: calculateAverage(csvData.map((row) => row.splitRelevance)),
    splitAvg: calculateAverage(csvData.map((row) => row.splitAvg)),
    associateCoherence: calculateAverage(csvData.map((row) => row.associateCoherence)),
    associateConsistency: calculateAverage(csvData.map((row) => row.associateConsistency)),
    associateFluency: calculateAverage(csvData.map((row) => row.associateFluency)),
    associateRelevance: calculateAverage(csvData.map((row) => row.associateRelevance)),
    associateAvg: calculateAverage(csvData.map((row) => row.associateAvg)),
    splitOnlyCoherence: calculateAverage(csvData.map((row) => row.splitOnlyCoherence)),
    splitOnlyConsistency: calculateAverage(csvData.map((row) => row.splitOnlyConsistency)),
    splitOnlyFluency: calculateAverage(csvData.map((row) => row.splitOnlyFluency)),
    splitOnlyRelevance: calculateAverage(csvData.map((row) => row.splitOnlyRelevance)),
    splitOnlyAvg: calculateAverage(csvData.map((row) => row.splitOnlyAvg)),
  };
  csvData.push(averages);

  const csv = parse(csvData, { fields: csvFields });
  await fs.mkdir(sumTestDir, { recursive: true });
  await fs.writeFile(path.join(sumTestDir, `results-${getFormattedDate()}.csv`), csv);

  console.log("CSV file has been generated successfully.");
}

function calculateAverage(values: number[]): number {
  if (values.length <= 2) {
    return parseFloat((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3));
  }

  const sortedValues = values.slice().sort((a, b) => a - b);
  const trimmedValues = sortedValues.slice(1, -1); // Remove the highest and lowest values
  const average = trimmedValues.reduce((sum, value) => sum + value, 0) / trimmedValues.length;
  return parseFloat(average.toFixed(3));
}

generateCSV().catch((error) => {
  console.error("Error generating CSV:", error);
});
