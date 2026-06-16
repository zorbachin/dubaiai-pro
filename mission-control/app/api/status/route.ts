export const runtime = "nodejs";

export async function GET() {
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
  return Response.json({
    online: hasKey,
    model,
    hint: hasKey ? null : "Set ANTHROPIC_API_KEY in mission-control/.env.local",
  });
}
