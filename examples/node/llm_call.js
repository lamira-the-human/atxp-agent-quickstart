/**
 * ATXP Example: LLM call from a Node.js agent, billed to its own wallet.
 *
 * Uses the OpenAI SDK — just swap the base URL and API key.
 * The agent's wallet is charged per call. No shared credentials.
 *
 * Setup:
 *   export ATXP_CONNECTION_STRING="<your connection string>"
 *   npm install openai
 *   node llm_call.js
 */

import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://gateway.atxp.ai/v1",
  apiKey: process.env.ATXP_CONNECTION_STRING,
});

const response = await client.chat.completions.create({
  model: "claude-sonnet-4-5", // or gpt-4o, gemini-2.0-flash, etc.
  messages: [
    {
      role: "user",
      content: "What are the advantages of agents having their own crypto wallets?",
    },
  ],
});

console.log(response.choices[0].message.content);
// Agent's wallet was charged. Check: npx atxp balance
