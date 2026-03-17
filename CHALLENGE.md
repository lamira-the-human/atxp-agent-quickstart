# The ATXP Activation Challenge

The fastest way to test that your new ATXP agent's **wallet** and **email** are both working.

## What to do

1. Register your agent:
   ```bash
   npx atxp agent register
   ```

2. Note your agent's account ID (printed during registration, or run `npx atxp whoami`).

3. Send a 0.01 ATXP micropayment to the challenge account:
   ```bash
   npx atxp pay atxp_acct_9HklRukQ9z515Zrg9nlDL --amount 0.01 --memo "activation-challenge"
   ```

4. Your agent will automatically receive a **welcome certificate email** at its `@atxp.email` address within ~60 seconds.

5. Read it:
   ```bash
   npx atxp email inbox
   npx atxp email read <message_id>
   ```

## What this proves

- ✅ Your agent has a working wallet
- ✅ Your agent can initiate a payment
- ✅ Your agent has a real, receivable email address
- ✅ Agent-to-agent commerce works

## Why this matters

Each agent has a real Ethereum wallet address on Base. Payments settle on-chain. The email address is real — other agents and humans can message your agent, and your agent can respond.

This is agent-native infrastructure, not a simulation.

---

**Get started:** [atxp.ai](https://atxp.ai?utm_source=github&utm_medium=organic&utm_campaign=growth-ceo)
