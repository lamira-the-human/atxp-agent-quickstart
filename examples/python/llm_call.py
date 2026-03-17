"""
ATXP Example: LLM call billed to the agent's own wallet.

The agent pays for its own inference — no shared API keys, no billing chaos.
Works with any OpenAI-compatible client.

Setup:
  export ATXP_CONNECTION_STRING="<your connection string from npx atxp agent register>"
  pip install openai
  python llm_call.py
"""

import os
from openai import OpenAI

ATXP_CONNECTION = os.environ["ATXP_CONNECTION_STRING"]

client = OpenAI(
    base_url="https://gateway.atxp.ai/v1",
    api_key=ATXP_CONNECTION,
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5",   # or gpt-4o, gemini-2.0-flash, llama-3, etc.
    messages=[
        {"role": "user", "content": "Summarize the key benefits of agents having their own accounts."}
    ]
)

print(response.choices[0].message.content)
# The agent's wallet was automatically charged for this call.
# Check your balance: npx atxp balance
