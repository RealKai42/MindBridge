import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { COHERENCE, CONSISTENCY, FLUENCY, RELEVANCE } from "../prompt/eval";
import { z } from "zod";

export async function evalSum({ content, summary }: { content: string; summary: string }) {
  const model = new ChatOpenAI({
    temperature: 0,
  });

  const coherencePrompt = ChatPromptTemplate.fromMessages([
    "human",
    COHERENCE + "\n\n{format_instructions}",
  ]);
  const consistencyPrompt = ChatPromptTemplate.fromMessages([
    "human",
    CONSISTENCY + "\n\n{format_instructions}",
  ]);
  const fluencyPrompt = ChatPromptTemplate.fromMessages([
    "human",
    FLUENCY + "\n\n{format_instructions}",
  ]);
  const relevancePrompt = ChatPromptTemplate.fromMessages([
    "human",
    RELEVANCE + "\n\n{format_instructions}",
  ]);

  const zodSchema = z.number().describe("scores ONLY");
  const zodParser = StructuredOutputParser.fromZodSchema(zodSchema);

  const outputParser = new StringOutputParser();

  const chain = RunnableSequence.from([
    {
      coherence: async (input) => {
        const chain = RunnableSequence.from([coherencePrompt, model, zodParser]);
        const res = await chain.invoke(input);

        return res;
      },
      consistency: async (input) => {
        const chain = RunnableSequence.from([consistencyPrompt, model, zodParser]);
        const res = await chain.invoke(input);

        return res;
      },

      fluency: async (input) => {
        const chain = RunnableSequence.from([fluencyPrompt, model, zodParser]);
        const res = await chain.invoke(input);

        return res;
      },

      relevance: async (input) => {
        const chain = RunnableSequence.from([relevancePrompt, model, zodParser]);
        const res = await chain.invoke(input);

        return res;
      },
    },
    (scores) => {
      const avg = (scores.coherence + scores.consistency + scores.fluency + scores.relevance) / 4;

      return {
        coherence: scores.coherence,
        consistency: scores.consistency,
        fluency: scores.fluency,
        relevance: scores.relevance,
        avg,
      };
    },
  ]);

  const output = await chain.invoke({
    content,
    summary,
    format_instructions: zodParser.getFormatInstructions(),
  });
  return output;
}

export type EvalSumOutput = {
  coherence: number;
  consistency: number;
  fluency: number;
  relevance: number;
  avg: number;
};
