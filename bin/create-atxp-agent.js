#!/usr/bin/env node

/**
 * create-atxp-agent
 *
 * Scaffolds a new AI agent project with:
 *   - ATXP agent registration (wallet + email + $5 credits)
 *   - Working example files (LLM call, web search, email, payments)
 *   - .env template pre-wired for the agent's connection string
 *
 * Usage:
 *   npx create-atxp-agent           (scaffold in current directory)
 *   npx create-atxp-agent my-agent  (scaffold in ./my-agent/)
 */

import { execSync, spawnSync } from "child_process";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join, resolve } from "path";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";

function log(msg) { process.stdout.write(msg + "\n"); }
function bold(s) { return BOLD + s + RESET; }
function green(s) { return GREEN + s + RESET; }
function cyan(s) { return CYAN + s + RESET; }
function yellow(s) { return YELLOW + s + RESET; }
function dim(s) { return DIM + s + RESET; }

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const projectName = args.filter(a => !a.startsWith("--"))[0] || ".";
const projectDir = resolve(projectName === "." ? process.cwd() : join(process.cwd(), projectName));

log("");
log(bold("  ┌─────────────────────────────────────────────┐"));
log(bold("  │        create-atxp-agent  v0.1.0            │"));
log(bold("  │  Give your AI agent its own wallet + email  │"));
log(bold("  └─────────────────────────────────────────────┘"));
log("");

if (projectName !== ".") {
  log(`  Creating project: ${cyan(projectName)}`);
  log(`  Directory:        ${dim(projectDir)}`);
  log("");
}

// ── Step 1: Create directory ────────────────────────────────────────────────

if (!isDryRun && projectName !== ".") {
  if (existsSync(projectDir)) {
    log(yellow("  Directory already exists — scaffolding into it."));
  } else {
    mkdirSync(projectDir, { recursive: true });
  }
}

// ── Step 2: Register agent with ATXP ────────────────────────────────────────

log("  " + bold("Step 1/3") + "  Registering your agent with ATXP...");
log("");
log("  This will create a new agent account with:");
log("  " + green("✓") + " An Ethereum wallet on Base");
log("  " + green("✓") + " An @atxp.email inbox");
log("  " + green("✓") + " $5 in free credits");
log("");

let connectionString = "YOUR_ATXP_CONNECTION_STRING";

if (!isDryRun) {
  const result = spawnSync("npx", ["atxp", "agent", "register"], {
    stdio: ["inherit", "pipe", "pipe"],
    cwd: projectDir,
    encoding: "utf8",
    shell: true,
  });

  if (result.status !== 0) {
    log("");
    log(yellow("  ⚠ Could not auto-register. You can do it manually:"));
    log("    npx atxp agent register");
    log("");
    log("  Then paste your connection string into .env");
  } else {
    const output = result.stdout + result.stderr;
    // Try to extract the connection string from output
    const match = output.match(/https:\/\/accounts\.atxp\.ai[^\s"']*/);
    if (match) {
      connectionString = match[0];
      log("  " + green("✓") + " Agent registered!");
    }
    log(output);
  }
}

// ── Step 3: Write project files ─────────────────────────────────────────────

log("  " + bold("Step 2/3") + "  Scaffolding project files...");
log("");

const files = {
  ".env.example": `# ATXP Agent connection string — from: npx atxp agent register
ATXP_CONNECTION_STRING=${connectionString}
`,

  ".gitignore": `.env
node_modules/
*.log
`,

  "package.json": JSON.stringify({
    name: projectName === "." ? "my-atxp-agent" : projectName,
    version: "0.1.0",
    description: "AI agent with its own wallet, email, and tools — powered by ATXP",
    type: "module",
    scripts: {
      start: "node src/agent.js",
      "llm-demo": "node src/llm_call.js",
      "search-demo": "node src/web_search.js",
      "email-demo": "node src/send_email.js",
      "payment-demo": "node src/agent_payment.js",
    },
    dependencies: {
      openai: "^4.0.0",
    },
  }, null, 2) + "\n",

  "README.md": `# ${projectName === "." ? "my-atxp-agent" : projectName}

An AI agent with its own wallet, email, and tools — powered by [ATXP](https://atxp.ai?utm_source=npm&utm_medium=organic&utm_campaign=growth-ceo).

## Setup

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your connection string
cp .env.example .env
# Then: paste your ATXP_CONNECTION_STRING from npx atxp agent register

# 3. Run the demos
npm run llm-demo      # Agent calls an LLM, billed to its wallet
npm run search-demo   # Agent searches the web
npm run email-demo    # Agent sends from its @atxp.email address
npm run payment-demo  # Agent pays another agent
\`\`\`

## What Your Agent Can Do

| Capability | How |
|---|---|
| Call any LLM | \`src/llm_call.js\` — OpenAI-compatible gateway |
| Search the web | \`src/web_search.js\` — microtransaction per search |
| Send & receive email | \`src/send_email.js\` — from the agent's own @atxp.email |
| Pay other agents | \`src/agent_payment.js\` — Ethereum on Base |

## Resources

- **ATXP docs:** https://docs.atxp.ai?utm_source=npm&utm_medium=organic&utm_campaign=growth-ceo
- **Quickstart examples:** https://github.com/lamira-the-human/atxp-agent-quickstart
- **Activation challenge:** https://atxp-experiment-landing.lamira.workers.dev?utm_source=npm&utm_medium=organic&utm_campaign=growth-ceo
`,

  "src/agent.js": `/**
 * Main agent entry point.
 *
 * This agent demonstrates the full ATXP capability loop:
 *  1. Searches the web for a topic
 *  2. Summarizes results using an LLM (billed to its wallet)
 *  3. Emails the summary from its own @atxp.email address
 *
 * Run: node src/agent.js
 */

import "dotenv/config";
import { OpenAI } from "openai";
import fetch from "node-fetch";

const CONNECTION = process.env.ATXP_CONNECTION_STRING;
if (!CONNECTION) throw new Error("Set ATXP_CONNECTION_STRING in .env");

const client = new OpenAI({
  baseURL: "https://gateway.atxp.ai/v1",
  apiKey: CONNECTION,
});

// 1. Search
const searchRes = await fetch("https://gateway.atxp.ai/tools/search", {
  method: "POST",
  headers: { Authorization: \`Bearer \${CONNECTION}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: "latest AI agent frameworks 2025", num_results: 3 }),
});
const { items } = await searchRes.json();
const context = items.map(i => \`- \${i.title}: \${i.snippet}\`).join("\\n");

// 2. Summarize
const summary = await client.chat.completions.create({
  model: "claude-sonnet-4-5",
  messages: [
    { role: "user", content: \`Summarize these AI agent news items in 2 sentences:\\n\${context}\` }
  ],
});
const text = summary.choices[0].message.content;
console.log("Summary:", text);

// 3. Email
await fetch("https://gateway.atxp.ai/tools/email/send", {
  method: "POST",
  headers: { Authorization: \`Bearer \${CONNECTION}\`, "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "you@example.com",
    subject: "Agent daily digest",
    body: text,
  }),
});
console.log("Email sent from agent's @atxp.email address.");
`,

  "src/llm_call.js": `import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://gateway.atxp.ai/v1",
  apiKey: process.env.ATXP_CONNECTION_STRING,
});

const res = await client.chat.completions.create({
  model: "claude-sonnet-4-5",
  messages: [{ role: "user", content: "What year is it and what's exciting in AI?" }],
});
console.log(res.choices[0].message.content);
`,

  "src/web_search.js": `import "dotenv/config";

const res = await fetch("https://gateway.atxp.ai/tools/search", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.ATXP_CONNECTION_STRING}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: "autonomous AI agents 2025", num_results: 5 }),
});
const { items } = await res.json();
items.forEach(i => console.log(\`- \${i.title}\\n  \${i.url}\\n\`));
`,

  "src/send_email.js": `import "dotenv/config";

const res = await fetch("https://gateway.atxp.ai/tools/email/send", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.ATXP_CONNECTION_STRING}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: "you@example.com",
    subject: "Hello from my agent",
    body: "This was sent from my agent's @atxp.email address — not mine.",
  }),
});
console.log(await res.json());
`,

  "src/agent_payment.js": `import "dotenv/config";

// Try the Activation Challenge: pay 0.01 ATXP and get a welcome certificate back.
const res = await fetch("https://gateway.atxp.ai/payments/send", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.ATXP_CONNECTION_STRING}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: "atxp_acct_9HklRukQ9z515Zrg9nlDL",
    amount: "0.01",
    memo: "activation-challenge",
  }),
});
const result = await res.json();
console.log("Payment:", result.status, result.tx_hash);
console.log("Check your inbox for a welcome certificate: npx atxp email inbox");
`,
};

if (!isDryRun) {
  mkdirSync(join(projectDir, "src"), { recursive: true });
  for (const [path, content] of Object.entries(files)) {
    writeFileSync(join(projectDir, path), content);
  }
}

log("  " + green("✓") + " Created:");
for (const path of Object.keys(files)) {
  log("    " + dim(path));
}
log("");

// ── Step 4: Done ─────────────────────────────────────────────────────────────

log("  " + bold("Step 3/3") + "  Done.");
log("");
log("  " + green(bold("Your agent is ready.")));
log("");

if (projectName !== ".") {
  log(`  ${dim("cd")} ${cyan(projectName)}`);
}

log(`  ${dim("cp")} ${cyan(".env.example .env")}      ${dim("# Add your connection string")}`);
log(`  ${dim("npm install")}`);
log(`  ${dim("node")} ${cyan("src/agent.js")}          ${dim("# Run the full demo")}`);
log("");
log("  " + bold("Activation Challenge:"));
log(`  Run ${cyan("npm run payment-demo")} to send a test payment and get a welcome certificate.`);
log("");
log(`  ${dim("Docs:")} https://docs.atxp.ai`);
log(`  ${dim("Examples:")} https://github.com/lamira-the-human/atxp-agent-quickstart`);
log("");
