// Server-only module — used exclusively from API routes (Node runtime).
import { promises as fs } from "node:fs";
import path from "node:path";
import { homedir, platform } from "node:os";

const FOLDER = process.env.OBSIDIAN_AGENTIC_OS_FOLDER || "Agentic OS";
const GOALS_FILE = "Goals.md";

type ObsidianConfig = {
  vaults?: Record<string, { path: string; ts?: number; open?: boolean }>;
};

async function readJsonSafe<T>(p: string): Promise<T | null> {
  try {
    const buf = await fs.readFile(p, "utf8");
    return JSON.parse(buf) as T;
  } catch {
    return null;
  }
}

function obsidianConfigCandidates(): string[] {
  const home = homedir();
  const p = platform();
  if (p === "darwin") {
    return [path.join(home, "Library/Application Support/obsidian/obsidian.json")];
  }
  if (p === "win32") {
    return [
      path.join(home, "AppData/Roaming/obsidian/obsidian.json"),
      path.join(home, "AppData/Roaming/Obsidian/obsidian.json"),
    ];
  }
  return [
    path.join(home, ".config/obsidian/obsidian.json"),
    path.join(home, ".var/app/md.obsidian.Obsidian/config/obsidian/obsidian.json"),
  ];
}

async function resolveVaultPath(): Promise<{ path: string | null; source: string }> {
  const explicit = process.env.OBSIDIAN_VAULT_PATH;
  if (explicit) return { path: explicit, source: "OBSIDIAN_VAULT_PATH" };

  const id = process.env.OBSIDIAN_VAULT_ID;
  if (!id) return { path: null, source: "missing" };

  for (const cfgPath of obsidianConfigCandidates()) {
    const cfg = await readJsonSafe<ObsidianConfig>(cfgPath);
    const vault = cfg?.vaults?.[id];
    if (vault?.path) return { path: vault.path, source: cfgPath };
  }
  return { path: null, source: "not-found-in-config" };
}

export type VaultStatus =
  | {
      connected: true;
      vaultPath: string;
      folder: string;
      folderRelative: string;
      source: string;
    }
  | {
      connected: false;
      reason: string;
      hint?: string;
    };

export async function getVaultStatus(): Promise<VaultStatus> {
  const { path: vaultPath, source } = await resolveVaultPath();
  if (!vaultPath) {
    return {
      connected: false,
      reason:
        source === "missing"
          ? "OBSIDIAN_VAULT_ID (or OBSIDIAN_VAULT_PATH) is not set."
          : "Could not find that vault in Obsidian's config on this machine.",
      hint: "Add OBSIDIAN_VAULT_ID to mission-control/.env.local and restart `npm run dev`.",
    };
  }
  try {
    const stat = await fs.stat(vaultPath);
    if (!stat.isDirectory()) {
      return { connected: false, reason: "Vault path is not a directory.", hint: vaultPath };
    }
  } catch {
    return {
      connected: false,
      reason: "Vault path does not exist on this machine.",
      hint: vaultPath,
    };
  }
  const folder = path.join(vaultPath, FOLDER);
  return {
    connected: true,
    vaultPath,
    folder,
    folderRelative: path.relative(vaultPath, folder),
    source,
  };
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function timeOfDay(): string {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function safeFileName(s: string): string {
  return (
    s
      .normalize("NFKD")
      .replace(/[^\w\s.-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80) || "untitled"
  );
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

function escapeYaml(s: string): string {
  return JSON.stringify(s);
}

function relativeToVault(file: string, vaultPath: string): string {
  return path.relative(vaultPath, file);
}

// ─── Chats ──────────────────────────────────────────────────────────────────

export type ChatPayload = {
  agentId: string;
  agentName: string;
  model: string;
  role: "user" | "assistant";
  content: string;
};

export async function appendChatMessage(p: ChatPayload) {
  const status = await getVaultStatus();
  if (!status.connected) return { ok: false as const, error: status.reason };

  const date = today();
  const dir = path.join(status.folder, "Chats", safeFileName(p.agentName));
  await ensureDir(dir);
  const file = path.join(dir, `${date}.md`);

  let existing = "";
  try {
    existing = await fs.readFile(file, "utf8");
  } catch {
    existing = [
      "---",
      `agent: ${p.agentId}`,
      `agent_name: ${escapeYaml(p.agentName)}`,
      `date: ${date}`,
      `model: ${p.model}`,
      `source: Mission Control`,
      "---",
      "",
      `# Chat with ${p.agentName} · ${date}`,
      "",
    ].join("\n");
  }

  const label = p.role === "user" ? "You" : p.agentName;
  const block = `## ${timeOfDay()} · ${label}\n\n${p.content.trim()}\n\n`;

  await fs.writeFile(file, existing + block, "utf8");
  return { ok: true as const, file: relativeToVault(file, status.vaultPath) };
}

// ─── Goals (checkbox task list) ─────────────────────────────────────────────

export type Goal = {
  id: string;
  done: boolean;
  title: string;
  description?: string;
  created?: string;
};

const GOALS_HEADER = [
  "---",
  "source: Mission Control",
  "type: goals",
  "---",
  "",
  "# Goals",
  "",
  "_Auto-managed by Mission Control. Tick boxes here or in the app — they stay in sync._",
  "",
].join("\n");

const GOAL_LINE_RE =
  /^(\s*)-\s+\[([ xX])\]\s+(.*?)(?:\s+\^goal-([a-z0-9]+))?\s*$/;

function parseGoalsBody(body: string): Goal[] {
  const lines = body.split("\n");
  const goals: Goal[] = [];
  let current: Goal | null = null;
  for (const line of lines) {
    const m = line.match(GOAL_LINE_RE);
    if (m) {
      const done = m[2].toLowerCase() === "x";
      let titlePart = m[3];
      const id = m[4] ?? shortId();
      const createdMatch = titlePart.match(/\s+·\s+(\d{4}-\d{2}-\d{2})\s*$/);
      let created: string | undefined;
      if (createdMatch?.index !== undefined) {
        created = createdMatch[1];
        titlePart = titlePart.slice(0, createdMatch.index).trim();
      }
      current = { id, done, title: titlePart.trim(), created };
      goals.push(current);
      continue;
    }
    if (current && /^\s{2,}\S/.test(line)) {
      const text = line.replace(/^\s{2}/, "");
      current.description = current.description ? current.description + "\n" + text : text;
    }
  }
  return goals;
}

export async function listGoals(): Promise<{ ok: boolean; items: Goal[]; error?: string }> {
  const s = await getVaultStatus();
  if (!s.connected) return { ok: false, items: [], error: s.reason };
  const file = path.join(s.folder, GOALS_FILE);
  try {
    const raw = await fs.readFile(file, "utf8");
    const { body } = parseFrontmatter(raw);
    return { ok: true, items: parseGoalsBody(body) };
  } catch {
    return { ok: true, items: [] };
  }
}

export async function addGoal(p: { title: string; description?: string }) {
  const s = await getVaultStatus();
  if (!s.connected) return { ok: false as const, error: s.reason };
  await ensureDir(s.folder);
  const file = path.join(s.folder, GOALS_FILE);

  let raw = "";
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    raw = GOALS_HEADER;
  }

  const id = shortId();
  const title = p.title.trim();
  const dateSuffix = ` · ${today()}`;
  const main = `- [ ] ${title}${dateSuffix} ^goal-${id}`;
  const desc = p.description?.trim()
    ? "\n" + p.description.trim().split("\n").map((l) => "  " + l).join("\n")
    : "";
  const sep = raw.endsWith("\n") ? "" : "\n";
  await fs.writeFile(file, raw + sep + main + desc + "\n", "utf8");
  return { ok: true as const, id };
}

export async function toggleGoal(id: string) {
  const s = await getVaultStatus();
  if (!s.connected) return { ok: false as const, error: s.reason };
  const file = path.join(s.folder, GOALS_FILE);
  let raw = "";
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return { ok: false as const, error: "Goals file not found." };
  }
  const safe = id.replace(/[^a-z0-9]/g, "");
  const re = new RegExp(
    `^(\\s*-\\s+\\[)([ xX])(\\]\\s+.+?\\s+\\^goal-${safe}\\s*)$`,
    "m"
  );
  if (!re.test(raw)) return { ok: false as const, error: "Goal not found." };
  const updated = raw.replace(re, (_m, p1, mark, p3) =>
    `${p1}${mark.toLowerCase() === " " ? "x" : " "}${p3}`
  );
  await fs.writeFile(file, updated, "utf8");
  return { ok: true as const };
}

export async function deleteGoal(id: string) {
  const s = await getVaultStatus();
  if (!s.connected) return { ok: false as const, error: s.reason };
  const file = path.join(s.folder, GOALS_FILE);
  let raw = "";
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return { ok: false as const, error: "Goals file not found." };
  }
  const safe = id.replace(/[^a-z0-9]/g, "");
  const lines = raw.split("\n");
  const out: string[] = [];
  let skipping = false;
  const target = new RegExp(`\\^goal-${safe}\\b`);
  for (const line of lines) {
    if (skipping) {
      if (/^\s{2,}\S/.test(line)) continue;
      skipping = false;
    }
    if (target.test(line)) {
      skipping = true;
      continue;
    }
    out.push(line);
  }
  await fs.writeFile(file, out.join("\n"), "utf8");
  return { ok: true as const };
}

// ─── Journal (one file per day) ─────────────────────────────────────────────

export type JournalPayload = {
  title?: string;
  body: string;
  mood?: string;
};

export async function appendJournal(p: JournalPayload) {
  const status = await getVaultStatus();
  if (!status.connected) return { ok: false as const, error: status.reason };

  const dir = path.join(status.folder, "Journal");
  await ensureDir(dir);
  const file = path.join(dir, `${today()}.md`);

  let existing = "";
  try {
    existing = await fs.readFile(file, "utf8");
  } catch {
    existing = [
      "---",
      `date: ${today()}`,
      `source: Mission Control`,
      "---",
      "",
      `# Journal · ${today()}`,
      "",
    ].join("\n");
  }

  const header = `## ${timeOfDay()}${p.title ? ` · ${p.title}` : ""}${
    p.mood ? `  _(${p.mood})_` : ""
  }`;
  const block = `${header}\n\n${p.body.trim()}\n\n`;
  await fs.writeFile(file, existing + block, "utf8");
  return { ok: true as const, file: relativeToVault(file, status.vaultPath) };
}

export type JournalEntry = {
  time: string;
  title?: string;
  body: string;
};

export type JournalDay = {
  date: string;
  file: string;
  preview: string;
  entries: number;
};

export async function listJournalDays(): Promise<{
  ok: boolean;
  items: JournalDay[];
  error?: string;
}> {
  const status = await getVaultStatus();
  if (!status.connected) return { ok: false, items: [], error: status.reason };
  const dir = path.join(status.folder, "Journal");
  try {
    const entries = await fs.readdir(dir);
    const items = await Promise.all(
      entries
        .filter((f) => f.endsWith(".md"))
        .map(async (f) => {
          const raw = await fs.readFile(path.join(dir, f), "utf8");
          const { body } = parseFrontmatter(raw);
          const count = (body.match(/^##\s+/gm) || []).length;
          return {
            date: f.replace(/\.md$/, ""),
            file: f,
            preview: extractFirstParagraph(body, 220),
            entries: count,
          };
        })
    );
    items.sort((a, b) => b.date.localeCompare(a.date));
    return { ok: true, items };
  } catch {
    return { ok: true, items: [] };
  }
}

export async function readJournalDay(
  date: string
): Promise<{ ok: boolean; entries: JournalEntry[]; error?: string }> {
  const status = await getVaultStatus();
  if (!status.connected) return { ok: false, entries: [], error: status.reason };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return { ok: false, entries: [], error: "Invalid date." };
  const file = path.join(status.folder, "Journal", `${date}.md`);
  let raw = "";
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return { ok: true, entries: [] };
  }
  const { body } = parseFrontmatter(raw);
  const entries: JournalEntry[] = [];
  const re = /^##\s+(\d{2}:\d{2}:\d{2})(?:\s+·\s+([^\n]+?))?\s*$/gm;
  const matches: { idx: number; time: string; title?: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    matches.push({ idx: m.index + m[0].length, time: m[1], title: m[2]?.trim() });
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].idx;
    const end = i + 1 < matches.length ? body.lastIndexOf("\n##", matches[i + 1].idx) : body.length;
    entries.push({
      time: matches[i].time,
      title: matches[i].title,
      body: body.slice(start, end).trim(),
    });
  }
  return { ok: true, entries };
}

// ─── Frontmatter parser (yaml-lite) ─────────────────────────────────────────

function parseFrontmatter(raw: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { frontmatter: {}, body: raw };
  const fm: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const val = kv[2].trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      fm[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (val.startsWith('"') && val.endsWith('"')) {
      try {
        fm[key] = JSON.parse(val);
      } catch {
        fm[key] = val.slice(1, -1);
      }
    } else {
      fm[key] = val;
    }
  }
  return { frontmatter: fm, body: m[2] };
}

function extractFirstParagraph(body: string, max = 160): string {
  const cleaned = body
    .replace(/^#.*$/gm, "")
    .replace(/^---[\s\S]*?---/m, "")
    .trim();
  const para = cleaned.split(/\n\n+/).find((p) => p.trim().length) ?? "";
  const single = para.replace(/\n/g, " ").trim();
  return single.length > max ? single.slice(0, max - 1).trimEnd() + "…" : single;
}
