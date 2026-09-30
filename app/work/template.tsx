// Fades between the Work index and each series. See app/template.tsx.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="fade-in">{children}</div>;
}
