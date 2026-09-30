// Pages cross-fade in, per the motion rules. A template remounts when its
// segment changes, so this runs on every top-level page change. Moving
// between series is handled by app/work/template.tsx; moving between plates
// inside a series stays still, as the lightbox handles its own fade.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="fade-in">{children}</div>;
}
