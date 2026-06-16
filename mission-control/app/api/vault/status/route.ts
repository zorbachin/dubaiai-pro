import { getVaultStatus } from "@/lib/vault";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getVaultStatus();
  return Response.json(status);
}
