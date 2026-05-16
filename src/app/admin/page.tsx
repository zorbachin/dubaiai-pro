import Link from "next/link";
import { cookies } from "next/headers";
import { requireServiceClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { AuditRow } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · DubaiAI.pro" };

const COOKIE = "dubaiai_admin";

async function isAuthed(): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false; // disabled until configured
  const c = await cookies();
  return c.get(COOKIE)?.value === env.ADMIN_PASSWORD;
}

export default async function AdminPage() {
  const ok = await isAuthed();
  if (!ok) return <LoginForm />;

  const sb = requireServiceClient();
  const { data, error } = await sb
    .from("audits")
    .select("id, business_name, website_url, contact_email, status, ai_readiness_score, is_featured, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <span className="pill-accent">Admin</span>
          <h1 className="mt-3 font-display text-3xl font-bold">Submitted audits</h1>
          <p className="mt-1 text-muted">{data?.length ?? 0} most recent submissions.</p>
        </div>
        <form action="/api/admin/logout" method="post"><button className="btn-ghost">Sign out</button></form>
      </div>

      {error && <div className="mt-4 text-sm text-red-300">{error.message}</div>}

      <div className="mt-8 overflow-x-auto rounded-xl border border-line">
        <table className="min-w-full text-sm">
          <thead className="bg-panel text-muted">
            <tr>
              <Th>Business</Th>
              <Th>URL</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Score</Th>
              <Th>Featured</Th>
              <Th>Created</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {(data as Pick<AuditRow, "id" | "business_name" | "website_url" | "contact_email" | "status" | "ai_readiness_score" | "is_featured" | "created_at">[] | null)?.map((a) => (
              <tr key={a.id} className="border-t border-line">
                <Td>{a.business_name}</Td>
                <Td><a className="hover:text-accent" href={a.website_url} target="_blank" rel="noreferrer">{a.website_url}</a></Td>
                <Td>{a.contact_email}</Td>
                <Td><span className={"pill " + statusTone(a.status)}>{a.status}</span></Td>
                <Td>{a.ai_readiness_score ?? "—"}</Td>
                <Td>
                  <form action={`/api/admin/audits/${a.id}/feature`} method="post">
                    <input type="hidden" name="featured" value={a.is_featured ? "false" : "true"} />
                    <button
                      type="submit"
                      className={"pill cursor-pointer " + (a.is_featured ? "!text-gold !border-gold/30 !bg-gold/10" : "")}
                      title={a.is_featured ? "Unfeature" : "Feature on /case-studies"}
                    >
                      {a.is_featured ? "★ featured" : "feature"}
                    </button>
                  </form>
                </Td>
                <Td>{new Date(a.created_at).toLocaleString()}</Td>
                <Td>
                  <Link className="hover:text-accent" href={`/audit/${a.id}`}>Open →</Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function statusTone(s: string) {
  if (s === "complete") return "!text-emerald-300 !border-emerald-400/30 !bg-emerald-400/10";
  if (s === "failed") return "!text-red-300 !border-red-400/30 !bg-red-400/10";
  return "!text-gold !border-gold/30 !bg-gold/10";
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-3 py-2 text-left font-medium">{children}</th>;
}
function Td({ children }: { children?: React.ReactNode }) {
  return <td className="px-3 py-2 align-middle">{children}</td>;
}

function LoginForm() {
  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <span className="pill-accent">Admin</span>
      <h1 className="mt-3 font-display text-3xl font-bold">Sign in</h1>
      <p className="mt-1 text-muted">
        MVP uses a shared password (set <code>ADMIN_PASSWORD</code>). Replace with proper Supabase auth in v2.
      </p>
      <form className="card mt-6" action="/api/admin/login" method="post">
        <label className="label" htmlFor="password">Password</label>
        <input className="input" type="password" id="password" name="password" required />
        <button className="btn-primary mt-4 w-full">Sign in</button>
      </form>
    </div>
  );
}
