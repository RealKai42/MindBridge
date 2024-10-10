import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { BASIC_GEN_SUM } from "../prompt/prompt";

export async function basicGenSum({ content }: { content: string }) {
  const model = new ChatOpenAI({
    temperature: 0,
  });

  const prompt = ChatPromptTemplate.fromMessages(["human", BASIC_GEN_SUM]);
  const outputParser = new StringOutputParser();

  const chain = RunnableSequence.from([prompt, model, outputParser]);
  const output = await chain.invoke({ content });

  return {
    type: "basicGenSum",
    content: content,
    contentLength: content.length,
    summary: output,
  } as BasicOutput;
}

export type BasicOutput = {
  type: string;
  content: string;
  contentLength: number;
  summary: string;
};
