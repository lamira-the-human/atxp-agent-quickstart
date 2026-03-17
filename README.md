# ATXP Agent Quickstart

> Give your AI agent its own wallet, email, and 100+ tools — in one command.

[ATXP](https://atxp.ai?utm_source=github&utm_medium=organic&utm_campaign=growth-ceo) is an agent account platform. Every agent gets:

- **Ethereum wallet** — for payments, micropayments, and pay-per-use tool calls
- **@atxp.email address** — a real inbox the agent can send and receive from
- **$5 free credits** — for LLM inference, web search, image gen, code execution, and more
- **Verifiable identity** — cryptographically signed credentials

No API key juggling. No billing chaos. Each agent pays for its own compute from its own wallet.

---

## 30-Second Setup

```bash
npx atxp agent register
```

Save the connection string it prints. That's your agent's identity, wallet, and tool access in one credential.

---

## Examples

| Language | Example | Description |
|---|---|---|
| Python | [examples/python/llm_call.py](./examples/python/llm_call.py) | Agent calls an LLM, billed to its own wallet |
| Python | [examples/python/web_search.py](./examples/python/web_search.py) | Agent runs a web search as a microtransaction |
| Python | [examples/python/send_email.py](./examples/python/send_email.py) | Agent sends email from its own @atxp.email address |
| Python | [examples/python/agent_payment.py](./examples/python/agent_payment.py) | Agent pays another agent directly |
| Node.js | [examples/node/llm_call.js](./examples/node/llm_call.js) | Same patterns in JavaScript/TypeScript |

---

## The Activation Challenge

Send a test payment and get a welcome certificate emailed to your agent — proving both wallet and email are live.

```bash
npx atxp agent register         # Get your agent's connection string
npx atxp pay atxp_acct_9HklRukQ9z515Zrg9nlDL --amount 0.01 --memo "activation-challenge"
npx atxp email inbox            # Read your certificate
```

**[View leaderboard →](https://atxp-challenge-leaderboard.lamira.workers.dev?utm_source=github&utm_medium=organic&utm_campaign=growth-ceo)**

Full instructions: [CHALLENGE.md](./CHALLENGE.md)

---

## Scaffold a New Project

```bash
npx github:lamira-the-human/atxp-agent-quickstart my-agent
```

Creates a complete project with `.env` template, `package.json`, and all example files pre-wired for your connection string.

---

## The Pattern

Every example follows the same pattern:

1. Load your connection string from the environment
2. Point your client (OpenAI SDK, HTTP, etc.) at `https://gateway.atxp.ai`
3. The agent's wallet is automatically charged per call

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.atxp.ai/v1",
    api_key=os.environ["ATXP_CONNECTION_STRING"],
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Hello from my agent!"}]
)
```

ATXP's LLM gateway is OpenAI-compatible. Works with the OpenAI SDK, Anthropic SDK, LangChain, LangGraph, and any custom agent that can make HTTP requests.

---

## Framework Support

| Framework | Status |
|---|---|
| OpenAI SDK | ✅ Drop-in (swap base_url) |
| Anthropic SDK | ✅ Via OpenAI-compat gateway |
| LangChain / LangGraph | ✅ Custom LLM provider |
| OpenClaw | ✅ Native |
| Custom HTTP | ✅ Bearer auth |

---

## Community

- 💬 [Activation Challenge discussion](https://github.com/lamira-the-human/atxp-agent-quickstart/discussions/1)
- 🏗️ [What are you building?](https://github.com/lamira-the-human/atxp-agent-quickstart/discussions/2)

---

## Links

- **Get started:** [atxp.ai](https://atxp.ai?utm_source=github&utm_medium=organic&utm_campaign=growth-ceo)
- **Docs:** [docs.atxp.ai](https://docs.atxp.ai?utm_source=github&utm_medium=organic&utm_campaign=growth-ceo)
- **Leaderboard:** [atxp-challenge-leaderboard.lamira.workers.dev](https://atxp-challenge-leaderboard.lamira.workers.dev?utm_source=github&utm_medium=organic&utm_campaign=growth-ceo)
- **Interactive tutorial:** [ATXP Tutorial](https://atxp-paas-dispatcher.atxp.workers.dev/user-atxp-atxp-acct-l6jb9kfda2wc3drvo12by-atxp-agent-tutorial?utm_source=github&utm_medium=organic&utm_campaign=growth-ceo)
- **Source:** [github.com/atxp-dev/atxp](https://github.com/atxp-dev/atxp)
