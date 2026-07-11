"use client";

import { useState, useTransition } from "react";

function parseCsv(text: string) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((header) => header.trim());
  return lines
    .filter(Boolean)
    .map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    });
}

export function ImportConversions() {
  const [csv, setCsv] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    setMessage("");
    const rows = parseCsv(csv);
    startTransition(async () => {
      const response = await fetch("/api/admin/conversions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const payload = await response.json();
      setMessage(response.ok ? `Imported ${payload.imported} conversion rows.` : payload.error ?? "Import failed.");
      if (response.ok) setCsv("");
    });
  }

  return (
    <section className="border border-[#d9d4c7] bg-white p-5">
      <h2 className="text-xl font-bold">Import affiliate report</h2>
      <p className="mt-1 text-sm leading-6 text-[#66736a]">
        Paste CSV with columns: network, order_id, post_slug, gear_name, sale_amount, commission_amount, currency, occurred_at.
      </p>
      <textarea
        className="mt-4 min-h-40 w-full border border-[#c9c2b4] px-3 py-2 font-mono text-sm"
        value={csv}
        onChange={(event) => setCsv(event.target.value)}
        placeholder="network,order_id,post_slug,gear_name,sale_amount,commission_amount,currency,occurred_at"
      />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {message ? <p className="text-sm font-semibold text-[#176b4d]">{message}</p> : <span />}
        <button
          type="button"
          disabled={isPending || !csv.trim()}
          onClick={submit}
          className="min-h-11 bg-[#176b4d] px-5 py-2 font-bold text-white disabled:opacity-60"
        >
          {isPending ? "Importing..." : "Import conversions"}
        </button>
      </div>
    </section>
  );
}
