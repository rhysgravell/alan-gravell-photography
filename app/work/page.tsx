import type { Metadata } from "next";
import WorkIndex from "@/components/WorkIndex";
import { getAllSeries } from "@/lib/series";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return <WorkIndex series={getAllSeries()} />;
}
