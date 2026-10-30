"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { AgentUI } from "@/lib/mock-agent";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  ui?: AgentUI;
};

type ChatResponse = {
  answer?: string;
  error?: string;
  ui?: AgentUI;
};

function ShipmentTable({
  shipments,
}: {
  shipments: Extract<AgentUI, { type: "shipment_table" }>["shipments"];
}) {
  if (shipments.length === 0) {
    return (
      <p className="mt-4 text-sm text-slate-400">
        No delayed shipments found in the sample data.
      </p>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3">Shipment</th>
            <th className="p-3">Destination</th>
            <th className="p-3">Carrier</th>
            <th className="p-3">Expected</th>
            <th className="p-3">Delay</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="border-t border-slate-800">
              <td className="p-3 font-medium text-cyan-300">
                {shipment.id}
                <div className="text-xs font-normal text-slate-500">
                  {shipment.orderId}
                </div>
              </td>
              <td className="p-3">{shipment.destination}</td>
              <td className="p-3">{shipment.carrier}</td>
              <td className="p-3">{shipment.expectedDelivery}</td>
              <td className="p-3">
                <span className="rounded-full bg-red-950 px-2 py-1 text-red-300">
                  {shipment.delayDays} days
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShipmentDetail({
  shipment,
}: {
  shipment: Extract<AgentUI, { type: "shipment_detail" }>["shipment"];
}) {
  const fields = [
    ["Order", shipment.orderId],
    ["Destination", shipment.destination],
    ["Carrier", shipment.carrier],
    ["Status", shipment.status.replace("_", " ")],
    ["Expected delivery", shipment.expectedDelivery],
    ["Delay", `${shipment.delayDays} day(s)`],
    ["Recorded reason", shipment.reason ?? "None recorded"],
  ];

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-slate-700 bg-slate-950 p-4"
        >
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 font-medium capitalize text-slate-100">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: message },
    ]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data: ChatResponse = await response.json();
      console.log("data", data);
      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer ?? "No response was returned.",
          ui: data.ui ?? { type: "text" },
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to contact the assistant.",
      );
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "Which shipments are delayed?",
    "Show me shipment SHP-1003",
    "Find shipment SHP-1002",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
              SUPPLY CHAIN INTELLIGENCE
            </p>
            <h1 className="mt-2 text-3xl font-bold">Operations Copilot</h1>
            <p className="mt-2 text-sm text-slate-400">
              Explore shipments using conversational queries.
            </p>
          </div>
        </header>

        <section
          aria-label="Conversation"
          aria-live="polite"
          className="flex-1 space-y-5 py-6"
        >
          {messages.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold">
                What would you like to investigate?
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Choose a question or enter your own.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setInput(suggestion)}
                    className="rounded-xl border border-slate-700 px-3 py-2 text-left text-sm hover:border-cyan-500 hover:text-cyan-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-5 rounded-2xl bg-cyan-950 p-4 sm:ml-16 sm:p-5"
                  : "mr-2 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:mr-8 sm:p-5"
              }
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                {message.role === "user" ? "You" : "AI Copilot"}
              </p>
              <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-slate-200">
                {message.content}
              </p>

              {message.role === "assistant" &&
                message.ui?.type === "shipment_table" && (
                  <ShipmentTable shipments={message.ui.shipments} />
                )}

              {message.role === "assistant" &&
                message.ui?.type === "shipment_detail" && (
                  <ShipmentDetail shipment={message.ui.shipment} />
                )}
            </article>
          ))}

          {loading && (
            <p role="status" className="text-sm text-cyan-400">
              Copilot is checking the sample data...
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-800 bg-red-950 p-4 text-sm text-red-200"
            >
              {error}
            </div>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 border-t border-slate-800 bg-slate-950 py-4"
        >
          <label
            htmlFor="message"
            className="mb-2 block text-sm text-slate-400"
          >
            Ask about shipments
          </label>
          <div className="flex items-end gap-2 sm:gap-3">
            <textarea
              id="message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={2}
              maxLength={2000}
              disabled={loading}
              placeholder="e.g. Which shipments are delayed?"
              className="min-w-0 flex-1 resize-y rounded-xl border border-slate-700 bg-slate-900 p-3 outline-none focus:border-cyan-500 disabled:opacity-60 sm:p-4"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
            >
              {loading ? "Checking..." : "Ask"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
