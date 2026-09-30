"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Static, not sticky: nothing floats over the photographs. The active item
// takes primary colour and the oxide dot, the view's one use of the accent.
// A series or plate page counts as Work.
export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 pt-9 pb-8">
      <Link
        href="/"
        className="font-serif text-[26px] leading-none font-normal tracking-[0.01em]"
      >
        {site.name}
      </Link>
      <nav aria-label="Main">
        <ul className="flex gap-8">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 type-label-l transition-colors duration-(--dur-quick) hover:text-primary ${
                    active ? "text-primary" : "text-secondary"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`size-[5px] rounded-full bg-accent ${active ? "" : "opacity-0"}`}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
