import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-16 py-24">
      <div className="flex flex-col gap-8">
        <h1 className="type-display-xl">Enquiries</h1>
        <section
          aria-labelledby="editions-heading"
          className="flex max-w-(--measure) flex-col gap-3 bg-tint-sage p-8"
        >
          <h2 id="editions-heading" className="type-label text-secondary">
            Editions
          </h2>
          <p className="type-body-l text-pretty">{site.contact.editions}</p>
        </section>
        <div className="flex flex-col items-start gap-2 type-label-l">
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          <span className="text-secondary">{site.contact.visits}</span>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
