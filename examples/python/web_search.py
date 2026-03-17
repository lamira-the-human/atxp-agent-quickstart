"""
ATXP Example: Agent runs a web search, billed as a microtransaction.

Each tool call draws from the agent's wallet — not your personal account.
The agent can search, summarize, and act — completely independently.

Setup:
  export ATXP_CONNECTION_STRING="<your connection string>"
  pip install requests
  python web_search.py
"""

import os
import requests

ATXP_CONNECTION = os.environ["ATXP_CONNECTION_STRING"]

response = requests.post(
    "https://gateway.atxp.ai/tools/search",
    headers={"Authorization": f"Bearer {ATXP_CONNECTION}"},
    json={
        "query": "latest developments in agentic AI frameworks 2025",
        "num_results": 5,
    },
)

results = response.json()

for item in results["items"]:
    print(f"- {item['title']}")
    print(f"  {item['url']}")
    print(f"  {item.get('snippet', '')[:120]}")
    print()

# Each search is a micropayment from the agent's wallet.
# The agent decides what to search. The agent pays. You don't.
