"use client";

import Link from "next/link";

// Shown in place of a page that fails to render, inside the site header and
// footer. Matches not-found.tsx. Errors in the root layout itself fall through
// to Next's built-in page.
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 py-36">
      <p className="type-label text-secondary">Error</p>
      <h1 className="type-display-l">Something went wrong.</h1>
      <div className="flex flex-wrap gap-8">
        <button type="button" onClick={() => retry()} className="link type-label-l">
          Try again
        </button>
        <Link href="/work" className="link type-label-l">
          View the work →
        </Link>
      </div>
    </div>
  );
}
