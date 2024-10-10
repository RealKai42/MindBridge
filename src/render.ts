import { AssociateOutput } from "./chains/associateGenSum";
import { EvalSumOutput } from "./chains/evalSum";
import { SplitOutput } from "./chains/splitGenSum";
import { BasicOutput } from "./chains/basicGenSum";
import { Output } from "./type";

function BasicRender(data: BasicOutput, evalData: EvalSumOutput): string {
  let markdownContent = `# Basic Output Results\n\n`;
  markdownContent += "| Content Length | Summary | Content Preview |\n";
  markdownContent += "|----------------|---------|-----------------|\n";

  const contentPreview =
    data.content.length > 100
      ? `${data.content.slice(0, 50)}...${data.content.slice(-50)}`
      : data.content;

  markdownContent += `| ${data.contentLength} | ${data.summary} | ${escapeMarkdown(
    contentPreview
  )}} |\n`;

  markdownContent += `\n# Evaluation Summary\n\n`;
  markdownContent += "| Coherence | Consistency | Fluency | Relevance | Average |\n";
  markdownContent += "|-----------|-------------|---------|-----------|---------|\n";
  markdownContent += `| ${evalData.coherence} | ${evalData.consistency} | ${evalData.fluency} | ${evalData.relevance} | ${evalData.avg} |\n`;

  return markdownContent;
}

function AssociateRender(data: AssociateOutput, evalData: EvalSumOutput): string {
  let markdownContent = `# Associate Output Results\n\n`;
  markdownContent += "| Content Length | Sampled Total Size | Summary | Content Preview |\n";
  markdownContent += "|----------------|--------------------|---------|-----------------|\n";

  const contentPreview =
    data.content.length > 100
      ? `${data.content.slice(0, 50)}...${data.content.slice(-50)}`
      : data.content;

  markdownContent += `| ${data.contentLength} | ${data.sampledTotalSize} | ${
    data.summary
  } | ${escapeMarkdown(contentPreview)} |\n`;

  markdownContent += `\n# Evaluation Summary\n\n`;
  markdownContent += "| Coherence | Consistency | Fluency | Relevance | Average |\n";
  markdownContent += "|-----------|-------------|---------|-----------|---------|\n";
  markdownContent += `| ${evalData.coherence} | ${evalData.consistency} | ${evalData.fluency} | ${evalData.relevance} | ${evalData.avg} |\n`;

  return markdownContent;
}

function SplitRender(data: SplitOutput, evalData: EvalSumOutput): string {
  let markdownContent = `# Split Output Results\n\n`;
  markdownContent += "| Content Length | Sampled Total Size | Summary | Sampled Content |\n";
  markdownContent += "|----------------|--------------------|---------|-----------------|\n";

  const contentPreview = data.sampledContent
    .map((content) =>
      content.length > 100 ? `${content.slice(0, 50)}...${content.slice(-50)}` : content
    )
    .join(", ");

  markdownContent += `| ${data.contentLength} | ${data.sampledTotalSize} | ${
    data.summary
  } | ${escapeMarkdown(contentPreview)} |\n`;

  markdownContent += `\n# Evaluation Summary\n\n`;
  markdownContent += "| Coherence | Consistency | Fluency | Relevance | Average |\n";
  markdownContent += "|-----------|-------------|---------|-----------|---------|\n";
  markdownContent += `| ${evalData.coherence} | ${evalData.consistency} | ${evalData.fluency} | ${evalData.relevance} | ${evalData.avg} |\n`;

  return markdownContent;
}

export function outputRender(data: Output, evalData: EvalSumOutput): string {
  switch (data.type) {
    case "associateGenSum":
      return AssociateRender(data as AssociateOutput, evalData);
    case "splitGenSum":
      return SplitRender(data as SplitOutput, evalData);
    case "basicGenSum":
      return BasicRender(data as BasicOutput, evalData);
    default:
      throw new Error("Invalid data type");
  }
}

function escapeMarkdown(text: string): string {
  return text.replace(/[^，。,.\w\s]/g, "").replace(/\n/g, "");
}
