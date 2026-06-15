import { notFound } from "next/navigation";
import { DetailShell } from "@/components/detail-shell";
import { Header } from "@/components/header";
import { dimensions, dimensionsById } from "@/content/memory-content";

export function generateStaticParams() {
  return dimensions.map((dimension) => ({ id: dimension.id }));
}

export default async function DimensionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dimension = dimensionsById[id];

  if (!dimension) {
    notFound();
  }

  return (
    <div>
      <Header />
      <DetailShell dimension={dimension} />
    </div>
  );
}
