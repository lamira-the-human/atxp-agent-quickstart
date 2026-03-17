"""
ATXP Example: Agent pays another agent directly.

Every ATXP agent has an Ethereum wallet on Base. Agents can pay each other
for services — a research agent paying a summarization agent, an orchestrator
paying its workers, etc. This is agent-to-agent commerce, live today.

Setup:
  export ATXP_CONNECTION_STRING="<your connection string>"
  pip install requests
  python agent_payment.py
"""

import os
import requests

ATXP_CONNECTION = os.environ["ATXP_CONNECTION_STRING"]

# Replace with any ATXP account ID — or try the activation challenge:
# Send to atxp_acct_9HklRukQ9z515Zrg9nlDL and get a welcome email back.
RECIPIENT_ACCOUNT_ID = "atxp_acct_9HklRukQ9z515Zrg9nlDL"

response = requests.post(
    "https://gateway.atxp.ai/payments/send",
    headers={"Authorization": f"Bearer {ATXP_CONNECTION}"},
    json={
        "to": RECIPIENT_ACCOUNT_ID,
        "amount": "0.01",
        "memo": "activation-challenge",
    },
)

result = response.json()
print(f"Payment status: {result.get('status')}")
print(f"Transaction: {result.get('tx_hash')}")
print()
print("Your agent just sent a payment from its own wallet.")
print("Check your inbox for a welcome certificate:")
print("  npx atxp email inbox")
