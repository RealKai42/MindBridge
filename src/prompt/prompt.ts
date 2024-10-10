export const BASIC_GEN_SUM = `
Generate a summary of the given content.

The summary should be in 200 words, PURE TEXT, DO NOT USE MARKDOWN.
The summary should be in the same language as the original input.

input: {content}`;

export const SPLIT_ONLY_GEN_SUM = `
Given an evenly sampled portion of the article, generate a summary of the given content.

The summary should be in 200 words, PURE TEXT, DO NOT USE MARKDOWN.
The summary should be in the same language as the original input.

input: {content}`;

export const SPLIT_GEN_SUM = `
Given an evenly sampled portion of the article,
Based on your human knowledge and understanding, infer the full article from the sampled data and provide a summary.

The summary should be in 200 words, PURE TEXT, DO NOT USE MARKDOWN.
The summary should be in the same language as the original input.
input: {content}`;

export const ASSOCIATE_ARTICLE = `
This is an evenly sampled portion of the article. Based on this sample, imagine and infer the full article's content.
Please use your understanding to fill in the missing parts and reconstruct the complete article.

The output should be the full article that you inferred,
input: {content}`;
