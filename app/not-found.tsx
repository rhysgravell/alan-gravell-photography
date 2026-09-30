import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-6 py-36">
      <p className="type-label text-secondary">Not found</p>
      <h1 className="type-display-l">Nothing is hung here.</h1>
      <Link href="/work" className="link type-label-l">
        View the work →
      </Link>
    </div>
  );
}
