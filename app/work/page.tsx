import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import WorkIndex from "@/components/WorkIndex";
import { getAllSeries } from "@/lib/series";

export const metadata: Metadata = pageMetadata({ title: "Work", path: "/work/" });

export default function WorkPage() {
  return <WorkIndex series={getAllSeries()} />;
}
