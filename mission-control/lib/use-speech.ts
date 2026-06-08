"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechStatus = "idle" | "listening" | "denied" | "unsupported" | "error";

type Options = {
  lang?: string;
  onFinal?: (text: string) => void;
  onInterim?: (text: string) => void;
};

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

type SpeechResultEvent = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    [index: number]: { transcript: string };
  }>;
};

type SpeechErrorEvent = { error: string };

declare global {
  interface Window {
    SpeechRecognition?: new () => SR;
    webkitSpeechRecognition?: new () => SR;
  }
}

export function useSpeechRecognition(opts: Options = {}) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [interim, setInterim] = useState("");
  const recRef = useRef<SR | null>(null);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }
    const r = new Ctor();
    r.lang = optsRef.current.lang ?? "en-US";
    r.continuous = true;
    r.interimResults = true;

    r.onstart = () => setStatus("listening");
    r.onresult = (e) => {
      let live = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const t = res[0].transcript;
        if (res.isFinal) final += t;
        else live += t;
      }
      if (final) optsRef.current.onFinal?.(final);
      setInterim(live);
      if (live) optsRef.current.onInterim?.(live);
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setStatus("denied");
      } else if (e.error === "no-speech" || e.error === "aborted") {
        // benign — leave status to onend
      } else {
        setStatus("error");
      }
    };
    r.onend = () => {
      setStatus((s) => (s === "listening" ? "idle" : s));
      setInterim("");
    };

    recRef.current = r;
    return () => {
      try {
        r.abort();
      } catch {
        /* noop */
      }
      recRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    const r = recRef.current;
    if (!r) return;
    setInterim("");
    try {
      r.start();
    } catch {
      // already started
    }
  }, []);

  const stop = useCallback(() => {
    const r = recRef.current;
    if (!r) return;
    try {
      r.stop();
    } catch {
      /* noop */
    }
  }, []);

  const toggle = useCallback(() => {
    if (status === "listening") stop();
    else start();
  }, [status, start, stop]);

  return {
    status,
    interim,
    start,
    stop,
    toggle,
    supported: status !== "unsupported",
  };
}
