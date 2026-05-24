"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Activity,
  ScrollText,
  ListChecks,
  Target,
  BookText,
  Radar,
  Sunrise,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const nav = [
  { href: "/", label: "The Scroll", icon: Sunrise },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/scout", label: "Automation Scout", icon: Radar },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/journal", label: "Journal", icon: BookText },
  { href: "/systems", label: "Systems", icon: Activity },
  { href: "/logs", label: "Activity", icon: ScrollText },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[color:var(--color-ink-dim)] transition hover:text-white"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-5 py-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-cyan-400/20 to-violet-500/20">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-display text-base font-semibold tracking-tight">Mission Control</span>
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[color:var(--color-ink-dim)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1">
                {nav.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        active
                          ? "border border-cyan-400/40 bg-gradient-to-br from-cyan-400/15 to-violet-500/15 text-white"
                          : "text-[color:var(--color-ink-dim)] hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
