import Link from "next/link";
import { site } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="flex flex-wrap justify-between gap-4 border-t border-line pt-7 pb-10 type-label text-secondary">
      <span>© 2026 {site.name}</span>
      <div className="flex gap-7">
        {site.instagram ? (
          <a href={site.instagram} className="hover:text-primary">
            Instagram
          </a>
        ) : (
          <span>Instagram</span>
        )}
        <Link href="/contact" className="hover:text-primary">
          Print enquiries
        </Link>
      </div>
    </footer>
  );
}
