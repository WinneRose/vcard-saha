"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "vcard-saha:visited";

export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const alreadyCounted = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY);
    const method = alreadyCounted ? "GET" : "POST";

    fetch("/api/visits", { method, cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.count === "number") setCount(d.count);
        if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, "1");
      })
      .catch(() => {
        // silent — counter just won't show
      });
  }, []);

  if (count == null) return null;

  return (
    <p className="text-center text-xs tabular-nums text-slate-400">
      {count.toLocaleString("tr-TR")} ziyaret
    </p>
  );
}
