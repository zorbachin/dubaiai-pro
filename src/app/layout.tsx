import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Audit Engine — DubaiAI.pro",
  description:
    "Get a personalised AI implementation audit for your business in minutes. We research, crawl, and synthesise — you ship.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-line bg-bg/80 backdrop-blur sticky top-0 z-30">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <a href="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold" />
              DubaiAI<span className="text-muted">.pro</span>
            </a>
            <nav className="flex items-center gap-1 text-sm">
              <a className="px-3 py-1.5 text-muted hover:text-ink" href="/audit">New audit</a>
              <a className="px-3 py-1.5 text-muted hover:text-ink" href="/admin">Admin</a>
              <a href="/audit" className="btn-primary text-sm">Get my audit</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-line">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-sm text-muted">
            <div>© {new Date().getFullYear()} DubaiAI.pro</div>
            <div>Built with Next.js · Supabase · OpenAI · Resend · Inngest</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
