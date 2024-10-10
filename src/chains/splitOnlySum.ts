import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SPLIT_GEN_SUM, SPLIT_ONLY_GEN_SUM } from "../prompt/prompt";

export async function splitOnlyGenSum({
  content,
  chunkSize = 200,
  chunkOverlap = 40,
  sampleSize = 5,
}: {
  content: string;
  chunkSize?: number;
  chunkOverlap?: number;
  sampleSize?: number;
}) {
  const model = new ChatOpenAI({
    temperature: 0,
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunkSize,
    chunkOverlap: chunkOverlap,
  });

  const splitContent = (await splitter.createDocuments([content])).map((i) => i.pageContent);
  const sampledContents: string[] = [];

  if (splitContent.length < sampleSize) {
    sampledContents.push(...splitContent);
  } else {
    const step = Math.floor(splitContent.length / sampleSize);
    for (let i = 0; i < sampleSize; i++) {
      sampledContents.push(splitContent[i * step]);
    }
  }

  const inputContent = sampledContents.join("\n\n");

  const prompt = ChatPromptTemplate.fromMessages(["human", SPLIT_ONLY_GEN_SUM]);
  const outputParser = new StringOutputParser();

  const chain = RunnableSequence.from([prompt, model, outputParser]);
  const output = await chain.invoke({ content: inputContent });

  return {
    type: "splitOnlyGenSum",
    content: content,
    contentLength: content.length,
    sampledContent: sampledContents,
    sampledTotalSize: sampledContents.join("").length,
    summary: output,
  };
}

export type splitOnlyOutput = {
  type: string;
  content: string;
  contentLength: number;
  sampledContent: string[];
  sampledTotalSize: number;
  summary: string;
};
