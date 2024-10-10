import { EvalSumOutput } from "./chains/evalSum";
import { SplitOutput } from "./chains/splitGenSum";
import { BasicOutput } from "./chains/basicGenSum";
import { Output } from "./type";
import { AssociateOutput } from "./chains/associateGenSum";

export type splitOnlyOutput = {
  type: string;
  content: string;
  contentLength: number;
  sampledContent: string[];
  sampledTotalSize: number;
  summary: string;
};

function formatSummary(summary: string): string {
  return summary.replace(/\n/g, "<br>");
}

function BasicRender(data: BasicOutput, evalData: EvalSumOutput): string {
  let markdownContent = `## Basic Output Results\n\n`;
  markdownContent += "| Content Length | Summary |\n";
  markdownContent += "|----------------|---------|\n";

  markdownContent += `| ${data.contentLength} | ${formatSummary(data.summary)} |\n`;

  markdownContent += `\n### Evaluation Summary\n\n`;
  markdownContent += "| Coherence | Consistency | Fluency | Relevance | Average |\n";
  markdownContent += "|-----------|-------------|---------|-----------|---------|\n";
  markdownContent += `| ${evalData.coherence} | ${evalData.consistency} | ${evalData.fluency} | ${evalData.relevance} | ${evalData.avg} |\n`;

  return markdownContent;
}

function AssociateRender(data: AssociateOutput, evalData: EvalSumOutput): string {
  let markdownContent = `## Associate Output Results\n\n`;
  markdownContent += "| Content Length | Sampled Total Size | Summary |\n";
  markdownContent += "|----------------|--------------------|---------|\n";

  markdownContent += `| ${data.contentLength} | ${data.sampledTotalSize} | ${formatSummary(
    data.summary
  )} |\n`;

  markdownContent += `\n### Evaluation Summary\n\n`;
  markdownContent += "| Coherence | Consistency | Fluency | Relevance | Average |\n";
  markdownContent += "|-----------|-------------|---------|-----------|---------|\n";
  markdownContent += `| ${evalData.coherence} | ${evalData.consistency} | ${evalData.fluency} | ${evalData.relevance} | ${evalData.avg} |\n`;

  return markdownContent;
}

function SplitRender(data: SplitOutput, evalData: EvalSumOutput): string {
  let markdownContent = `## Split Output Results\n\n`;
  markdownContent += "| Content Length | Sampled Total Size | Summary |\n";
  markdownContent += "|----------------|--------------------|---------|\n";

  markdownContent += `| ${data.contentLength} | ${data.sampledTotalSize} | ${formatSummary(
    data.summary
  )} |\n`;

  markdownContent += `\n### Evaluation Summary\n\n`;
  markdownContent += "| Coherence | Consistency | Fluency | Relevance | Average |\n";
  markdownContent += "|-----------|-------------|---------|-----------|---------|\n";
  markdownContent += `| ${evalData.coherence} | ${evalData.consistency} | ${evalData.fluency} | ${evalData.relevance} | ${evalData.avg} |\n`;

  return markdownContent;
}

function SplitOnlyRender(data: splitOnlyOutput, evalData: EvalSumOutput): string {
  let markdownContent = `## Split Only Output Results\n\n`;
  markdownContent += "| Content Length | Sampled Total Size | Summary |\n";
  markdownContent += "|----------------|--------------------|---------|\n";

  markdownContent += `| ${data.contentLength} | ${data.sampledTotalSize} | ${formatSummary(
    data.summary
  )} |\n`;

  markdownContent += `\n### Evaluation Summary\n\n`;
  markdownContent += "| Coherence | Consistency | Fluency | Relevance | Average |\n";
  markdownContent += "|-----------|-------------|---------|-----------|---------|\n";
  markdownContent += `| ${evalData.coherence} | ${evalData.consistency} | ${evalData.fluency} | ${evalData.relevance} | ${evalData.avg} |\n`;

  return markdownContent;
}

export function outputRender(data: Output | splitOnlyOutput, evalData: EvalSumOutput): string {
  switch (data.type) {
    case "associateGenSum":
      return AssociateRender(data as AssociateOutput, evalData);
    case "splitGenSum":
      return SplitRender(data as SplitOutput, evalData);
    case "basicGenSum":
      return BasicRender(data as BasicOutput, evalData);
    case "splitOnlyGenSum":
      return SplitOnlyRender(data as splitOnlyOutput, evalData);
    default:
      throw new Error("Invalid data type");
  }
}
