import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ASSOCIATE_ARTICLE, BASIC_GEN_SUM } from "../prompt/prompt";

export async function associateGenSum({
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
  const associatePrompt = ChatPromptTemplate.fromMessages(["human", ASSOCIATE_ARTICLE]);
  const basicPrompt = ChatPromptTemplate.fromMessages(["human", BASIC_GEN_SUM]);
  const outputParser = new StringOutputParser();

  let associateContent = "";

  const chain = RunnableSequence.from([
    associatePrompt,
    model,
    outputParser,
    (input) => {
      associateContent = input;
      return {
        content: input,
      };
    },
    basicPrompt,
    model,
    outputParser,
  ]);

  const output = await chain.invoke({ content: inputContent });

  return {
    type: "associateGenSum",
    content: content,
    contentLength: content.length,
    sampledContent: sampledContents,
    sampledTotalSize: sampledContents.join("").length,
    associate: associateContent,
    summary: output,
  } as AssociateOutput;
}

export type AssociateOutput = {
  type: string;
  content: string;
  contentLength: number;
  sampledContent: string[];
  sampledTotalSize: number;
  associate: string;
  summary: string;
};
