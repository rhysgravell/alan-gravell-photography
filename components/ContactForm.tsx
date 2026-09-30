"use client";

import { useState } from "react";
import { site } from "@/content/site";

// The site is a static export, so enquiries go to a hosted form service
// (Formspree or similar) rather than an API route. Set its URL in
// NEXT_PUBLIC_CONTACT_ENDPOINT; see .env.example.
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "border-0 border-b border-line-strong bg-transparent py-2.5 type-body-l outline-none transition-colors duration-(--dur-quick) focus:border-accent";

export default function ContactForm() {
  const { topics } = site.contact;
  const [topic, setTopic] = useState(topics[0]);
  const [status, setStatus] = useState<Status>("idle");

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ENDPOINT) {
      console.warn("NEXT_PUBLIC_CONTACT_ENDPOINT is not set; enquiry not sent.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col gap-4 border-t border-line pt-8"
      >
        <p className="type-display-m">Thank you.</p>
        <p className="max-w-(--measure) type-body text-secondary">
          Your note has been received. I reply to every enquiry personally,
          usually within a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 type-label text-secondary">Regarding</legend>
        <input type="hidden" name="regarding" value={topic} />
        <input
          type="hidden"
          name="_subject"
          value={`${topic} enquiry — ${site.name}`}
        />
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={`cursor-pointer border border-line-strong px-4 py-2.5 type-label transition-colors duration-(--dur-quick) ${
                topic === t ? "bg-primary text-page" : "bg-transparent text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="type-label text-secondary">Name</span>
        <input name="name" required autoComplete="name" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="type-label text-secondary">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="type-label text-secondary">Message</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Which photograph, and anything else I should know"
          className={`${fieldClass} resize-y placeholder:text-quiet`}
        />
      </label>

      {/* Honeypot: hidden from people, filled in by bots. Formspree drops any
          submission where _gotcha has a value. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {status === "error" && (
        <p role="alert" className="type-body-s text-secondary">
          Your enquiry could not be sent. Please try again, or write to{" "}
          <a href={`mailto:${site.email}`} className="link text-primary">
            {site.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer self-start border border-line-strong bg-primary px-7 py-4 type-label-l text-page transition-colors duration-(--dur-quick) hover:bg-transparent hover:text-primary disabled:cursor-wait"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
