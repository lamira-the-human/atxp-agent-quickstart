"""
ATXP Example: Agent sends email from its own @atxp.email address.

The "from" address is the agent's — not yours. Your agent has a real,
agent-native inbox that can send and receive independently.

Setup:
  export ATXP_CONNECTION_STRING="<your connection string>"
  pip install requests
  python send_email.py
"""

import os
import requests

ATXP_CONNECTION = os.environ["ATXP_CONNECTION_STRING"]

response = requests.post(
    "https://gateway.atxp.ai/tools/email/send",
    headers={"Authorization": f"Bearer {ATXP_CONNECTION}"},
    json={
        "to": "you@example.com",
        "subject": "Hello from your autonomous agent",
        "body": (
            "This email was sent by an AI agent from its own @atxp.email address.\n\n"
            "The agent has its own inbox, wallet, and identity — "
            "none of this routes through your personal accounts.\n\n"
            "— Your Agent"
        ),
    },
)

print(response.status_code, response.json())
# Check: npx atxp email inbox  (to read from your agent's inbox)
