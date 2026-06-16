"use client";

import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { useSpeechRecognition } from "@/lib/use-speech";

type Setter = React.Dispatch<React.SetStateAction<string>>;

function append(prev: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return prev;
  const sep = prev && !prev.endsWith(" ") && !prev.endsWith("\n") ? " " : "";
  return prev + sep + trimmed;
}

/**
 * A microphone button that dictates speech into a string setter.
 */
export function MicButton({
  setValue,
  size = "md",
  className = "",
  label,
}: {
  setValue: Setter;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}) {
  const speech = useSpeechRecognition({
    onFinal: (text) => setValue((prev) => append(prev, text)),
  });
  const listening = speech.status === "listening";
  const denied = speech.status === "denied";
  const unsupported = speech.status === "unsupported";

  const dim = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  const title = unsupported
    ? "Voice input not supported in this browser"
    : denied
    ? "Microphone permission denied"
    : listening
    ? "Stop listening"
    : label ?? "Voice input · click and speak";

  return (
    <button
      onClick={speech.toggle}
      disabled={unsupported || denied}
      title={title}
      aria-label={title}
      aria-pressed={listening}
      className={`relative grid ${dim} place-items-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30 ${
        listening
          ? "border-rose-400/50 bg-rose-500/15 text-rose-200 shadow-[0_0_22px_rgba(251,113,133,0.45)]"
          : denied || unsupported
          ? "border-white/10 bg-white/[0.02] text-rose-300/60"
          : "border-white/10 bg-white/[0.03] text-[color:var(--color-ink-mute)] hover:bg-white/[0.06] hover:text-white"
      } ${className}`}
    >
      {listening && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-lg bg-rose-400/30 animate-ping" />
          <span className="pointer-events-none absolute -inset-1 rounded-xl bg-rose-400/10 blur-md" />
        </>
      )}
      {denied || unsupported ? (
        <MicOff className="relative h-4 w-4" />
      ) : (
        <Mic className="relative h-4 w-4" />
      )}
    </button>
  );
}

/**
 * A textarea wrapped with a mic button that appends spoken text.
 * Shows interim transcripts inline.
 */
export function VoiceTextarea({
  value,
  setValue,
  placeholder,
  rows = 4,
  className = "",
  autoFocus,
}: {
  value: string;
  setValue: Setter;
  placeholder?: string;
  rows?: number;
  className?: string;
  autoFocus?: boolean;
}) {
  const speech = useSpeechRecognition({
    onFinal: (text) => setValue((prev) => append(prev, text)),
  });
  const listening = speech.status === "listening";
  const denied = speech.status === "denied";
  const unsupported = speech.status === "unsupported";

  return (
    <div
      className={`relative rounded-xl border bg-white/[0.03] transition focus-within:bg-white/[0.05] ${
        listening
          ? "border-rose-400/50 focus-within:border-rose-400/60"
          : "border-white/10 focus-within:border-cyan-400/40"
      } ${className}`}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={listening ? "Listening…" : placeholder}
        rows={rows}
        autoFocus={autoFocus}
        onKeyDown={(e) => {
          if (e.key === "Escape" && listening) {
            e.preventDefault();
            speech.stop();
          }
        }}
        className="block w-full resize-y bg-transparent px-4 py-3 pr-12 text-[14px] outline-none placeholder:text-[color:var(--color-ink-mute)]"
      />
      <div className="pointer-events-none absolute right-2 top-2">
        <button
          type="button"
          onClick={speech.toggle}
          disabled={unsupported || denied}
          title={
            unsupported
              ? "Voice not supported"
              : denied
              ? "Mic permission denied"
              : listening
              ? "Stop listening"
              : "Voice input"
          }
          className={`pointer-events-auto relative grid h-8 w-8 place-items-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30 ${
            listening
              ? "border-rose-400/50 bg-rose-500/15 text-rose-200 shadow-[0_0_22px_rgba(251,113,133,0.45)]"
              : "border-white/10 bg-white/[0.04] text-[color:var(--color-ink-mute)] hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          {listening && (
            <span className="pointer-events-none absolute inset-0 rounded-lg bg-rose-400/30 animate-ping" />
          )}
          {denied || unsupported ? (
            <MicOff className="relative h-4 w-4" />
          ) : (
            <Mic className="relative h-4 w-4" />
          )}
        </button>
      </div>
      {listening && (
        <div className="border-t border-rose-400/20 px-4 py-2 text-[12px] italic text-rose-200/85">
          <span className="mr-2 inline-flex items-end gap-[2px] align-middle">
            {[0.05, 0.2, 0.05, 0.25, 0.1].map((d, i) => (
              <motion.span
                key={i}
                className="block w-[2px] rounded-full bg-rose-400"
                animate={{ height: [4, 10, 4] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: d, ease: "easeInOut" }}
              />
            ))}
          </span>
          {speech.interim || "listening · speak now"}
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-rose-200/60">
            esc stop
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Single-line input wrapped with a mic button. Interim shown as ghost suffix.
 */
export function VoiceInput({
  value,
  setValue,
  placeholder,
  className = "",
  autoFocus,
  onSubmit,
}: {
  value: string;
  setValue: Setter;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
}) {
  const speech = useSpeechRecognition({
    onFinal: (text) => setValue((prev) => append(prev, text)),
  });
  const listening = speech.status === "listening";
  const denied = speech.status === "denied";
  const unsupported = speech.status === "unsupported";

  return (
    <div
      className={`relative flex items-center gap-2 rounded-xl border bg-white/[0.03] px-3 py-2 transition focus-within:bg-white/[0.05] ${
        listening
          ? "border-rose-400/50"
          : "border-white/10 focus-within:border-cyan-400/40"
      } ${className}`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={
          listening
            ? speech.interim
              ? speech.interim
              : "Listening…"
            : placeholder
        }
        autoFocus={autoFocus}
        onKeyDown={(e) => {
          if (e.key === "Escape" && listening) {
            e.preventDefault();
            speech.stop();
            return;
          }
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="flex-1 bg-transparent text-sm outline-none placeholder:italic placeholder:text-rose-200/60"
      />
      <button
        type="button"
        onClick={speech.toggle}
        disabled={unsupported || denied}
        title={
          unsupported
            ? "Voice not supported"
            : denied
            ? "Mic permission denied"
            : listening
            ? "Stop listening"
            : "Voice input"
        }
        className={`relative grid h-7 w-7 place-items-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-30 ${
          listening
            ? "border-rose-400/50 bg-rose-500/15 text-rose-200 shadow-[0_0_18px_rgba(251,113,133,0.4)]"
            : "border-white/10 bg-white/[0.04] text-[color:var(--color-ink-mute)] hover:bg-white/[0.08] hover:text-white"
        }`}
      >
        {listening && (
          <span className="pointer-events-none absolute inset-0 rounded-md bg-rose-400/30 animate-ping" />
        )}
        {denied || unsupported ? (
          <MicOff className="relative h-3.5 w-3.5" />
        ) : (
          <Mic className="relative h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
