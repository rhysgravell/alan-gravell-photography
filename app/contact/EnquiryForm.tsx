"use client";

import { useActionState } from "react";
import { site } from "@/content/site";
import { sendEnquiry } from "./actions";

const fieldClass =
  "border-0 border-b border-line-strong bg-transparent py-2.5 type-body-l outline-none transition-colors duration-(--dur-quick) focus:border-accent";

export function EnquiryForm() {
  const { topics } = site.contact;
  const [state, action, pending] = useActionState(sendEnquiry, null);

  if (state?.ok) {
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

  // React clears the form after each submission, so a failed one is refilled
  // from what was sent.
  const values = state?.values;

  return (
    <form action={action} className="flex flex-col gap-8">
      {/* Radios rather than buttons, so the topic is sent without JavaScript. */}
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 type-label text-secondary">Regarding</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <label
              key={t}
              className="cursor-pointer border border-line-strong bg-transparent px-4 py-2.5 type-label text-primary transition-colors duration-(--dur-quick) has-checked:bg-primary has-checked:text-page has-focus-visible:outline-2 has-focus-visible:outline-accent"
            >
              <input
                type="radio"
                name="regarding"
                value={t}
                defaultChecked={t === (values?.regarding ?? topics[0])}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="type-label text-secondary">Name</span>
        <input
          name="name"
          required
          maxLength={200}
          autoComplete="name"
          defaultValue={values?.name}
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="type-label text-secondary">Email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          defaultValue={values?.email}
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="type-label text-secondary">Message</span>
        <textarea
          name="message"
          rows={5}
          maxLength={5000}
          placeholder="Which photograph, and anything else I should know"
          defaultValue={values?.message}
          className={`${fieldClass} resize-y placeholder:text-quiet`}
        />
      </label>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <input
        type="text"
        name="leave_blank"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {state?.ok === false && (
        <p role="alert" className="type-body-s text-secondary">
          {state.error} Please try again, or write to{" "}
          <a href={`mailto:${site.email}`} className="link text-primary">
            {site.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer self-start border border-line-strong bg-primary px-7 py-4 type-label-l text-page transition-colors duration-(--dur-quick) hover:bg-transparent hover:text-primary disabled:cursor-wait"
      >
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
