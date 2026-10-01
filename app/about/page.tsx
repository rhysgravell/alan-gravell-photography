import type { Metadata } from "next";
import Photo from "@/components/Photo";
import { site } from "@/content/site";
import { upTo } from "@/lib/format";
import { getImage } from "@/lib/images";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const { portrait, bio, exhibitions } = site.about;
  const image = portrait.image
    ? getImage(portrait.image, "content/site.ts about.portrait")
    : undefined;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-16 pt-16 pb-24">
      <figure className="flex max-w-[520px] flex-col gap-3.5">
        <Photo
          image={image}
          width={image?.width ?? portrait.width}
          height={image?.height ?? portrait.height}
          sizes={upTo(520)}
          alt={`Portrait of ${site.name}`}
          placeholder="Portrait of the photographer · 4:5"
          priority
        />
        <figcaption className="type-label text-secondary">{portrait.caption}</figcaption>
      </figure>

      <div className="flex flex-col gap-12">
        <h1 className="type-display-l">{site.name}</h1>
        <div className="flex max-w-(--measure) flex-col gap-5 type-body-l text-pretty">
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <section aria-labelledby="exhibitions-heading">
          <h2
            id="exhibitions-heading"
            className="border-b border-line pb-3 type-label text-secondary"
          >
            Selected exhibitions
          </h2>
          <ul>
            {exhibitions.map(({ year, text }) => (
              <li
                key={`${year} ${text}`}
                className="grid grid-cols-[72px_minmax(0,1fr)] gap-5 border-b border-line py-3.5 type-body-s"
              >
                <span className="type-label text-secondary">{year}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
