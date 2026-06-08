export type AgentStatus = "active" | "idle" | "thinking" | "paused" | "error";

export type AgentGlyph = "orbit" | "prism" | "hex" | "wave" | "shield" | "eye";

export type Provider = "anthropic" | "gemini" | "openai" | "hermes";

export type Agent = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  glyph: AgentGlyph;
  status: AgentStatus;
  model: string;
  provider: Provider;
  providerLabel: string;
  systemPrompt: string;
  lastActivity: string;
  hueA: string;
  hueB: string;
  capabilities: string[];
  starters: string[];
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  agentId?: string;
};

export type ActivityEvent = {
  id: string;
  agentId?: string;
  agentName?: string;
  type: "task" | "message" | "tool" | "deploy" | "warn" | "info";
  text: string;
  timestamp: number;
};
