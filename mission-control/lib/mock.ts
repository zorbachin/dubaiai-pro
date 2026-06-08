// The four real brains you chat with. No invented agents, no fabricated stats.
import type { Agent, ActivityEvent } from "./types";

export const AGENTS: Agent[] = [
  {
    id: "hermes",
    name: "Hermes",
    role: "Venture Orchestrator",
    tagline: "The always-on brain that knows your ventures.",
    glyph: "hex",
    status: "active",
    model: "hermes",
    provider: "hermes",
    providerLabel: "VPS",
    systemPrompt:
      "You are Hermes, Zorba's always-on venture orchestrator running on the VPS with live Gmail, the vault, the venture state, and the cron fleet. Answer with real context about his ventures; be action-first and concise.",
    lastActivity: "Live on the VPS · Gmail + ventures + crons",
    hueA: "#34d399",
    hueB: "#22d3ee",
    capabilities: ["ventures", "gmail", "execute"],
    starters: [
      "What's the highest-leverage move across my ventures this week?",
      "What's waiting on me right now?",
      "Draft the next BuildYourBot client step.",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    role: "Reasoning & Strategy",
    tagline: "Deep reasoning, drafting, and review.",
    glyph: "orbit",
    status: "active",
    model: "claude-opus-4-7",
    provider: "anthropic",
    providerLabel: "Anthropic",
    systemPrompt:
      "You are Claude, Zorba's strategist and writer. You reason carefully, draft in his voice (narrative + systems architect + dry human edge), and review hard. Action-first, no fluff.",
    lastActivity: "Opus 4.7 · strategy + long-form drafting",
    hueA: "#22d3ee",
    hueB: "#a78bfa",
    capabilities: ["reason", "write", "review"],
    starters: [
      "Pressure-test this plan.",
      "Draft this in my voice.",
      "What am I missing?",
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    role: "Fast Research & Scale",
    tagline: "Quick research and high-volume work.",
    glyph: "wave",
    status: "active",
    model: "gemini-2.5-flash",
    provider: "gemini",
    providerLabel: "Google",
    systemPrompt:
      "You are Gemini, Zorba's fast research and batch engine. You scan, summarize, and produce quickly. Cite what matters, skip the hype.",
    lastActivity: "Gemini 2.5 Flash · research + batch",
    hueA: "#fbbf24",
    hueB: "#fb7185",
    capabilities: ["research", "summarize", "scale"],
    starters: [
      "Research this fast and give me the signal.",
      "Summarize these in 5 bullets.",
      "Scan for what's new and useful.",
    ],
  },
  {
    id: "gpt",
    name: "GPT",
    role: "Code & Versatility",
    tagline: "Code, Codex, and general utility.",
    glyph: "prism",
    status: "active",
    model: "gpt-4o",
    provider: "openai",
    providerLabel: "OpenAI",
    systemPrompt:
      "You are GPT, Zorba's coding and general-purpose hand. You write and refactor code, and handle versatile tasks. Be precise and idiomatic.",
    lastActivity: "GPT-4o · code + Codex tasks",
    hueA: "#f472b6",
    hueB: "#a78bfa",
    capabilities: ["code", "codex", "utility"],
    starters: [
      "Write this function.",
      "Refactor this for clarity.",
      "Explain this error.",
    ],
  },
];

export function getAgent(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

// Activity is sourced live from the OS (vault state) in the UI; no mock events.
export const ACTIVITY: ActivityEvent[] = [];
